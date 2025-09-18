import React, { useState } from 'react';
import colombiaData from './colombiaData.json';
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
  const [selectedLocation, setSelectedLocation] = useState({
    departamento: '',
    ciudad: '',
    codigoPostal: ''
  });

  const [availableCities, setAvailableCities] = useState<Array<{name: string, code: string}>>([]);
  
  const [selectedOption, setSelectedOption] = useState<'domicilio' | 'tienda'>('domicilio');
  
  const [initialLocation, setInitialLocation] = useState({
    departamento: '',
    ciudad: '',
    codigoPostal: ''
  });
  const [initialOption, setInitialOption] = useState<'domicilio' | 'tienda'>('domicilio');
  const [pickupPointInfo, setPickupPointInfo] = useState<{name: string, address: string} | null>(null);

  const updateOrderFormWithLocation = async (location: typeof selectedLocation) => {
    try {
      const getResponse = await fetch('/api/checkout/pub/orderForm/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (getResponse.ok) {
        const orderFormData = await getResponse.json();
        const orderFormId = orderFormData.orderFormId || orderFormData.id;
        
        
        if (!orderFormId) {
          return;
        }
        
        const shippingData = {
          address: {
            state: location.departamento,
            city: location.ciudad,
            postalCode: location.codigoPostal,
            country: 'COL'
          }
        };


        let updateResponse;
        
        try {
          updateResponse = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(shippingData)
          });
        } catch (error) {
        }
        
        if (!updateResponse || !updateResponse.ok) {
          try {
            updateResponse = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/shippingData`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(shippingData)
            });
          } catch (error) {
          }
        }

        
        if (updateResponse && updateResponse.ok) {
          const responseData = await updateResponse.json();
          
          localStorage.setItem('hideButton', location.ciudad);
          localStorage.setItem('selectedDepartment', location.departamento);
          
          window.dispatchEvent(new CustomEvent('geolocationChanged', { 
            detail: { 
              option: 'domicilio', 
              location: location
            }
          }));
          
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          if (updateResponse) {
            const errorData = await updateResponse.text();
          }
        }
      } else {
      }
    } catch (error) {
    }
  };

  const updateOrderFormWithLocationAlternative = async (location: typeof selectedLocation) => {
    try {
      
      const getResponse = await fetch('/api/checkout/pub/orderForm/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (getResponse.ok) {
        const orderFormData = await getResponse.json();
        const orderFormId = orderFormData.orderFormId || orderFormData.id;
        
        
        if (!orderFormId) {
          return;
        }
        
        const shippingData = {
          address: {
            state: location.departamento,
            city: location.ciudad,
            postalCode: location.codigoPostal,
            country: 'COL'
          }
        };


        let updateResponse;
        
        try {
          updateResponse = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/attachments/shippingData`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(shippingData)
          });
        } catch (error) {
        }
        
        if (!updateResponse || !updateResponse.ok) {
          try {
            updateResponse = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/shippingData`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(shippingData)
            });
          } catch (error) {
          }
        }
        
        if (!updateResponse || !updateResponse.ok) {
          try {
            const fullUpdateData = {
              ...orderFormData,
              shippingData: {
                ...orderFormData.shippingData,
                ...shippingData
              }
            };
            
            updateResponse = await fetch(`/api/checkout/pub/orderForm/${orderFormId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(fullUpdateData)
            });
          } catch (error) {
          }
        }

        
        if (updateResponse && updateResponse.ok) {
          const responseData = await updateResponse.json();
          
          localStorage.setItem('hideButton', location.ciudad);
          localStorage.setItem('selectedDepartment', location.departamento);
          
          window.dispatchEvent(new CustomEvent('geolocationChanged', { 
            detail: { 
              option: 'domicilio', 
              location: location
            }
          }));
          
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const loadOrderFormData = async () => {
    try {
      
      const response = await fetch('/api/checkout/pub/orderForm/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const orderFormData = await response.json();
        
        const logisticsInfo = orderFormData.shippingData?.logisticsInfo;
        
        if (!logisticsInfo || logisticsInfo.length === 0) {
          setSelectedOption('domicilio');
          setInitialOption('domicilio');
        } else {
          const hasPickupSelected = logisticsInfo.some((info: any) => 
            info.selectedDeliveryChannel === 'pickup-in-point' || 
            (info.selectedSla && info.selectedSla.includes('Recogida'))
          );
          
          if (hasPickupSelected) {
            setSelectedOption('tienda');
            setInitialOption('tienda');
            
            const pickupPoints = orderFormData.shippingData?.pickupPoints;
            if (pickupPoints && pickupPoints.length > 0) {
              const selectedPickup = pickupPoints[0];
              setPickupPointInfo({
                name: selectedPickup.friendlyName || selectedPickup.name || 'Tienda',
                address: selectedPickup.address?.street || selectedPickup.address?.addressName || 'Dirección no disponible'
              });
            }
            return;
          } else {
            setSelectedOption('domicilio');
            setInitialOption('domicilio');
          }
        }
        
        const shippingData = orderFormData.shippingData;
        const shippingAddress = shippingData?.address;
        
        
        if (shippingAddress && shippingAddress.state && shippingAddress.city) {
          
          const department = colombiaData.departments.find(dept => dept.name === shippingAddress.state);
          if (department) {
            setAvailableCities(department.cities);
            
            const city = department.cities.find(city => city.name === shippingAddress.city);
            if (city) {
              const locationData = {
                departamento: shippingAddress.state,
                ciudad: shippingAddress.city,
                codigoPostal: shippingAddress.postalCode || city.code
              };
              setSelectedLocation(locationData);
              setInitialLocation(locationData);
              setSelectedOption('domicilio');
              setInitialOption('domicilio');
              return;
            }
          }
        }
        
        loadDefaultValues();
        
      } else {
        loadDefaultValues();
      }
    } catch (error) {
      loadDefaultValues();
    }
  };

  const loadDefaultValues = () => {
    setSelectedLocation({
      departamento: '',
      ciudad: '',
      codigoPostal: ''
    });
    setInitialLocation({
      departamento: '',
      ciudad: '',
      codigoPostal: ''
    });
    setAvailableCities([]);
  };

  React.useEffect(() => {
    loadOrderFormData();
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      setInitialLocation(selectedLocation);
      setInitialOption(selectedOption);
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleDepartmentChange = (departmentName: string) => {
    const department = colombiaData.departments.find(dept => dept.name === departmentName);
    if (department) {
      setAvailableCities(department.cities);
      setSelectedLocation({
        departamento: departmentName,
        ciudad: '',
        codigoPostal: ''
      });
    }
  };

  const handleCityChange = (cityName: string) => {
    const city = availableCities.find(city => city.name === cityName);
    if (city) {
      setSelectedLocation(prev => ({
        ...prev,
        ciudad: cityName,
        codigoPostal: city.code
      }));
    }
  };

  const getOrderFormInfo = async () => {
    try {
      
      const response = await fetch('/api/checkout/pub/orderForm/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const orderFormData = await response.json();
      } else {
        const errorText = await response.text();
      }
    } catch (error) {
    }
  };

  const updateOrderFormForPickup = async () => {
    try {
      const getResponse = await fetch('/api/checkout/pub/orderForm/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (getResponse.ok) {
        const orderFormData = await getResponse.json();
        const orderFormId = orderFormData.orderFormId || orderFormData.id;
        
        if (!orderFormId) {
          return false;
        }
        
        const logisticsInfo = orderFormData.shippingData?.logisticsInfo;
        if (logisticsInfo && logisticsInfo.length > 0) {
          const itemInfo = logisticsInfo[0];
          
          const pickupSla = itemInfo.slas?.find((sla: any) => 
            sla.deliveryChannel === 'pickup-in-point' || 
            sla.name?.includes('Recogida')
          );
          
          if (pickupSla) {
            const updateData = {
              logisticsInfo: [{
                ...itemInfo,
                selectedDeliveryChannel: 'pickup-in-point',
                selectedSla: pickupSla.id || pickupSla.name
              }]
            };
            
            const updateResponse = await fetch(`/api/checkout/pub/orderForm/${orderFormId}/attachments/logisticsInfo`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(updateData)
            });
            
            return updateResponse && updateResponse.ok;
          }
        }
        
        return false;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const handleConfirmLocation = async () => {
    if (!selectedLocation.departamento || !selectedLocation.ciudad || !selectedLocation.codigoPostal) {
      return;
    }
    
    if (!hasChanges()) {
      onClose();
      return;
    }
    
    const success = await updateOrderFormWithLocationAlternative(selectedLocation);
    
    if (!success) {
      await updateOrderFormWithLocation(selectedLocation);
    }
    
    onClose();
  };

  const handleOptionSelect = (option: 'domicilio' | 'tienda') => {
    setSelectedOption(option);
  };

  const hasChanges = () => {
    if (selectedOption !== initialOption) {
      return true;
    }
    
    if (selectedOption === 'domicilio') {
      return (
        selectedLocation.departamento !== initialLocation.departamento ||
        selectedLocation.ciudad !== initialLocation.ciudad ||
        selectedLocation.codigoPostal !== initialLocation.codigoPostal
      );
    }
    
    return false;
  };

  const handleOptionConfirm = async (option: 'domicilio' | 'tienda') => {
    if (!hasChanges()) {
      onClose();
      return;
    }
    
    if (option === 'tienda') {
      const success = await updateOrderFormForPickup();
      
      if (success) {
        localStorage.setItem('hideButton', 'Recoger en tienda');
        localStorage.setItem('selectedDepartment', selectedLocation.departamento);
        
        window.dispatchEvent(new CustomEvent('geolocationChanged', { 
          detail: { 
            option: option,
            location: null
          }
        }));
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } else {
      window.dispatchEvent(new CustomEvent('geolocationChanged', { 
        detail: { 
          option: option,
          location: selectedLocation
        }
      }));
      
      setTimeout(() => {
        window.location.reload();
      }, 500);
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
        Selecciona si quieres recibir tu pedido a domicilio o recogerlo en tienda
        </p>

        <div className="delivery-options">
          <div 
            className={`delivery-option ${selectedOption === 'domicilio' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('domicilio')}
          >
            <div className="delivery-icon icon-shipping"></div>
            <span className="delivery-text">Entrega a domicilio</span>
          </div>

          <div 
            className={`delivery-option ${selectedOption === 'tienda' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('tienda')}
          >
            <div className="delivery-icon icon-store"></div>
            <span className="delivery-text">Recoger en tienda</span>
          </div>
        </div>

        {selectedOption === 'domicilio' && (
          <div className="location-selectors">
            <div className="selector-group">
              <select
                id="department-select"
                className="location-select"
                value={selectedLocation.departamento}
                onChange={(e) => handleDepartmentChange(e.target.value)}
              >
                <option value="">Selecciona un departamento</option>
                {colombiaData.departments.map((department) => (
                  <option key={department.code} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="selector-group">
              <select
                id="city-select"
                className="location-select"
                value={selectedLocation.ciudad}
                onChange={(e) => handleCityChange(e.target.value)}
                disabled={!selectedLocation.departamento}
              >
                <option value="">
                  {selectedLocation.departamento ? 'Selecciona una ciudad' : 'Primero selecciona un departamento'}
                </option>
                {availableCities.map((city) => (
                  <option key={city.code} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {selectedOption === 'tienda' && pickupPointInfo && (
          <div className="pickup-info">
            <div className="pickup-info-title">Punto de recogida:</div>
            <div className="pickup-info-name">{pickupPointInfo.name}</div>
            <div className="pickup-info-address">{pickupPointInfo.address}</div>
          </div>
        )}

        <div className="geolocation-actions">
          <button 
            className="geolocation-confirm-btn"
            onClick={() => {
              if (selectedOption === 'domicilio') {
                handleConfirmLocation();
              } else {
                handleOptionConfirm('tienda');
              }
            }}
            disabled={
              selectedOption === 'domicilio' 
                ? (!selectedLocation.departamento || !selectedLocation.ciudad)
                : false
            }
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
    );
};

export default Geolocation;