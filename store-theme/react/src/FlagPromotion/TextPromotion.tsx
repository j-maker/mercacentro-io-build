import React from 'react';
import { useProduct } from 'vtex.product-context';

const TextPromotion = ({children}: any) => {
    const productContext = useProduct();

    if (!productContext?.selectedItem) {
        return null;
    }

    const selectedItem = productContext.selectedItem;
    const seller = selectedItem.sellers?.[0];
    const commertialOffer = seller?.commertialOffer;

    if (!commertialOffer) {
        return null;
    }

    const listPrice = (commertialOffer as any).ListPrice || 0;
    const price = commertialOffer.Price || 0;

    const hasDiscount = listPrice > price && listPrice > 0;

    if (!hasDiscount) {
        return null;
    }

    return <>{children}</>;
};

export { TextPromotion };
