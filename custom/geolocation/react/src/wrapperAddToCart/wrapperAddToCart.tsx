import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';

interface WrapperAddToCartProps {
    children: React.ReactNode;
}

const WrapperAddToCart = ({ children }: WrapperAddToCartProps) => {
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const productContext = useProduct();


    // Función para verificar si el producto pertenece a la categoría /Mercado/
    const isMercadoCategory = (): boolean => {
        if (!productContext?.product) {
            return false;
        }

        const categories = (productContext.product as any)?.categories || [];
        return categories.some((category: string) => 
            category.includes('/Mercado/')
        );
    };

    // Función para determinar la visibilidad del componente
    const determineVisibility = (cityName: string): boolean => {
        // Verificar si el producto pertenece a la categoría /Mercado/
        const isMercado = isMercadoCategory();
        
        // Si el producto pertenece a /Mercado/, solo mostrar si la ciudad es Ibagué
        if (isMercado) {
            return cityName === 'Ibagué';
        }
        
        // Para productos que NO son de /Mercado/, mostrar siempre
        return true;
    };

    // Función para determinar visibilidad basada en la ciudad seleccionada
    const determineVisibilityByCity = () => {
        // Obtener la ciudad guardada en localStorage desde el selector de geolocalización
        const savedCity = localStorage.getItem('hideButton');
        
        // Si no hay ciudad guardada o es "Recoger en tienda", usar Ibagué por defecto
        const cityToCheck = (savedCity && savedCity !== 'Recoger en tienda') ? savedCity : 'Ibagué';
        
        // Determinar visibilidad basada en la ciudad
        setIsVisible(determineVisibility(cityToCheck));
    };

    // Efecto para reaccionar a cambios en el contexto del producto
    useEffect(() => {
        if (productContext?.product) {
            // Recalcular visibilidad cuando cambia el producto
            determineVisibilityByCity();
        }
    }, [productContext?.product]);

    // Efecto para escuchar cambios de geolocalización
    useEffect(() => {
        // Determinar visibilidad inicial
        determineVisibilityByCity();

        // Escuchar eventos personalizados de cambio de ciudad
        const handleCityChange = () => {
            determineVisibilityByCity();
        };

        window.addEventListener('geolocationChanged', handleCityChange);

        return () => {
            window.removeEventListener('geolocationChanged', handleCityChange);
        };
    }, []);

    // Si no es visible, no renderizar nada
    if (!isVisible) {
        return null;
    }

    return (
        <div>
            {children}
        </div>
    );
};

export { WrapperAddToCart };