declare module 'vtex.product-context' {
  export interface ProductContext {
    product?: any;
    selectedItem?: any;
    selectedQuantity?: number;
    skuSelector?: any;
    buyButton?: any;
    assemblyOptions?: any;
    [key: string]: any;
  }

  export function useProduct(): ProductContext;
}

declare module 'vtex.order-manager/OrderForm' {
  export interface OrderForm {
    id: string;
    items: Array<{
      id: string;
      productId: string;
      name: string;
      quantity: number;
      price: number;
      sellingPrice: number;
      imageUrl?: string;
      detailUrl?: string;
    }>;
    shippingData?: {
      address?: {
        street: string;
        number: string;
        complement?: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
      };
      logisticsInfo?: Array<{
        itemIndex: number;
        selectedSla: string;
        slas: Array<{
          id: string;
          name: string;
          price: number;
          shippingEstimate: string;
        }>;
      }>;
    };
    pickupData?: {
      address?: {
        street: string;
        number: string;
        complement?: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
      };
    };
    clientProfileData?: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      document?: string;
    };
    paymentData?: {
      paymentSystems?: Array<{
        id: string;
        name: string;
        groupName: string;
      }>;
    };
    deliveryOption?: {
      type: string;
      address?: any;
      store?: any;
    };
    totalizers: Array<{
      id: string;
      name: string;
      value: number;
    }>;
    value: number;
    messages?: Array<{
      text: string;
      status: string;
    }>;
  }
  
  export function useOrderForm(): {
    orderForm: OrderForm | null;
    setOrderForm: (orderForm: OrderForm) => Promise<void>;
    loading: boolean;
    error: any;
  };
}

// Tipificaciones para el contexto global de VTEX
declare global {
  interface Window {
    vtex?: {
      orderForm?: {
        updateShippingData: (shippingData: any) => void;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }
}