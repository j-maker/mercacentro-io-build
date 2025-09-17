import React from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './Unity.css';

const CSS_HANDLES = ['unityContainer', 'unityInfo', 'pricePerUnit', 'unitMeasure'] as const;

const Unity = () => {
    const handles = useCssHandles(CSS_HANDLES);
    const productContext = useProduct();

    if (!productContext) {
        return null;
    }

    const { product, selectedItem } = productContext;
    
    if (!product || !selectedItem) {
        return null;
    }

    const specifications = product?.properties || [];
    
    const unidadMedida = specifications.find(spec => 
        spec.name === 'Unidad de Medida'
    )?.values?.[0];
    
    const valorUnidadMedida = specifications.find(spec => 
        spec.name === 'Valor Unidad de Medida'
    )?.values?.[0];

    const price = selectedItem.sellers?.[0]?.commertialOffer?.Price;
    
    const shouldCalculatePerUnit = unidadMedida && valorUnidadMedida;
    
    let pricePerUnit = null;
    
    if (shouldCalculatePerUnit && price && valorUnidadMedida) {
        const precioPorUnidad = price / parseFloat(valorUnidadMedida);
        
        if (unidadMedida === 'Unidad') {
            pricePerUnit = precioPorUnidad.toFixed(0);
        } else if (unidadMedida === 'Gramo') {
            pricePerUnit = precioPorUnidad.toFixed(1);
        } else if (unidadMedida === 'Mililitro') {
            pricePerUnit = precioPorUnidad.toFixed(2);
        } else {
            pricePerUnit = precioPorUnidad.toFixed(1);
        }
    }

    if (!shouldCalculatePerUnit || !unidadMedida || !valorUnidadMedida || !pricePerUnit) {
        return null;
    }

    return (
        <div className={handles.unityContainer}>
            <div className={handles.unityInfo}>
                <span className={handles.pricePerUnit}>
                    ({unidadMedida} a ${pricePerUnit})
                </span>
            </div>
        </div>
    );
};

export { Unity };