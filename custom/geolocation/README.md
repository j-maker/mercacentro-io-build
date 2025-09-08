# Componente Geolocation

Este componente proporciona un modal para seleccionar el método de entrega (domicilio o recoger en tienda) con integración al checkout de VTEX IO y persistencia en localStorage.

## Características

- Modal responsivo con diseño similar a VTEX IO
- Dos opciones de entrega: domicilio y recoger en tienda
- Formulario de dirección para entrega a domicilio
- Selección de tienda para recoger en tienda
- **Persistencia en localStorage** para mantener la selección entre sesiones
- **Integración automática con checkout** de VTEX IO
- **Carga automática** de información guardada
- Hooks personalizados para manejo de estado
- Estilos personalizables

## Uso

### En un bloque JSONC

```json
{
  "geolocation": {
    "title": "Elige un método de entrega",
    "showButton": true,
    "buttonText": "Seleccionar método de entrega"
  }
}
```

### Props disponibles

- `title` (string): Título del modal (default: "Elige un método de entrega")
- `showButton` (boolean): Mostrar botón para abrir modal (default: true)
- `buttonText` (string): Texto del botón (default: "Seleccionar método de entrega")
- `onDeliveryOptionSelected` (function): Callback cuando se selecciona una opción

### Integración con checkout usando hooks

```typescript
import { useCheckoutIntegration, CheckoutIntegration } from './geolocation';

const CheckoutPage = () => {
  const {
    deliveryOption,
    hasDeliveryOption,
    getFormattedDeliveryInfo,
    isValidDeliveryOption,
    getShippingDataForVTEX
  } = useCheckoutIntegration({
    onDeliveryOptionChange: (option) => {
      // Se ejecuta automáticamente cuando cambia la opción
      console.log('Opción de entrega actualizada:', option);
    },
    autoApplyToOrderForm: true // Aplica automáticamente al orderForm
  });

  return (
    <div>
      <CheckoutIntegration 
        onDeliveryOptionChange={(option) => {
          // Callback adicional si necesitas procesar la opción
          console.log('Opción seleccionada:', option);
        }}
        showEditButton={true}
      />
    </div>
  );
};
```

### Uso básico con localStorage

```typescript
import { useDeliveryOption } from './geolocation';

const MyComponent = () => {
  const { 
    deliveryOption, 
    saveDeliveryOption, 
    clearDeliveryOption,
    getFormattedDeliveryInfo 
  } = useDeliveryOption();

  // La información se guarda automáticamente en localStorage
  // y se carga automáticamente al inicializar el componente
};
```

## Estructura de datos

### Entrega a domicilio
```typescript
{
  type: 'domicilio',
  address: {
    calle: string,
    numero: string,
    apartamento: string,
    ciudad: string,
    departamento: string
  },
  estimatedDelivery: '2-3 días hábiles'
}
```

### Recoger en tienda
```typescript
{
  type: 'tienda',
  store: {
    id: string,
    name: string,
    address: string
  },
  estimatedPickup: '1-2 días hábiles'
}
```

## Persistencia en localStorage

El componente guarda automáticamente la información de entrega en localStorage con la clave `deliveryOption`. Los datos incluyen:

- **Tipo de entrega**: 'domicilio' o 'tienda'
- **Información de dirección** (para domicilio)
- **Información de tienda** (para recogida)
- **Tiempo estimado** de entrega/recogida
- **Timestamp** de la selección

### Eventos personalizados

El componente dispara eventos personalizados cuando cambia la opción de entrega:

```typescript
window.addEventListener('deliveryOptionChanged', (event) => {
  console.log('Opción de entrega cambiada:', event.detail);
});
```

## Estilos

El componente incluye estilos CSS que simulan el diseño de VTEX IO con:
- Colores corporativos (#00a650)
- Tipografía Inter
- Diseño responsivo
- Animaciones suaves
- Estados de hover y selección

## Componentes disponibles

- **GeolocationModal**: Modal principal para seleccionar método de entrega
- **DeliverySummary**: Resumen de la opción seleccionada para mostrar en checkout
- **CheckoutIntegration**: Componente completo para integrar con checkout
- **useDeliveryOption**: Hook para manejar la persistencia en localStorage
- **useCheckoutIntegration**: Hook para integrar con el checkout de VTEX
