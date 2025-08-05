const amqp = require('amqplib');

class MessageService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const rabbitmqUrl = `amqp://${process.env.RABBITMQ_USER || 'shopfinity'}:${process.env.RABBITMQ_PASSWORD || 'rabbit123'}@${process.env.RABBITMQ_HOST || 'rabbitmq'}:${process.env.RABBITMQ_PORT || 5672}`;
      
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
      
      this.connection.on('error', (err) => {
        console.error('❌ RabbitMQ connection error:', err);
        this.isConnected = false;
      });

      this.connection.on('close', () => {
        console.log('🔌 RabbitMQ connection closed');
        this.isConnected = false;
      });

      // Declare exchanges and queues
      await this.setupQueues();
      
      console.log('✅ RabbitMQ connected successfully');
      this.isConnected = true;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      this.isConnected = false;
    }
  }

  async setupQueues() {
    if (!this.channel) return;

    try {
      // Declare exchanges
      await this.channel.assertExchange('shopfinity.orders', 'topic', { durable: true });
      await this.channel.assertExchange('shopfinity.notifications', 'topic', { durable: true });
      await this.channel.assertExchange('shopfinity.inventory', 'topic', { durable: true });
      await this.channel.assertExchange('shopfinity.payments', 'topic', { durable: true });

      // Declare queues
      const queues = [
        'order.created',
        'order.updated',
        'order.cancelled',
        'payment.processed',
        'payment.failed',
        'inventory.updated',
        'email.notifications',
        'sms.notifications',
        'push.notifications'
      ];

      for (const queueName of queues) {
        await this.channel.assertQueue(queueName, {
          durable: true,
          arguments: {
            'x-message-ttl': 86400000, // 24 hours
            'x-max-retries': 3
          }
        });
      }

      // Bind queues to exchanges
      await this.channel.bindQueue('order.created', 'shopfinity.orders', 'order.created');
      await this.channel.bindQueue('order.updated', 'shopfinity.orders', 'order.updated');
      await this.channel.bindQueue('order.cancelled', 'shopfinity.orders', 'order.cancelled');
      
      await this.channel.bindQueue('payment.processed', 'shopfinity.payments', 'payment.processed');
      await this.channel.bindQueue('payment.failed', 'shopfinity.payments', 'payment.failed');
      
      await this.channel.bindQueue('inventory.updated', 'shopfinity.inventory', 'inventory.updated');
      
      await this.channel.bindQueue('email.notifications', 'shopfinity.notifications', 'email.*');
      await this.channel.bindQueue('sms.notifications', 'shopfinity.notifications', 'sms.*');
      await this.channel.bindQueue('push.notifications', 'shopfinity.notifications', 'push.*');

      console.log('📋 RabbitMQ queues and exchanges set up successfully');
    } catch (error) {
      console.error('Error setting up RabbitMQ queues:', error);
    }
  }

  async disconnect() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.isConnected = false;
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error);
    }
  }

  // Publish message to exchange
  async publish(exchange, routingKey, message, options = {}) {
    if (!this.isConnected || !this.channel) {
      console.error('RabbitMQ not connected');
      return false;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
        messageId: this.generateMessageId()
      }));

      const publishOptions = {
        persistent: true,
        timestamp: Date.now(),
        ...options
      };

      const result = this.channel.publish(exchange, routingKey, messageBuffer, publishOptions);
      
      if (result) {
        console.log(`📤 Message published to ${exchange}:${routingKey}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error publishing message:', error);
      return false;
    }
  }

  // Send message to queue directly
  async sendToQueue(queueName, message, options = {}) {
    if (!this.isConnected || !this.channel) {
      console.error('RabbitMQ not connected');
      return false;
    }

    try {
      const messageBuffer = Buffer.from(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString(),
        messageId: this.generateMessageId()
      }));

      const sendOptions = {
        persistent: true,
        timestamp: Date.now(),
        ...options
      };

      const result = this.channel.sendToQueue(queueName, messageBuffer, sendOptions);
      
      if (result) {
        console.log(`📤 Message sent to queue ${queueName}`);
      }
      
      return result;
    } catch (error) {
      console.error('Error sending message to queue:', error);
      return false;
    }
  }

  // Consume messages from queue
  async consume(queueName, callback, options = {}) {
    if (!this.isConnected || !this.channel) {
      console.error('RabbitMQ not connected');
      return false;
    }

    try {
      const consumeOptions = {
        noAck: false,
        ...options
      };

      await this.channel.consume(queueName, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            console.log(`📥 Message received from ${queueName}:`, content);
            
            await callback(content, msg);
            this.channel.ack(msg);
          } catch (error) {
            console.error('Error processing message:', error);
            this.channel.nack(msg, false, false); // Don't requeue failed messages
          }
        }
      }, consumeOptions);

      console.log(`👂 Listening for messages on queue: ${queueName}`);
      return true;
    } catch (error) {
      console.error('Error setting up consumer:', error);
      return false;
    }
  }

  // Order-related message methods
  async publishOrderCreated(orderData) {
    return await this.publish('shopfinity.orders', 'order.created', {
      type: 'ORDER_CREATED',
      orderId: orderData.id,
      userId: orderData.userId,
      total: orderData.total,
      items: orderData.items
    });
  }

  async publishOrderUpdated(orderData) {
    return await this.publish('shopfinity.orders', 'order.updated', {
      type: 'ORDER_UPDATED',
      orderId: orderData.id,
      status: orderData.status,
      updatedAt: orderData.updatedAt
    });
  }

  async publishPaymentProcessed(paymentData) {
    return await this.publish('shopfinity.payments', 'payment.processed', {
      type: 'PAYMENT_PROCESSED',
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod
    });
  }

  async publishInventoryUpdate(productId, newStock) {
    return await this.publish('shopfinity.inventory', 'inventory.updated', {
      type: 'INVENTORY_UPDATED',
      productId: productId,
      newStock: newStock,
      updatedAt: new Date().toISOString()
    });
  }

  async publishEmailNotification(emailData) {
    return await this.publish('shopfinity.notifications', 'email.send', {
      type: 'EMAIL_NOTIFICATION',
      to: emailData.to,
      subject: emailData.subject,
      template: emailData.template,
      data: emailData.data
    });
  }

  // Utility methods
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getQueueInfo(queueName) {
    if (!this.isConnected || !this.channel) return null;

    try {
      return await this.channel.checkQueue(queueName);
    } catch (error) {
      console.error('Error getting queue info:', error);
      return null;
    }
  }
}

// Export singleton instance
module.exports = new MessageService();