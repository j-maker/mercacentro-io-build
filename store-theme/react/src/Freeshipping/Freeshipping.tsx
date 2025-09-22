import React, { useState, useMemo } from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm';
import styles from './styles.css';
import { pathOr } from 'ramda';
import { FormattedPrice } from 'vtex.formatted-price'

interface FreeshippingProps {
    Envio: number;
    defaultVisible?: boolean;
}

const Freeshipping = ({ Envio, defaultVisible = true }: FreeshippingProps) => {
    const [isVisible, setIsVisible] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('freeshipping-visible');
            return saved !== null ? JSON.parse(saved) : defaultVisible;
        }
        return defaultVisible;
    });
    const orderForm = useOrderForm();

    const cartTotal = pathOr(0, ['orderForm', 'value'], orderForm) / 100;
    const deliveryCost = pathOr(0, ['orderForm', 'shipping', 'deliveryOptions', 0, 'price'], orderForm) / 100;

    const { subtotal, qualifiesForFreeShipping, amountMissing, progressPercentage } = useMemo(() => {
        // Valor mínimo para envío gratis: 150000
        const FREE_SHIPPING_MINIMUM = 150000;
        
        // Validar que los valores sean números válidos
        const validCartTotal = isNaN(cartTotal) ? 0 : cartTotal;
        const validDeliveryCost = isNaN(deliveryCost) ? 0 : deliveryCost;
        
        const sub = validCartTotal - validDeliveryCost;
        const qualifies = sub >= FREE_SHIPPING_MINIMUM;
        const missing = qualifies ? 0 : FREE_SHIPPING_MINIMUM - sub;
        const percentage = Math.min((sub / FREE_SHIPPING_MINIMUM) * 100, 100);

        return {
            subtotal: sub,
            qualifiesForFreeShipping: qualifies,
            amountMissing: missing,
            progressPercentage: percentage
        };
    }, [cartTotal, deliveryCost]);

    const toggleVisibility = () => {
        const newState = !isVisible;
        setIsVisible(newState);
        if (typeof window !== 'undefined') {
            localStorage.setItem('freeshipping-visible', JSON.stringify(newState));
        }
    };

    return (
        <div className={styles.containerMain}>
            <div className={styles.freeShippingBanner}>
                {!qualifiesForFreeShipping ? (
                    <>
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBarWrapper}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>
                        <p className={styles.shippingText}>
                            ¡Te faltan <span className={styles.priceHighlight}>
                                <FormattedPrice value={amountMissing} />
                            </span> para el <span className={styles.highlight}>envío gratis!</span> <span className={styles.highlight} style={{color: '#90B51B'}}> *Aplica Ibague</span>
                        </p>
                    </>
                ) : (
                    <div className={styles.freeShippingSuccess}>
                        <p className={styles.successText}>
                            ¡Felicidades! Tu envío es GRATIS<span className={styles.highlight} style={{color: '#90B51B'}}> *Aplica Ibague</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export { Freeshipping }