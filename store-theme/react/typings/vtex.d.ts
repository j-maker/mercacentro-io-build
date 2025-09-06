declare module 'vtex.product-context' {
  export interface ProductContext {
    product: {
      productId?: string;
      properties?: Array<{
        name: string;
        values?: string[];
      }>;
      description?: string;
      brand?: string;
      items?: Array<{
        referenceId?: string;
        ean?: string;
        itemId?: string;
        sellers?: Array<{
          sellerId?: string;
          commertialOffer?: {
            Price?: number;
          };
        }>;
      }>;
      priceRange?: {
        sellingPrice?: {
          lowPrice?: number;
        };
      };
    };
    selectedItem?: {
      itemId?: string;
      sellers?: Array<{
        sellerId?: string;
        commertialOffer?: {
          Price?: number;
        };
      }>;
    };
  }

  export function useProduct(): ProductContext | null;
}

declare module 'vtex.css-handles' {
  export function useCssHandles(handles: readonly string[]): Record<string, string>;
}

declare module 'vtex.order-manager/OrderForm' {
  export interface OrderForm {
    // Define the structure as needed
  }
  
  export function useOrderForm(): OrderForm;
}

declare module 'vtex.formatted-price' {
  export interface FormattedPriceProps {
    value: number;
  }
  
  export const FormattedPrice: React.FC<FormattedPriceProps>;
}

declare module 'react-apollo' {
  export function useQuery(query: any, options?: any): {
    data: any;
    loading: boolean;
    error: any;
  };
}
