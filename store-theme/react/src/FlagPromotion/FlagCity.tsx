import React from 'react';
import { useProduct } from 'vtex.product-context';

const FlagCity = () => {
    const productContext = useProduct();

    if (!productContext?.product) {
        return null;
    }

    const categories = (productContext.product as any)?.categories || [];
    const shouldShowImage = categories.some((category: string) =>
        category.includes('/Mercado/')
    );

    if (!shouldShowImage) {
        return null;
    }

    return (
        <div className="flag-city">
            <img
                src="/arquivos/flag-city.svg"
                alt="Entrega ibague"
                style={{ maxWidth: '100%', height: 'auto' }}
            />
        </div>
    );
};

export { FlagCity };
