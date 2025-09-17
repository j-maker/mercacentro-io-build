import React from 'react';
import { useProduct } from 'vtex.product-context';
import { useCssHandles } from 'vtex.css-handles';
import { Domicilio } from '../domicilio/domicilio';
import './TiempoEnvio.css';

const CSS_HANDLES = [
    'tiempoEnvioContainer', 
    'tiempoEnvioInfo', 
    'tiempoEnvioText', 
    'tiempoEnvioLabel', 
    'tiempoEnvioRow', 
    'tiempoEnvioIcon',
    'tiempoEnvioText--bold'
] as const;

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

    const specifications = product?.properties || [];

    const tiempoEnvio = specifications.find(spec =>
        spec.name === 'Tiempo de Envío' ||
        spec.name === 'Tiempo de Envio' ||
        spec.name === 'Shipping Time'
    )?.values?.[0];

    if (!tiempoEnvio) {
        return null;
    }

    return (
        <div className={handles.tiempoEnvioContainer}>
            <div className={handles.tiempoEnvioInfo}>
                {/* Primera línea: Tiempo de envío */}
                <div className={handles.tiempoEnvioRow}>
                    <div className={`${handles.tiempoEnvioIcon} tiempoEnvioIcon--truck`}></div>
                    <span className={handles.tiempoEnvioText}>
                        <span className="tiempoEnvioText--bold">Tiempo de envío:</span> 
                        <span dangerouslySetInnerHTML={{ __html: tiempoEnvio }} />
                    </span>
                </div>
                
                {/* Segunda línea: Información de domicilio */}
                <div className={handles.tiempoEnvioRow}>
                    <div className={`${handles.tiempoEnvioIcon} tiempoEnvioIcon--restriction`}></div>
                    <Domicilio />
                </div>
            </div>
        </div>
    );
};

export { TiempoEnvio };
