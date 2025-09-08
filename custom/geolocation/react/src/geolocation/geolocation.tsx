import React, { useState } from 'react';
import './geolocation.css';

interface GeolocationProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Geolocation: React.FC<GeolocationProps> = ({ 
  isOpen, 
  onClose, 
  title = "Elige un método de entrega"
}) => {
  // Simulación del orderForm para demostración
  const [orderForm, setOrderForm] = useState({
    id: 'order-123',
    items: [],
    shippingData: null,
    pickupData: null,
    deliveryOption: null,
    totalizers: [],
    value: 0,
    clientProfileData: null
  });
  
  const [selectedOption, setSelectedOption] = useState<'domicilio' | 'tienda' | null>(null);
  const [address, setAddress] = useState({
    calle: '',
    numero: '',
    apartamento: '',
    ciudad: 'Ibagué',
    departamento: 'Tolima'
  });
  const [selectedStore, setSelectedStore] = useState('');

  const stores = [
    { id: '1', name: 'Tienda Centro - Ibagué', address: 'Calle 15 #3-25, Centro' },
    { id: '2', name: 'Tienda Norte - Ibagué', address: 'Carrera 3 #15-40, Norte' },
    { id: '3', name: 'Tienda Sur - Ibagué', address: 'Calle 60 #5-20, Sur' }
  ];

  const handleOptionSelect = (option: 'domicilio' | 'tienda') => {
    setSelectedOption(option);
  };

  const handleAddressChange = (field: string, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mostrar orderForm actual al montar el componente
  React.useEffect(() => {
    console.log('=== ORDERFORM ACTUAL ===');
    console.log('OrderForm:', JSON.stringify(orderForm, null, 2));
  }, []);

  // Mostrar cambios en el orderForm cuando se actualiza
  React.useEffect(() => {
    if (orderForm) {
      console.log('=== ORDERFORM ACTUALIZADO ===');
      console.log('shippingData:', orderForm.shippingData);
      console.log('pickupData:', orderForm.pickupData);
      console.log('deliveryOption:', orderForm.deliveryOption);
    }
  }, [orderForm]);

  // Cargar información guardada cuando se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body
      document.body.classList.add('modal-open');
    } else {
      // Restaurar scroll del body
      document.body.classList.remove('modal-open');
    }
    
    // Cleanup al desmontar
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleConfirm = () => {
    console.log('=== ORDERFORM ANTES DE LA ACTUALIZACIÓN ===');
    console.log('OrderForm anterior:', JSON.stringify(orderForm, null, 2));
    
    if (selectedOption === 'domicilio') {
      // Actualizar solo los campos necesarios para entrega a domicilio
      const updatedOrderForm = {
        ...orderForm,
        shippingData: {
          address: {
            street: address.calle,
            number: address.numero,
            complement: address.apartamento,
            city: address.ciudad,
            state: address.departamento,
            country: 'Colombia',
            postalCode: '730001' // Código postal por defecto para Ibagué
          },
          deliveryType: 'homeDelivery',
          estimatedDelivery: '2-3 días hábiles'
        },
        pickupData: null, // Limpiar pickupData
        deliveryOption: {
          type: 'domicilio',
          address: address,
          estimatedDelivery: '2-3 días hábiles',
          timestamp: new Date().toISOString()
        }
      };
      
      console.log('=== CAMPOS ACTUALIZADOS (DOMICILIO) ===');
      console.log('shippingData:', JSON.stringify(updatedOrderForm.shippingData, null, 2));
      console.log('pickupData:', updatedOrderForm.pickupData);
      console.log('deliveryOption:', JSON.stringify(updatedOrderForm.deliveryOption, null, 2));
      
      setOrderForm(updatedOrderForm);
      
    } else if (selectedOption === 'tienda') {
      // Actualizar solo los campos necesarios para recoger en tienda
      const selectedStoreInfo = stores.find(store => store.id === selectedStore);
      const updatedOrderForm = {
        ...orderForm,
        shippingData: null, // Limpiar shippingData
        pickupData: {
          store: {
            id: selectedStoreInfo?.id,
            name: selectedStoreInfo?.name,
            address: selectedStoreInfo?.address
          },
          deliveryType: 'pickup',
          estimatedPickup: '1-2 días hábiles'
        },
        deliveryOption: {
          type: 'tienda',
          store: selectedStoreInfo,
          estimatedPickup: '1-2 días hábiles',
          timestamp: new Date().toISOString()
        }
      };
      
      console.log('=== CAMPOS ACTUALIZADOS (TIENDA) ===');
      console.log('shippingData:', updatedOrderForm.shippingData);
      console.log('pickupData:', JSON.stringify(updatedOrderForm.pickupData, null, 2));
      console.log('deliveryOption:', JSON.stringify(updatedOrderForm.deliveryOption, null, 2));
      
      setOrderForm(updatedOrderForm);
    }
    
    onClose();
  };

  if (!isOpen) return null;
    
    return (
    <div className="geolocation-overlay">
      <div className="geolocation-modal">
        <div className="geolocation-header">
          <h2 className="geolocation-title">{title}</h2>
          <button className="geolocation-close" onClick={onClose}>×</button>
        </div>
        
        <p className="geolocation-subtitle">
          Selecciona si quieres recibir tu mercado a domicilio o recogerlo en tienda
        </p>

        <div className="delivery-options">
          <div 
            className={`delivery-option ${selectedOption === 'domicilio' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('domicilio')}
          >
            <div className="delivery-icon icon-shipping">
              
            </div>
            <span className="delivery-text">Entrega a domicilio</span>
          </div>

          <div 
            className={`delivery-option ${selectedOption === 'tienda' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('tienda')}
          >
            <div className="delivery-icon icon-store">
            </div>
            <span className="delivery-text">Recoger en tienda</span>
          </div>
        </div>

        {selectedOption === 'domicilio' && (
          <div className="address-form">
            <p className="address-info">
              Estás llevando un producto que solamente está disponible para entrega en Tolima, Ibagué.
            </p>
            
            <div className="address-fields">
              <div className="address-row">
                <select 
                  className="address-select"
                  value={address.ciudad}
                  onChange={(e) => handleAddressChange('ciudad', e.target.value)}
                >
                  <option value="Ibagué">Ibagué</option>
                </select>
              </div>
              
              <div className="address-row">
                <input
                  type="text"
                  placeholder="Calle"
                  className="address-input"
                  value={address.calle}
                  onChange={(e) => handleAddressChange('calle', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="#"
                  className="address-input-small"
                  value={address.numero}
                  onChange={(e) => handleAddressChange('numero', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="#"
                  className="address-input-small"
                  value={address.apartamento}
                  onChange={(e) => handleAddressChange('apartamento', e.target.value)}
                />
              </div>
              
              <div className="address-row">
                <input
                  type="text"
                  placeholder="Apartamento, torre, casa, etc"
                  className="address-input-full"
                  value={address.apartamento}
                  onChange={(e) => handleAddressChange('apartamento', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {selectedOption === 'tienda' && (
          <div className="store-selection">
            <select 
              className="store-select"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
            >
              <option value="">Seleccionar tienda</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.address}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedOption === 'domicilio' && address.calle && address.numero && (
          <button 
            className="confirm-button"
            onClick={handleConfirm}
          >
            Enviar
          </button>
        )}
        
        {selectedOption === 'tienda' && selectedStore && (
          <button 
            className="confirm-button"
            onClick={handleConfirm}
          >
            Confirmar
          </button>
        )}
      </div>
        </div>
    );
};

export default Geolocation;