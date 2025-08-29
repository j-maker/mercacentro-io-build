import React from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './Domicilio.css';

const CSS_HANDLES = ['domicilioContainer', 'domicilioInfo', 'domicilioText'] as const;

const Domicilio = () => {
    const handles = useCssHandles(CSS_HANDLES);
    const productContext = useProduct();

    if (!productContext) {
        return null;
    }

    const { product } = productContext;
    
    if (!product) {
        return null;
    }

    // Obtener las especificaciones del producto
    const specifications = product?.properties || [];
    
    // Buscar la especificación de domicilio
    const domicilio = specifications.find(spec => 
        spec.name === 'Domicilio' || 
        spec.name === 'Home Delivery' ||
        spec.name === 'Entrega a Domicilio'
    )?.values?.[0];

    // Solo mostrar si hay información de domicilio
    if (!domicilio) {
        return null;
    }

    return (
        <div className={handles.domicilioContainer}>
            <div className={handles.domicilioInfo}>
                <span 
                    className={handles.domicilioText}
                    dangerouslySetInnerHTML={{ __html: domicilio }}
                />
            </div>
        </div>
    );
};

export { Domicilio };
