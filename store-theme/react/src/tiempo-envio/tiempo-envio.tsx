import React from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './TiempoEnvio.css';

const CSS_HANDLES = ['tiempoEnvioContainer', 'tiempoEnvioInfo', 'tiempoEnvioText'] as const;

const TiempoEnvio = () => {
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
    
    // Buscar la especificación de tiempo de envío
    const tiempoEnvio = specifications.find(spec => 
        spec.name === 'Tiempo de Envío' || 
        spec.name === 'Tiempo de Envio' ||
        spec.name === 'Shipping Time'
    )?.values?.[0];

    // Solo mostrar si hay tiempo de envío
    if (!tiempoEnvio) {
        return null;
    }

    return (
        <div className={handles.tiempoEnvioContainer}>
            <div className={handles.tiempoEnvioInfo}>
                <span 
                    className={handles.tiempoEnvioText}
                    dangerouslySetInnerHTML={{ __html: tiempoEnvio }}
                />
            </div>
        </div>
    );
};

export { TiempoEnvio };
