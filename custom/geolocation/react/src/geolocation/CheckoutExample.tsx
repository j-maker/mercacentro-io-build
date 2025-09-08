import React from 'react';
import { CheckoutIntegration, useCheckoutIntegration } from './index';

// Ejemplo de uso en el checkout de VTEX
const CheckoutExample: React.FC = () => {
  const {
    deliveryOption,
    hasDeliveryOption,
    getFormattedDeliveryInfo,
    isValidDeliveryOption,
    getShippingDataForVTEX
  } = useCheckoutIntegration({
    onDeliveryOptionChange: (option) => {
      console.log('Opción de entrega cambiada:', option);
      
      // Aquí puedes integrar con el orderForm de VTEX
      if (option) {
        const shippingData = getShippingDataForVTEX();
        console.log('Datos de envío para VTEX:', shippingData);
        
        // Ejemplo de integración con VTEX:
        // updateOrderForm({
        //   shippingData: shippingData
        // });
      }
    },
    autoApplyToOrderForm: true
  });

  return (
    <div className="checkout-example">
      <h2>Información de Envío</h2>
      
      <CheckoutIntegration 
        onDeliveryOptionChange={(option) => {
          console.log('Opción seleccionada:', option);
        }}
        showEditButton={true}
      />
      
      {hasDeliveryOption && deliveryOption && (
        <div className="delivery-details">
          <h3>Detalles de la entrega:</h3>
          <p><strong>Tipo:</strong> {deliveryOption.type === 'domicilio' ? 'Entrega a domicilio' : 'Recoger en tienda'}</p>
          <p><strong>Dirección/Tienda:</strong> {getFormattedDeliveryInfo()}</p>
          <p><strong>Válido:</strong> {isValidDeliveryOption() ? 'Sí' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default CheckoutExample;
