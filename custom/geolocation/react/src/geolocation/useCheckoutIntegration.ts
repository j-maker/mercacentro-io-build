import { useEffect } from 'react';
import { useDeliveryOption, DeliveryOption } from './useDeliveryOption';

interface CheckoutIntegrationOptions {
  onDeliveryOptionChange?: (option: DeliveryOption | null) => void;
  autoApplyToOrderForm?: boolean;
}

export const useCheckoutIntegration = (options: CheckoutIntegrationOptions = {}) => {
  const { deliveryOption, hasDeliveryOption, getFormattedDeliveryInfo } = useDeliveryOption();
  const { onDeliveryOptionChange, autoApplyToOrderForm = false } = options;

  // Aplicar automáticamente la opción de entrega al orderForm
  useEffect(() => {
    if (autoApplyToOrderForm && deliveryOption) {
      applyDeliveryOptionToOrderForm(deliveryOption);
    }
  }, [deliveryOption, autoApplyToOrderForm]);

  // Notificar cambios en la opción de entrega
  useEffect(() => {
    if (onDeliveryOptionChange) {
      onDeliveryOptionChange(deliveryOption);
    }
  }, [deliveryOption, onDeliveryOptionChange]);

  // Función para aplicar la opción de entrega al orderForm de VTEX
  const applyDeliveryOptionToOrderForm = (option: DeliveryOption) => {
    try {
      // Aquí puedes integrar con el orderForm de VTEX
      // Esta es una implementación de ejemplo
      
      if (option.type === 'domicilio' && option.address) {
        // Para entrega a domicilio, actualizar shippingData
        const shippingData = {
          address: {
            street: option.address.calle,
            number: option.address.numero,
            complement: option.address.apartamento,
            city: option.address.ciudad,
            state: option.address.departamento,
            country: 'Colombia',
            postalCode: '730001' // Código postal por defecto para Ibagué
          },
          deliveryType: 'homeDelivery',
          estimatedDelivery: option.estimatedDelivery
        };

        // Aquí deberías actualizar el orderForm usando los hooks de VTEX
        console.log('Aplicando datos de envío a domicilio:', shippingData);
        
        // Ejemplo de cómo se podría actualizar:
        // setOrderForm({
        //   ...orderForm,
        //   shippingData: shippingData
        // });

      } else if (option.type === 'tienda' && option.store) {
        // Para recoger en tienda, actualizar pickupData
        const pickupData = {
          store: {
            id: option.store.id,
            name: option.store.name,
            address: option.store.address
          },
          deliveryType: 'pickup',
          estimatedPickup: option.estimatedPickup
        };

        console.log('Aplicando datos de recogida en tienda:', pickupData);
        
        // Ejemplo de cómo se podría actualizar:
        // setOrderForm({
        //   ...orderForm,
        //   pickupData: pickupData
        // });
      }

      return true;
    } catch (error) {
      console.error('Error al aplicar opción de entrega al orderForm:', error);
      return false;
    }
  };

  // Función para obtener datos de envío formateados para VTEX
  const getShippingDataForVTEX = (): any => {
    if (!deliveryOption) return null;

    if (deliveryOption.type === 'domicilio' && deliveryOption.address) {
      return {
        address: {
          street: deliveryOption.address.calle,
          number: deliveryOption.address.numero,
          complement: deliveryOption.address.apartamento,
          city: deliveryOption.address.ciudad,
          state: deliveryOption.address.departamento,
          country: 'Colombia',
          postalCode: '730001'
        },
        deliveryType: 'homeDelivery',
        estimatedDelivery: deliveryOption.estimatedDelivery
      };
    } else if (deliveryOption.type === 'tienda' && deliveryOption.store) {
      return {
        store: {
          id: deliveryOption.store.id,
          name: deliveryOption.store.name,
          address: deliveryOption.store.address
        },
        deliveryType: 'pickup',
        estimatedPickup: deliveryOption.estimatedPickup
      };
    }

    return null;
  };

  // Función para validar si la opción de entrega es válida
  const isValidDeliveryOption = (): boolean => {
    if (!deliveryOption) return false;

    if (deliveryOption.type === 'domicilio') {
      return !!(deliveryOption.address?.calle && deliveryOption.address?.numero);
    } else if (deliveryOption.type === 'tienda') {
      return !!(deliveryOption.store?.id);
    }

    return false;
  };

  return {
    deliveryOption,
    hasDeliveryOption: hasDeliveryOption(),
    getFormattedDeliveryInfo,
    isValidDeliveryOption: isValidDeliveryOption(),
    getShippingDataForVTEX,
    applyDeliveryOptionToOrderForm
  };
};
