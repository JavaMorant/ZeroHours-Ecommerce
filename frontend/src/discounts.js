const discounts = {
    sock: [
      { quantity: 1, price: 9.99 },
      { quantity: 2, price: 17.99 },
      { quantity: 3, price: 23.99 },
      { quantity: 4, price: 31.99 }
    ],
    // You can add discounts for other product types here
    // For example:
    // tshirt: [
    //   { quantity: 1, price: 19.99 },
    //   { quantity: 2, price: 34.99 },
    // ],
  };
  
  export const getDiscountedPrice = (productType, quantity, originalPrice) => {
    const productDiscounts = discounts[productType];
    if (!productDiscounts) return originalPrice;
  
    const applicableDiscount = productDiscounts
      .filter(discount => discount.quantity <= quantity)
      .sort((a, b) => b.quantity - a.quantity)[0];
  
    if (applicableDiscount) {
      return applicableDiscount.price / applicableDiscount.quantity;
    }
  
    return originalPrice;
  };
  
  export default discounts;