import React from 'react';
import { useDeliveryOption } from './useDeliveryOption';
import './delivery-summary.css';

interface DeliverySummaryProps {
  onEdit?: () => void;
  showEditButton?: boolean;
}

const DeliverySummary: React.FC<DeliverySummaryProps> = ({ 
  onEdit, 
  showEditButton = true 
}) => {
  const { deliveryOption, getFormattedDeliveryInfo, hasDeliveryOption } = useDeliveryOption();

  if (!hasDeliveryOption() || !deliveryOption) {
    return (
      <div className="delivery-summary-empty">
        <p>No se ha seleccionado un método de entrega</p>
        {showEditButton && onEdit && (
          <button className="edit-delivery-btn" onClick={onEdit}>
            Seleccionar método de entrega
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="delivery-summary">
      <div className="delivery-summary-header">
        <h3>Método de entrega</h3>
        {showEditButton && onEdit && (
          <button className="edit-delivery-btn" onClick={onEdit}>
            Editar
          </button>
        )}
      </div>
      
      <div className="delivery-summary-content">
        <div className="delivery-type">
          <div className="delivery-icon">
            {deliveryOption.type === 'domicilio' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 8H17V6C17 4.9 16.1 4 15 4H9C7.9 4 7 4.9 7 6V8H4C2.9 8 2 8.9 2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10C22 8.9 21.1 8 20 8ZM9 6H15V8H9V6ZM20 18H4V10H20V18Z" fill="currentColor"/>
                <path d="M12 12C10.9 12 10 12.9 10 14C10 15.1 10.9 16 12 16C13.1 16 14 15.1 14 14C14 12.9 13.1 12 12 12Z" fill="currentColor"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className="delivery-info">
            <span className="delivery-type-text">
              {deliveryOption.type === 'domicilio' ? 'Entrega a domicilio' : 'Recoger en tienda'}
            </span>
            <span className="delivery-address">
              {getFormattedDeliveryInfo()}
            </span>
          </div>
        </div>
        
        <div className="delivery-timing">
          <span className="delivery-time">
            {deliveryOption.type === 'domicilio' 
              ? deliveryOption.estimatedDelivery 
              : deliveryOption.estimatedPickup
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeliverySummary;
