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

    // Obtener las especificaciones del producto
    const specifications = product?.properties || [];
    
    // Buscar las especificaciones específicas
    const unidadMedida = specifications.find(spec => 
        spec.name === 'Unidad de Medida'
    )?.values?.[0];
    
    const valorUnidadMedida = specifications.find(spec => 
        spec.name === 'Valor Unidad de Medida'
    )?.values?.[0];

    // Obtener el precio del producto
    const price = selectedItem.sellers?.[0]?.commertialOffer?.Price;
    
    // Calcular precio por unidad para cualquier unidad de medida
    const shouldCalculatePerUnit = unidadMedida && valorUnidadMedida;
    
    // Calcular el precio por unidad de medida solo si es necesario
    let pricePerUnit = null;
    
    if (shouldCalculatePerUnit && price && valorUnidadMedida) {
        if (unidadMedida === 'Unidad') {
            // Para Unidad: sin división por 100, sin decimales
            pricePerUnit = (price / parseFloat(valorUnidadMedida)).toFixed(0);
        } else if (unidadMedida === 'Gramo') {
            // Para Gramo: sin división por 100, 1 decimal
            pricePerUnit = (price / parseFloat(valorUnidadMedida)).toFixed(1);
        } else {
            // Para otras unidades: con división por 100, 1 decimal
            pricePerUnit = (price / 100 / parseFloat(valorUnidadMedida)).toFixed(1);
        }
    }

    // Solo mostrar si tenemos los datos necesarios
    if (!shouldCalculatePerUnit || !unidadMedida || !valorUnidadMedida || !pricePerUnit) {
        return null;
    }

    return (
        <div className={handles.unityContainer}>
            <div className={handles.unityInfo}>
                <span className={handles.pricePerUnit}>
                    ({unidadMedida} a ${pricePerUnit})
                </span>
                <br />
                <small>Valor: {valorUnidadMedida}</small>
            </div>
        </div>
    );
};

export { Unity };