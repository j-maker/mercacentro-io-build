import React from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import './specifications.css';

const CSS_HANDLES = ['specificationsContainer', 'specificationsInfo', 'specificationItem', 'specificationName', 'specificationValue'] as const;

const specifications = () => {
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

    if (!specifications || specifications.length === 0) {
        return null;
    }

    return (
        <div className={handles.specificationsContainer}>
            <div className={handles.specificationsInfo}>
                {specifications.map((spec, index) => (
                    <div key={index} className={handles.specificationItem}>
                        <span className={handles.specificationName}>
                            <strong>{spec.name}:</strong>
                        </span>
                        <span className={handles.specificationValue}>
                            {spec.values?.join(', ') || 'N/A'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { specifications };