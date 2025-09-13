import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

interface CountdownProps {
    endDate: string;
    showCountdown?: boolean;
    showDays?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;
    showSeconds?: boolean;
    numberColor?: string;
    textColor?: string;
    numberFontSize?: string;
    textFontSize?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
}

const Countdown: React.FC<CountdownProps> = ({
    endDate,
    showCountdown = true,
    showDays = true,
    showHours = true,
    showMinutes = true,
    showSeconds = true,
    numberColor = '#90B51B',
    textColor = '#000000',
    numberFontSize = '21px',
    textFontSize = '12px',
    backgroundColor = '#f7f7f7',
    borderColor = '#ededed',
    borderWidth = '1px',
    borderRadius = '0px',
    padding = '0px',
    margin = '0px'
}) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpired, setIsExpired] = useState(false);
    const [isValidDate, setIsValidDate] = useState(true);
    const intl = useIntl();

    useEffect(() => {
        const calculateTimeLeft = () => {
            const endDateObj = new Date(endDate);
            const currentDate = new Date();
            
            // Verificar que la fecha sea válida
            if (isNaN(endDateObj.getTime())) {
                console.error('Fecha de finalización inválida:', endDate);
                setIsValidDate(false);
                return;
            }
            
            setIsValidDate(true);
            const difference = endDateObj.getTime() - currentDate.getTime();
            
            if (difference <= 0) {
                setIsExpired(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    const formatNumber = (num: number): string => {
        if (isNaN(num) || num < 0) {
            return '00';
        }
        return num.toString().padStart(2, '0');
    };

    if (isExpired || !showCountdown || !isValidDate) {
        return null;
    }

    const containerStyle = {
        backgroundColor,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius,
        padding: '5px 0px 0',
        margin,
        textAlign: 'center' as const,
        fontFamily: 'Montserrat-Bold, sans-serif',
        width: 'fit-content',
        height: 'fit-content',
        display: 'inline-block'
    };

    const numberStyle = {
        color: numberColor,
        fontSize: numberFontSize,
        fontWeight: 'bold' as const,
        lineHeight: '24px',
        margin: '0 5px',
        display: 'inline-block' as const,
        minWidth: '50px',
        fontFamily: 'Montserrat-Bold, sans-serif'
    };

    const textStyle = {
        color: textColor,
        fontSize: textFontSize,
        lineHeight: '15px',
        margin: '5px 0',
        textTransform: 'capitalize' as const,
        letterSpacing: '1px',
        fontFamily: 'Montserrat-Regular, sans-serif'
    };

    const timeUnitStyle = {
        display: 'inline-block' as const,
        margin: '0',
        verticalAlign: 'top' as const
    };

    const separatorStyle = {
        display: 'inline-block' as const,
        margin: '10px 5px',
        verticalAlign: 'middle' as const,
        fontSize: '28px',
        color: '#c8c8c8',
        fontWeight: 'bold',
        lineHeight: '24px',
        fontFamily: 'Montserrat-Bold, sans-serif'
    };

    return (
        <div style={containerStyle}>
            <div>
                {showDays && (
                    <div style={timeUnitStyle}>
                        <div style={numberStyle}>{formatNumber(timeLeft.days)}</div>
                        <div style={textStyle}>
                            {intl.formatMessage({ id: 'countdown.days', defaultMessage: 'Días' })}
                        </div>
                    </div>
                )}
                
                {showDays && showHours && (
                    <div style={separatorStyle}>
                        :
                    </div>
                )}
                
                {showHours && (
                    <div style={timeUnitStyle}>
                        <div style={numberStyle}>{formatNumber(timeLeft.hours)}</div>
                        <div style={textStyle}>
                            {intl.formatMessage({ id: 'countdown.hours', defaultMessage: 'Horas' })}
                        </div>
                    </div>
                )}
                
                {showHours && showMinutes && (
                    <div style={separatorStyle}>
                        :
                    </div>
                )}
                
                {showMinutes && (
                    <div style={timeUnitStyle}>
                        <div style={numberStyle}>{formatNumber(timeLeft.minutes)}</div>
                        <div style={textStyle}>
                            {intl.formatMessage({ id: 'countdown.minutes', defaultMessage: 'Min.' })}
                        </div>
                    </div>
                )}
                
                {showMinutes && showSeconds && (
                    <div style={separatorStyle}>
                        :
                    </div>
                )}
                
                {showSeconds && (
                    <div style={timeUnitStyle}>
                        <div style={numberStyle}>{formatNumber(timeLeft.seconds)}</div>
                        <div style={textStyle}>
                            {intl.formatMessage({ id: 'countdown.seconds', defaultMessage: 'Seg.' })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Agregar el schema usando una declaración de tipo más directa
const CountdownWithSchema = Countdown as React.FC<CountdownProps> & {
    schema: any;
};

CountdownWithSchema.schema = {
    title: 'Countdown',
    type: 'object',
    properties: {
        endDate: {
            title: 'Fecha de Finalización',
            type: 'string',
            format: 'date-time',
            description: 'Fecha y hora cuando debe terminar la cuenta regresiva'
        },
        showCountdown: {
            title: 'Mostrar Contador',
            type: 'boolean',
            default: true,
            description: 'Controla si el contador se muestra o se oculta completamente'
        },
        showDays: {
            title: 'Mostrar Días',
            type: 'boolean',
            default: true
        },
        showHours: {
            title: 'Mostrar Horas',
            type: 'boolean',
            default: true
        },
        showMinutes: {
            title: 'Mostrar Minutos',
            type: 'boolean',
            default: true
        },
        showSeconds: {
            title: 'Mostrar Segundos',
            type: 'boolean',
            default: true
        },
        numberColor: {
            title: 'Color de los Números',
            type: 'string',
            default: '#90B51B',
            description: 'Color hexadecimal para los números'
        },
        textColor: {
            title: 'Color del Texto',
            type: 'string',
            default: '#000000',
            description: 'Color hexadecimal para el texto'
        },
        numberFontSize: {
            title: 'Tamaño de Fuente de Números',
            type: 'string',
            default: '21px',
            description: 'Tamaño de fuente para los números (ej: 2rem, 32px)'
        },
        textFontSize: {
            title: 'Tamaño de Fuente del Texto',
            type: 'string',
            default: '12px',
            description: 'Tamaño de fuente para el texto (ej: 0.875rem, 14px)'
        },
        backgroundColor: {
            title: 'Color de Fondo',
            type: 'string',
            default: '#f7f7f7',
            description: 'Color de fondo del contador'
        },
        borderColor: {
            title: 'Color del Borde',
            type: 'string',
            default: '#ededed',
            description: 'Color del borde'
        },
        borderWidth: {
            title: 'Ancho del Borde',
            type: 'string',
            default: '1px',
            description: 'Ancho del borde (ej: 1px, 2px)'
        },
        borderRadius: {
            title: 'Radio del Borde',
            type: 'string',
            default: '5px',
            description: 'Radio de las esquinas del borde'
        },
        padding: {
            title: 'Padding',
            type: 'string',
            default: '0px',
            description: 'Espaciado interno del contador'
        },
        margin: {
            title: 'Margin',
            type: 'string',
            default: '0px',
            description: 'Margen externo del contador'
        }
    },
    required: ['endDate']
};

export default CountdownWithSchema;