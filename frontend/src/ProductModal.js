import React, { useState, useEffect } from 'react';
import './ProductModal.css';

const ProductModal = ({ product, onClose, addToBasket }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null);
  
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!product) return null;

  const images = [product.photo, ...(Array.isArray(product.hover_images) ? product.hover_images : [])];

  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSizeClick = (size) => {
    if (product.sizes[size] > 0) {
      setSelectedSize(size);
    }
  };

  const handleAddToCart = () => {
    if (selectedSize) {
      addToBasket(product, selectedSize, quantity);
      onClose();
    }
  };

  const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL', 'One Size'];
  const sortedSizes = sizeOrder
    .filter(size => product.sizes[size] !== undefined)
    .map(size => ({ size, count: product.sizes[size] }));

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        
        <div className="modal-body">
          <div className="image-carousel">
            <img src={images[currentImageIndex]} alt={product.name} className="modal-image" />
            {images.length > 1 && (
              <>
                <button className="carousel-button prev" onClick={prevImage}>&lt;</button>
                <button className="carousel-button next" onClick={nextImage}>&gt;</button>
              </>
            )}
            <div className="dot-indicators">
              {images.map((_, index) => (
                <span key={index} className={`dot ${index === currentImageIndex ? 'active' : ''}`}></span>
              ))}
            </div>
          </div>
          
          <div className="modal-details">
            <h2>{product.name}</h2>
            <p className="price">£{product.price}</p>

            <div className={`dropdown-modal ${openDropdown === 'description' ? 'open' : ''}`}>
              <div className="dropdown-header-modal" onClick={() => toggleDropdown('description')}>Description</div>
              <div className="dropdown-content-modal">
                <p>{product.description}</p>
              </div>
            </div>

            <div className={`dropdown-modal ${openDropdown === 'shipping' ? 'open' : ''}`}>
              <div className="dropdown-header-modal" onClick={() => toggleDropdown('shipping')}>Returns & Shipping</div>
              <div className="dropdown-content-modal">
                <p>Details about returns and shipping policies...</p>
              </div>
            </div>

            <div className="size-selection">
              {sortedSizes.map(({ size, count }) => (
                <div
                  key={size}
                  className={`size-box ${count > 0 ? 'available' : 'unavailable'} ${size === selectedSize ? 'selected' : ''}`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                  {count <= 0 && <span className="crossed-out">Out of stock</span>}
                </div>
              ))}
            </div>
            
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              />
            </div>

            <button 
              className="add-to-cart-button" 
              disabled={!selectedSize}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <div className="instagram-share">
              <p>Share a picture of you wearing this on Instagram <strong>@zerohours</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;