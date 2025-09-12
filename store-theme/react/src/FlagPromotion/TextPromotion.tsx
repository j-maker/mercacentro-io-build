import React from 'react';
import { useProduct } from 'vtex.product-context';

const TextPromotion = ({children}: any) => {
    const productContext = useProduct();

    if (!productContext?.selectedItem) {
        return null;
    }

    // Obtener el precio del producto
    const selectedItem = productContext.selectedItem;
    const seller = selectedItem.sellers?.[0];
    const commertialOffer = seller?.commertialOffer;

    if (!commertialOffer) {
        return null;
    }

    const listPrice = (commertialOffer as any).ListPrice || 0;
    const price = commertialOffer.Price || 0;

    // Verificar si hay descuento (ListPrice > Price)
    const hasDiscount = listPrice > price && listPrice > 0;

    // Solo mostrar children si hay descuento
    if (!hasDiscount) {
        return null;
    }

    return <>{children}</>;
};

export { TextPromotion };
