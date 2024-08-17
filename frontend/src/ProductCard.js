import React from 'react';

const ProductCard = React.memo(({ product, onClick, onImageLoad }) => {
  const handleImageLoad = () => {
    if (onImageLoad) {
      onImageLoad();
    }
  };

  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <img
        src={product.photo}
        alt={product.name}
        onLoad={handleImageLoad}
      />
      <h2>{product.name}</h2>
    </div>
  );
});



export default ProductCard;
