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
    departamento: 'Tolima',
    ciudad: 'Ibagué',
    codigoPostal: '73001'
  });

  const [availableCities, setAvailableCities] = useState<Array<{name: string, code: string}>>(
    colombiaData.departments.find(dept => dept.name === 'Tolima')?.cities || []
  );
  
  const [selectedOption, setSelectedOption] = useState<'domicilio' | 'tienda'>('domicilio');

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
          
          const verifyResponse = await fetch('/api/checkout/pub/orderForm/', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });
          
          if (verifyResponse.ok) {
            const updatedOrderForm = await verifyResponse.json();
          }
          
          localStorage.setItem('hideButton', location.ciudad);
          localStorage.setItem('selectedDepartment', location.departamento);
          
          window.dispatchEvent(new CustomEvent('geolocationChanged', { 
            detail: { 
              option: 'domicilio', 
              location: location
            }
          }));
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
        
        const shippingData = orderFormData.shippingData;
        const shippingAddress = shippingData?.address;
        
        
        if (shippingAddress && shippingAddress.state && shippingAddress.city) {
          
          const department = colombiaData.departments.find(dept => dept.name === shippingAddress.state);
          if (department) {
            setAvailableCities(department.cities);
            
            const city = department.cities.find(city => city.name === shippingAddress.city);
            if (city) {
              setSelectedLocation({
                departamento: shippingAddress.state,
                ciudad: shippingAddress.city,
                codigoPostal: shippingAddress.postalCode || city.code
              });
              return;
            }
          }
        }
        
        const defaultLocation = {
          departamento: 'Tolima',
          ciudad: 'Ibagué',
          codigoPostal: '73001'
        };
        
        loadDefaultValues();
        await updateOrderFormWithLocation(defaultLocation);
        
      } else {
        loadDefaultValues();
      }
    } catch (error) {
      loadDefaultValues();
    }
  };

  const loadDefaultValues = () => {
    const defaultDepartment = colombiaData.departments.find(dept => dept.name === 'Tolima');
    if (defaultDepartment) {
      setAvailableCities(defaultDepartment.cities);
      const defaultCity = defaultDepartment.cities.find(city => city.name === 'Ibagué');
      if (defaultCity) {
        setSelectedLocation({
          departamento: 'Tolima',
          ciudad: 'Ibagué',
          codigoPostal: '73001'
        });
      }
    }
  };

  React.useEffect(() => {
    loadOrderFormData();
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
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

  const handleConfirmLocation = async () => {
    if (!selectedLocation.departamento || !selectedLocation.ciudad || !selectedLocation.codigoPostal) {
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

  const handleOptionConfirm = (option: 'domicilio' | 'tienda') => {
    if (option === 'tienda') {
      localStorage.setItem('hideButton', 'Recoger en tienda');
      localStorage.setItem('selectedDepartment', selectedLocation.departamento);
      
      getOrderFormInfo();
    }
    
    window.dispatchEvent(new CustomEvent('geolocationChanged', { 
      detail: { 
        option: option,
        location: option === 'domicilio' ? selectedLocation : null
      }
    }));
    
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
        Selecciona si quieres recibir tu mercado<br/>
        a domicilio o recogerlo en tienda
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