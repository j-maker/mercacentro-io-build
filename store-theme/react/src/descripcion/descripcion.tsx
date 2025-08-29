import React from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './Descripcion.css';

const CSS_HANDLES = ['descripcionContainer', 'descripcionInfo', 'descripcionText'] as const;

const Descripcion = () => {
    const handles = useCssHandles(CSS_HANDLES);
    const productContext = useProduct();

    if (!productContext) {
        return null;
    }

    const { product } = productContext;
    
    if (!product) {
        return null;
    }

    // Obtener la descripción del producto
    const description = product?.description || '';

    // Solo mostrar si hay descripción
    if (!description) {
        return null;
    }

    return (
        <div className={handles.descripcionContainer}>
            <div className={handles.descripcionInfo}>
                <span 
                    className={handles.descripcionText}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
        </div>
    );
};

export { Descripcion };
