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
    
    // Solo calcular precio por unidad si la unidad de medida es "Unidad"
    const shouldCalculatePerUnit = unidadMedida === 'Unidad';
    
    // Calcular el precio por unidad de medida solo si es necesario
    const pricePerUnit = shouldCalculatePerUnit && price && valorUnidadMedida 
        ? (price / parseFloat(valorUnidadMedida) / 100).toFixed(2) // Convertir de centavos
        : null;

    // Solo mostrar si tenemos los datos necesarios y la unidad es "Unidad"
    if (!shouldCalculatePerUnit || !unidadMedida || !valorUnidadMedida || !pricePerUnit) {
        return null;
    }

    return (
        <div className={handles.unityContainer}>
            <div className={handles.unityInfo}>
                <span className={handles.pricePerUnit}>
                    ({unidadMedida}. a ${pricePerUnit})
                </span>
            </div>
        </div>
    );
};

export { Unity };