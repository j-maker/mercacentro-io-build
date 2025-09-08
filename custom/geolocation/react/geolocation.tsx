import React, { useState } from 'react';
import Geolocation from './src/geolocation/geolocation';

interface GeolocationWrapperProps {
  title?: string;
  showButton?: boolean;
  buttonText?: string; // Puede contener HTML
}

const GeolocationWrapper: React.FC<GeolocationWrapperProps> = ({ 
  title = "Elige un método de entrega",
  showButton = true,
  buttonText = "Método <br/> de entrega"
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {showButton && (
        <>
        <button 
          className='flex items-center'
          onClick={openModal}
          style={{
            fontFamily: 'Montserrat-Regular',
            color: '#1a1717',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <i className='icon-map-marker'></i>
          <div 
            className='tl flex items-center'
            dangerouslySetInnerHTML={{ __html: buttonText }}
          />
        </button>
        </>
      )}
      
      <Geolocation 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={title}
      />
    </div>
  );
};

// Exportar el wrapper como componente principal
export default GeolocationWrapper;

// Exportar componentes adicionales
export { default as GeolocationModal } from './src/geolocation/geolocation';
export { default as DeliverySummary } from './src/geolocation/DeliverySummary';
export { default as CheckoutIntegration } from './src/geolocation/CheckoutIntegration';

// Exportar hooks
export { useDeliveryOption } from './src/geolocation/useDeliveryOption';
export { useCheckoutIntegration } from './src/geolocation/useCheckoutIntegration';

// Exportar tipos
export type { DeliveryOption } from './src/geolocation/useDeliveryOption';