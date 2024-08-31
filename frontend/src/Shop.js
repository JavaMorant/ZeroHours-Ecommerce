import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Shop.css';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import httpClient from './httpClients.ts';
import LoadingScreen from './LoadingScreen';
import { BasketContext } from './BasketContext';
import { toast } from 'react-toastify';

const Shop = () => {
  const navigate = useNavigate();
  const { basket, setBasket } = useContext(BasketContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const iconRef = useRef(null);

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
    }, 0);

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

  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  const addToBasket = (product, selectedSize) => {
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
    toast.success('Product added to basket!');
  };

  const handleCategorySelect = (category) => setSelectedCategory(category);

  const toggleMenu = () => {
    setMenuOpen(prevState => !prevState);
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
  }, [imagesLoaded, filteredProducts.length])
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

          <nav id='hamburger-nav-about'>
            <div className="hamburger-menu-about" ref={menuRef}>
              <div className="hamburger-icon-about" onClick={toggleMenu} ref={iconRef}>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className={`menu-links-about ${menuOpen ? 'open' : ''}`}>
                <ul>
                  <li><Link to="/shop" onClick={toggleMenu}>Shop</Link></li>
                  <li><Link to="/about" onClick={toggleMenu}>Our Message</Link></li>
                  <li><Link to="/sizeguide" onClick={toggleMenu}>Size Guide</Link></li>
                  <li><Link to="/shipping" onClick={toggleMenu}>Shipping</Link></li>
                  <li><Link to="/contact" onClick={toggleMenu}>Contact Us</Link></li>
                </ul>
              </div>
            </div>
          </nav>

          <div id='cart-container-about'>
            <img
              src="./assets/img/icons8-cart-64.png"
              alt="Cart"
              className="icon"
              onClick={() => navigate('/cart')}
            />
          </div>

          <div id="logo-container-about">
            <Link to="/">
              <img src='./assets/img/logo_nobg.png' alt="Our Logo" className="logo" />
            </Link>
          </div>

          <div id="socials-container-about">
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
            />
          }
        </>
      )}
    </div>
  );
}

export default Shop;
