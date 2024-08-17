import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Shop.css';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import httpClient from './httpClients.ts';
import LoadingScreen from './LoadingScreen';

const Shop = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [basket, setBasket] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await httpClient.get('/products');
        setProducts(productResponse.data);
        setFilteredProducts(productResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const timer = setTimeout(() => {
      if (!loading) {
        setShowLoadingScreen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === '' || product.type === selectedCategory)
      )
    );
  }, [searchQuery, selectedCategory, products]);

  useEffect(() => {
    if (window.fd && !isLoggedIn) {
      window.fd('form', {
        formId: '64deced1c35bea8b6cf58fdc'
      });
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const initializeBasket = async () => {
      if (isLoggedIn) {
        try {
          const response = await httpClient.get("/api/get-basket");
          setBasket(response.data.basket);
        } catch (error) {
          console.error("Error fetching basket:", error);
        }
      } else {
        const savedBasket = localStorage.getItem('basket');
        if (savedBasket) {
          setBasket(JSON.parse(savedBasket));
        }
      }
    };

    initializeBasket();
  }, [isLoggedIn]);

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  const addToBasket = async (product, selectedSize) => {
    const existingProductIndex = basket.findIndex(
      item => item.id === product.id && item.selectedSize === selectedSize
    );
    let updatedBasket;

    if (existingProductIndex >= 0) {
      updatedBasket = [...basket];
      updatedBasket[existingProductIndex].quantity += 1;
    } else {
      updatedBasket = [
        ...basket,
        { ...product, quantity: 1, selectedSize }
      ];
    }

    setBasket(updatedBasket);

    if (isLoggedIn) {
      try {
        await httpClient.post("/api/update-basket", { basket: updatedBasket });
      } catch (error) {
        console.error("Error updating server basket:", error);
      }
    } else {
      localStorage.setItem('basket', JSON.stringify(updatedBasket));
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCategorySelect = (category) => setSelectedCategory(category);

  const toggleMenu = () => {
    const menu = document.querySelector(".menu-links-shop");
    const icon = document.querySelector(".hamburger-icon-shop");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
  };

  const handleProductClick = useCallback((product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (filteredProducts.length > 0 && imagesLoaded === filteredProducts.length) {
      setShowLoadingScreen(false);
    }
  }, [imagesLoaded, filteredProducts.length]);

  return (
    <div className="shop">
      {showLoadingScreen && <LoadingScreen />}

      {!showLoadingScreen && (
        <>
          <div className='buy-now'>
            <h1>BUY NOW</h1>
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
          </div>

          <div className="nav-and-category">
            <nav id="desktop-nav">
              <div>
                <ul className="nav-links">
                  {isLoggedIn ? (
                    <>
                      <li><Link to="/account">ACCOUNT</Link></li>
                      <li><Link to="/" onClick={handleLogout}>LOGOUT</Link></li>
                    </>
                  ) : (
                    <li><Link to="/login">LOGIN</Link></li>
                  )}
                  <li><Link to="/shop">SHOP</Link></li>
                  <li><Link to="/about">OUR MESSAGE</Link></li>
                  <li><Link to="/sizeguide">SIZE GUIDE</Link></li>
                  <li><Link to="/shipping">SHIPPING</Link></li>
                  <li><Link to="/contact">CONTACT US</Link></li>
                </ul>
              </div>
            </nav>
            <nav className="category-nav">
              <button onClick={() => handleCategorySelect('')}>All</button>
              <button onClick={() => handleCategorySelect('set')}>Sets</button>
              <button onClick={() => handleCategorySelect('tshirt')}>T-Shirts</button>
              <button onClick={() => handleCategorySelect('shorts')}>Shorts</button>
              <button onClick={() => handleCategorySelect('sock')}>Socks</button>
            </nav>
          </div>

          {error && <p className="error-message">Error loading products: {error.message}</p>}
          {!error && (
            <>
              {filteredProducts.length === 0 ? (
                <div className='none-found'>
                  <h1>NO ITEMS FOUND</h1>
                  <img src='./assets/img/zerohourslogo.jpeg' alt='No items found' />
                </div>
              ) : (
                <div className="products">
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                      onImageLoad={handleImageLoad} 
                    />
                  ))}
                </div>
              )}
            </>
          )}

          <nav id='hamburger-nav-shop'>
            <div className="hamburger-menu-shop">
              <div className="hamburger-icon-shop" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="menu-links-shop">
                {isLoggedIn ? (
                  <>
                    <li><Link to="/account" onClick={toggleMenu}>Account</Link></li>
                    <li><Link to="/" onClick={() => { handleLogout(); toggleMenu(); }}>Logout</Link></li>
                  </>
                ) : (
                  <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
                )}
                <li><Link to="/shop" onClick={toggleMenu}>Shop</Link></li>
                <li><Link to="/about" onClick={toggleMenu}>Our Message</Link></li>
                <li><Link to="/contact" onClick={toggleMenu}>Contact Us</Link></li>
              </div>
            </div>
          </nav>
          <div id='cart-container-shop'>
            <img
              src="./assets/img/icons8-cart-64.png"
              alt="Cart"
              className="icon"
              onClick={() => navigate('/cart')}
            />
          </div>
          <div id="logo-container-shop">
            <Link to="/">
              <img src='./assets/img/logo_nobg.png' alt="Our Logo" className="logo" />
            </Link>
          </div>
          <div id="socials-container-shop">
            <img src="./assets/img/icons8-instagram-24.png" alt="Our Instagram" className="icon" onClick={() => window.open('https://www.instagram.com/hourszer0/', '_blank')} />
            <img src="./assets/img/icons8-tiktok-24.png" alt="Our TikTok" className="icon" onClick={() => window.open('https://www.tiktok.com/@hourszero', '_blank')} />
            <img src="./assets/img/icons8-facebook-24.png" alt="Our Facebook" className="icon" onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')} />
            <img src="./assets/img/icons8-X-50.png" alt="Our X" className="icon" onClick={() => window.open('https://linkedin.com/in/joseph-macgowan-4a60a42b5', '_blank')} />
          </div>
          {modalOpen &&
            <ProductModal
              product={selectedProduct}
              onClose={handleCloseModal}
              addToBasket={addToBasket}
              isLoggedIn={isLoggedIn}
            />
          }
        </>
      )}
    </div>
  );
}

export default Shop;