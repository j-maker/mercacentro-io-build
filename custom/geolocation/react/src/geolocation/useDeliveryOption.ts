import { useState, useEffect } from 'react';

export interface DeliveryOption {
  type: 'domicilio' | 'tienda';
  address?: {
    calle: string;
    numero: string;
    apartamento: string;
    ciudad: string;
    departamento: string;
  };
  store?: {
    id: string;
    name: string;
    address: string;
  };
  estimatedDelivery?: string;
  estimatedPickup?: string;
  timestamp: string;
}

export const useDeliveryOption = () => {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar información guardada al inicializar
  useEffect(() => {
    const loadDeliveryOption = () => {
      try {
        const savedOption = localStorage.getItem('deliveryOption');
        if (savedOption) {
          const parsedOption = JSON.parse(savedOption);
          setDeliveryOption(parsedOption);
        }
      } catch (error) {
        console.error('Error al cargar opción de entrega:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDeliveryOption();
  }, []);

  // Guardar información de entrega
  const saveDeliveryOption = (option: DeliveryOption) => {
    try {
      const optionWithTimestamp = {
        ...option,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('deliveryOption', JSON.stringify(optionWithTimestamp));
      setDeliveryOption(optionWithTimestamp);
      
      // Disparar evento personalizado para notificar cambios
      window.dispatchEvent(new CustomEvent('deliveryOptionChanged', { 
        detail: optionWithTimestamp 
      }));
      
      return true;
    } catch (error) {
      console.error('Error al guardar opción de entrega:', error);
      return false;
    }
  };

  // Limpiar información guardada
  const clearDeliveryOption = () => {
    try {
      localStorage.removeItem('deliveryOption');
      setDeliveryOption(null);
      
      // Disparar evento personalizado para notificar cambios
      window.dispatchEvent(new CustomEvent('deliveryOptionChanged', { 
        detail: null 
      }));
      
      return true;
    } catch (error) {
      console.error('Error al limpiar opción de entrega:', error);
      return false;
    }
  };

  // Obtener información de entrega
  const getDeliveryOption = (): DeliveryOption | null => {
    return deliveryOption;
  };

  // Verificar si hay información guardada
  const hasDeliveryOption = (): boolean => {
    return deliveryOption !== null;
  };

  // Obtener información formateada para mostrar
  const getFormattedDeliveryInfo = (): string => {
    if (!deliveryOption) return '';

    if (deliveryOption.type === 'domicilio' && deliveryOption.address) {
      const { calle, numero, apartamento, ciudad } = deliveryOption.address;
      return `${calle} #${numero}${apartamento ? ` - ${apartamento}` : ''}, ${ciudad}`;
    } else if (deliveryOption.type === 'tienda' && deliveryOption.store) {
      return `${deliveryOption.store.name} - ${deliveryOption.store.address}`;
    }

    return '';
  };

  return {
    deliveryOption,
    isLoading,
    saveDeliveryOption,
    clearDeliveryOption,
    getDeliveryOption,
    hasDeliveryOption,
    getFormattedDeliveryInfo
  };
};
