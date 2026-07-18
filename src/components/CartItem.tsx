import React from 'react';
import type { CartItem as CartItemType } from '../types/Cart';
import '../styles/cartItem.css';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  
  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (item.quantity < item.maxStock) {
      onUpdateQuantity(item.productId, item.quantity + 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.productId);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('es-CL');
  };

  return (
    <li className="cart-item-component" aria-label={`Producto: ${item.name}`}>
      {/* Imagen del producto */}
      <div className="cart-item-image-wrapper">
        <img 
          src={item.image} 
          alt={`Vela ${item.name}`} 
          className="cart-item-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
          }}
        />
      </div>

      {/* Información del producto */}
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price" aria-label={`Precio unitario: $${formatPrice(item.price)}`}>
          ${formatPrice(item.price)}
        </p>
      </div>

      {/* Selector de cantidad */}
      <div className="cart-item-quantity" aria-label="Control de cantidad">
        <button 
          onClick={handleDecrement}
          className="qty-btn"
          disabled={item.quantity <= 1}
          aria-label={`Disminuir cantidad de ${item.name} en 1`}
          type="button"
        >
          −
        </button>
        <span 
          className="qty-number" 
          aria-live="polite" 
          aria-atomic="true"
          aria-label={`Cantidad actual: ${item.quantity}`}
        >
          {item.quantity}
        </span>
        <button 
          onClick={handleIncrement}
          className="qty-btn"
          disabled={item.quantity >= item.maxStock}
          aria-label={`Aumentar cantidad de ${item.name} en 1`}
          type="button"
        >
          +
        </button>
      </div>

      {/* Total por producto */}
      <div 
        className="cart-item-total" 
        aria-label={`Precio total por este artículo: $${formatPrice(item.price * item.quantity)}`}
        aria-live="polite"
      >
        ${formatPrice(item.price * item.quantity)}
      </div>

      {/* Botón eliminar */}
      <button 
        onClick={handleRemove}
        className="remove-item-btn"
        aria-label={`Eliminar ${item.name} del carrito`}
        title={`Eliminar ${item.name} del carrito`}
        type="button"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </li>
  );
};

export default CartItem;