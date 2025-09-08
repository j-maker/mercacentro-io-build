import React, { useEffect, useState } from 'react';
import { useDeliveryOption } from './useDeliveryOption';
import DeliverySummary from './DeliverySummary';
import Geolocation from './geolocation';

interface CheckoutIntegrationProps {
  onDeliveryOptionChange?: (option: any) => void;
  showEditButton?: boolean;
}

const CheckoutIntegration: React.FC<CheckoutIntegrationProps> = ({
  onDeliveryOptionChange,
  showEditButton = true
}) => {
  const { deliveryOption, hasDeliveryOption } = useDeliveryOption();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Notificar cambios en la opción de entrega
  useEffect(() => {
    if (onDeliveryOptionChange && deliveryOption) {
      onDeliveryOptionChange(deliveryOption);
    }
  }, [deliveryOption, onDeliveryOptionChange]);

  // Escuchar eventos de cambio de opción de entrega
  useEffect(() => {
    const handleDeliveryOptionChanged = (event: CustomEvent) => {
      if (onDeliveryOptionChange) {
        onDeliveryOptionChange(event.detail);
      }
    };

    window.addEventListener('deliveryOptionChanged', handleDeliveryOptionChanged as EventListener);
    
    return () => {
      window.removeEventListener('deliveryOptionChanged', handleDeliveryOptionChanged as EventListener);
    };
  }, [onDeliveryOptionChange]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDeliveryOptionSelected = (option: any) => {
    console.log('Opción de entrega seleccionada en checkout:', option);
    
    // Aquí puedes integrar con el orderForm de VTEX
    // Por ejemplo:
    // - Actualizar el shippingData
    // - Modificar el deliveryOption en el orderForm
    // - Enviar información a un endpoint de VTEX
    
    if (onDeliveryOptionChange) {
      onDeliveryOptionChange(option);
    }
  };

  return (
    <div className="checkout-delivery-integration">
      <DeliverySummary 
        onEdit={openModal}
        showEditButton={showEditButton}
      />
      
      <Geolocation
        isOpen={isModalOpen}
        onClose={closeModal}
        onDeliveryOptionSelected={handleDeliveryOptionSelected}
      />
    </div>
  );
};

export default CheckoutIntegration;
