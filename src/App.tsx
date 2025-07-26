import React, { useState, useMemo } from 'react';
import { AuthProvider } from './contexts/AuthProvider';
import { CartProvider } from './contexts/CartProvider';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Hero from './components/Home/Hero';
import FeaturedProducts from './components/Home/FeaturedProducts';
import Categories from './components/Home/Categories';
import ProductGrid from './components/Products/ProductGrid';
import ProductFilters from './components/Products/ProductFilters';
import ProductDetail from './components/Products/ProductDetail';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import UserProfile from './components/Profile/UserProfile';
import CheckoutFlow from './components/Checkout/CheckoutFlow';
import AdminDashboard from './components/Admin/AdminDashboard';
import { products, categories, reviews } from './data/mockData';
import { Product } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleNavigate = (page: string, productId?: string, category?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
    if (category) {
      setSelectedCategory(category);
    }
    if (page === 'products' && category) {
      setCurrentPage('products');
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSortBy('featured');
  };

  const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;
  const productReviews = selectedProductId ? reviews.filter(r => r.productId === selectedProductId) : [];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div>
            <Hero onNavigate={handleNavigate} />
            <Categories categories={categories} onNavigate={handleNavigate} />
            <FeaturedProducts products={products} onNavigate={handleNavigate} />
          </div>
        );
      
      case 'products':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>
              <p className="text-gray-600">
                Discover our amazing collection of {filteredAndSortedProducts.length} products
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-64 flex-shrink-0">
                <ProductFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  sortBy={sortBy}
                  onSortByChange={setSortBy}
                  onClearFilters={clearFilters}
                  isOpen={showMobileFilters}
                  onToggle={() => setShowMobileFilters(!showMobileFilters)}
                />
              </div>
              
              <div className="flex-1">
                <ProductGrid
                  products={filteredAndSortedProducts}
                  onNavigate={handleNavigate}
                />
              </div>
            </div>
          </div>
        );
      
      case 'product':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            reviews={productReviews}
            onNavigate={handleNavigate}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <button
              onClick={() => handleNavigate('products')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Products
            </button>
          </div>
        );
      
      case 'login':
        return <LoginForm onNavigate={handleNavigate} />;
      
      case 'register':
        return <RegisterForm onNavigate={handleNavigate} />;
      
      case 'profile':
        return <UserProfile onNavigate={handleNavigate} />;
      
      case 'checkout':
        return <CheckoutFlow onNavigate={handleNavigate} />;
      
      case 'admin':
        return <AdminDashboard onNavigate={handleNavigate} />;
      
      case 'orders':
        return (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order History</h2>
            <p className="text-gray-600">Redirecting to profile...</p>
            <script>
              {setTimeout(() => handleNavigate('profile'), 1000)}
            </script>
          </div>
        );
      
      default:
        return (
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page not found</h2>
            <button
              onClick={() => handleNavigate('home')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        );
    }
  };

  const showHeaderFooter = !['login', 'register'].includes(currentPage);

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && (
        <Header
          onNavigate={handleNavigate}
          currentPage={currentPage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      {showHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;