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
        const sub = cartTotal - deliveryCost;
        const qualifies = sub >= Envio;
        const missing = qualifies ? 0 : Envio - sub;
        const percentage = Math.min((sub / Envio) * 100, 100);

        return {
            subtotal: sub,
            qualifiesForFreeShipping: qualifies,
            amountMissing: missing,
            progressPercentage: percentage
        };
    }, [cartTotal, deliveryCost, Envio]);

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
                            </span> para el <span className={styles.highlight}>envío gratis!</span>
                        </p>
                    </>
                ) : (
                    <div className={styles.freeShippingSuccess}>
                        <p className={styles.successText}>
                            ¡Felicidades! Tu envío es <span className={styles.highlight}>GRATIS</span>
                        </p>
                    </div>
                )}
            </div>
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
            },
            defaultVisible: {
                title: 'Visible por defecto',
                type: 'boolean',
                default: true
            }
        }
    }
}

export { Freeshipping }