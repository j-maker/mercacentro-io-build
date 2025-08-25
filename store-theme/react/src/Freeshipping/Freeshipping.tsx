import React from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm';
import styles from './styles.css';
import { pathOr } from 'ramda';
import { FormattedPrice } from 'vtex.formatted-price'

interface FreeshippingProps {
    Envio: number;
}

const Freeshipping = ({ Envio }: FreeshippingProps) => {
    const orderForm = useOrderForm();
    
    // Obtener valores del carrito con valores por defecto seguros
    const cartTotal = pathOr(0, ['orderForm', 'value'], orderForm) / 100;
    const deliveryCost = pathOr(0, ['orderForm', 'shipping', 'deliveryOptions', 0, 'price'], orderForm) / 100;
    
    // Calcular subtotal sin envío
    const subtotal = cartTotal - deliveryCost;
    
    // Verificar si califica para envío gratis
    const qualifiesForFreeShipping = subtotal >= Envio;
    const amountMissing = qualifiesForFreeShipping ? 0 : Envio - subtotal;
    const progressValue = Math.min(subtotal, Envio);

    return (
        <div className={styles.containerMain}>
            {!qualifiesForFreeShipping ? (
                <div className={`block ${styles.containerDeliveryPay}`}>
                    <div className={`flex ${styles.containerDeliveryText}`}>
                        Te faltan <FormattedPrice value={amountMissing} />
                        <p className={styles.textAddSend}> para que tu envío sea gratis.</p>
                    </div>
                    <div>
                        <div className={`flex ${styles.price__progress}`}>
                            <span><FormattedPrice value={0} /></span>
                            <span><FormattedPrice value={Envio} /></span>
                        </div>
                        <progress className={styles.progressBar} max={Envio} value={progressValue} />
                    </div>
                </div>
            ) : (
                <div className={styles.containerDeliveryFree}>
                    ¡Disfruta comprando! Tu envío es totalmente gratis.
                </div>
            )}
        </div>
    )
}

Freeshipping.defaultProps = {
    Envio: 200000
} 

Freeshipping.getSchema = () => {
    return {
        title: 'Freeshipping',
        type: 'object',
        properties: {
            Envio: {
                title: 'Valor envio gratis',
                type: 'number'
            }
        }
    }
}

export { Freeshipping }