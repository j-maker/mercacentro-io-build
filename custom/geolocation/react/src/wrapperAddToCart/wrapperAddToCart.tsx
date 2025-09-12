import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';

interface WrapperAddToCartProps {
    children: React.ReactNode;
}

const WrapperAddToCart = ({ children }: WrapperAddToCartProps) => {
    /* const [selectedCity, setSelectedCity] = useState<string>(''); */
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const productContext = useProduct();

    const isMercadoCategory = (): boolean => {
        if (!productContext?.product) {
            return false;
        }

        const categories = (productContext.product as any)?.categories || [];
        return categories.some((category: string) => 
            category.includes('/Mercado/')
        );
    };

    const determineVisibility = (cityName: string): boolean => {
        const isMercado = isMercadoCategory();
        
        if (isMercado) {
            return cityName === 'Ibagué';
        }
        
        return true;
    };

    const getCityFromOrderForm = async (): Promise<string> => {
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
                
                if (shippingAddress && shippingAddress.city) {
                    return shippingAddress.city;
                }
            }
        } catch (error) {
        }
        
        return 'Ibagué';
    };

    const determineVisibilityByCity = async () => {
        const cityFromOrderForm = await getCityFromOrderForm();
        setIsVisible(determineVisibility(cityFromOrderForm));
    };

    useEffect(() => {
        if (productContext?.product) {
            determineVisibilityByCity();
        }
    }, [productContext?.product]);

    useEffect(() => {
        determineVisibilityByCity();

        const handleCityChange = () => {
            determineVisibilityByCity();
        };

        window.addEventListener('geolocationChanged', handleCityChange);

        return () => {
            window.removeEventListener('geolocationChanged', handleCityChange);
        };
    }, []);

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