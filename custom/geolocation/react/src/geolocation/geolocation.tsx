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
  // Estado para la ubicación seleccionada
  const [selectedLocation, setSelectedLocation] = useState({
    departamento: 'Tolima',
    ciudad: 'Ibagué',
    codigoPostal: '73001'
  });

  // Estado para las ciudades disponibles según el departamento
  const [availableCities, setAvailableCities] = useState<Array<{name: string, code: string}>>(
    colombiaData.departments.find(dept => dept.name === 'Tolima')?.cities || []
  );
  
  // Estado para controlar qué opción está seleccionada - Por defecto domicilio
  const [selectedOption, setSelectedOption] = useState<'domicilio' | 'tienda'>('domicilio');



  // Cargar ubicación guardada en localStorage al inicializar
  React.useEffect(() => {
    const savedCity = localStorage.getItem('hideButton');
    const savedDepartment = localStorage.getItem('selectedDepartment');
    
    if (savedCity && savedDepartment) {
      console.log('Ubicación guardada encontrada:', { ciudad: savedCity, departamento: savedDepartment });
      
      // Buscar el departamento en los datos de Colombia
      const department = colombiaData.departments.find(dept => dept.name === savedDepartment);
      if (department) {
        // Establecer el departamento y sus ciudades disponibles
        setAvailableCities(department.cities);
        
        if (savedCity === 'Recoger en tienda') {
          // Si la opción anterior era recoger en tienda
          setSelectedOption('tienda');
          setSelectedLocation({
            departamento: savedDepartment,
            ciudad: '',
            codigoPostal: ''
          });
          console.log('Opción de recoger en tienda restaurada para:', savedDepartment);
        } else {
          // Si había una ciudad específica seleccionada
          const city = department.cities.find(city => city.name === savedCity);
          if (city) {
            setSelectedOption('domicilio');
            setSelectedLocation({
              departamento: savedDepartment,
              ciudad: savedCity,
              codigoPostal: city.code
            });
            console.log('Ubicación completa restaurada:', { 
              departamento: savedDepartment, 
              ciudad: savedCity, 
              codigoPostal: city.code 
            });
          }
        }
      }
    }
  }, []);

  // Prevenir scroll del body cuando el modal está abierto
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

  // Función para manejar cambio de departamento
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

  // Función para manejar cambio de ciudad
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

  // Función para confirmar ubicación
  const handleConfirmLocation = () => {
    // Validar que todos los campos requeridos estén completos
    if (!selectedLocation.departamento || !selectedLocation.ciudad || !selectedLocation.codigoPostal) {
      console.warn('Faltan campos requeridos para confirmar la ubicación');
      return;
    }
    
    console.log('Confirmando ubicación:', selectedLocation);
    
    // Guardar la ciudad y departamento en localStorage
    // Esto permite persistir la selección del usuario entre sesiones
    localStorage.setItem('hideButton', selectedLocation.ciudad);
    localStorage.setItem('selectedDepartment', selectedLocation.departamento);
    console.log('Ubicación guardada en localStorage:', { 
      ciudad: selectedLocation.ciudad, 
      departamento: selectedLocation.departamento
    });
    
    // Disparar evento personalizado con la ubicación seleccionada
    window.dispatchEvent(new CustomEvent('geolocationChanged', { 
      detail: { 
        option: 'domicilio', 
        location: selectedLocation
      }
    }));
    
    // Cerrar el modal
    onClose();
  };

  const handleOptionSelect = (option: 'domicilio' | 'tienda') => {
    setSelectedOption(option);
  };

  const handleOptionConfirm = (option: 'domicilio' | 'tienda') => {
    if (option === 'tienda') {
      // Para recoger en tienda, también guardamos la información en localStorage
      localStorage.setItem('hideButton', 'Recoger en tienda');
      localStorage.setItem('selectedDepartment', selectedLocation.departamento);
      console.log('Opción de recoger en tienda guardada para:', selectedLocation.departamento);
    }
    
    // Disparar evento personalizado con la opción seleccionada
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
          Selecciona tu método de entrega
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

        {/* Selectores de Departamento y Ciudad - Solo visibles cuando se selecciona domicilio */}
        {selectedOption === 'domicilio' && (
          <div className="location-selectors">
            <p className="location-subtitle">
              Selecciona tu ubicación para calcular el envío
            </p>
            
            <div className="selector-group">
              <label htmlFor="department-select" className="selector-label">
                Departamento
              </label>
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
              <label htmlFor="city-select" className="selector-label">
                Ciudad
              </label>
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

        {/* Botón de confirmación - Siempre visible */}
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
            Confirmar Ubicación
          </button>
        </div>

        
      </div>
        </div>
    );
};

export default Geolocation;