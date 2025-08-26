import React, { useEffect, useRef } from 'react';
import { useProduct } from 'vtex.product-context';

interface FlixmediaConfig {
  partnerId: string;
  locale?: string;
  currency?: string;
}

const Flixmedia: React.FC<FlixmediaConfig> = ({ 
  partnerId, 
  locale = 'f5', 
  currency = 'COP' 
}) => {
  const productContext = useProduct();
  const flixmediaRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).flixJsCallbacks && typeof (window as any).flixJsCallbacks.reset !== 'undefined') {
      try {
        (window as any).flixJsCallbacks.reset();
      } catch (error) {
      }
    }

    createFlixmediaContainers();
    loadFlixmediaScript();

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);

  const createFlixmediaContainers = () => {
    if (!flixmediaRef.current) return;

    flixmediaRef.current.innerHTML = '';

    const inpageDiv = document.createElement('div');
    inpageDiv.id = 'flix-inpage';
    inpageDiv.className = 'flix-inpage-container';

    const minisiteDiv = document.createElement('div');
    minisiteDiv.id = 'flix-minisite';
    minisiteDiv.className = 'flix-minisite-container';

    flixmediaRef.current.appendChild(inpageDiv);
    flixmediaRef.current.appendChild(minisiteDiv);
  };

  const loadFlixmediaScript = () => {
    if (document.querySelector('script[src*="media.flixfacts.com/js/loader.js"]')) {
      configureFlixmedia();
      return;
    }

    const brand = getProductBrand();
    const mpn = getProductMPN();
    const ean = getProductEAN();
    const price = getProductPrice();

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//media.flixfacts.com/js/loader.js';

    script.setAttribute('data-flix-distributor', partnerId);
    script.setAttribute('data-flix-language', locale);
    script.setAttribute('data-flix-brand', brand);
    script.setAttribute('data-flix-mpn', mpn);
    script.setAttribute('data-flix-ean', ean);
    script.setAttribute('data-flix-inpage', 'flix-inpage');
    script.setAttribute('data-flix-button', 'flix-minisite');
    script.setAttribute('data-flix-price', price);

    script.onload = () => {
      setTimeout(configureFlixmedia, 500);
    };

    script.onerror = () => {
    };

    document.head.appendChild(script);
    scriptRef.current = script;
  };

  const configureFlixmedia = () => {
    if (isInitialized.current) return;

    try {
      if (typeof window !== 'undefined' && (window as any).flixJsCallbacks) {
        const flixJsCallbacks = (window as any).flixJsCallbacks;

        flixJsCallbacks.setLoadCallback(() => {
        }, 'inpage');

        flixJsCallbacks.setLoadCallback(() => {
        }, 'minisite');

        flixJsCallbacks.setLoadCallback(() => {
        }, 'noshow');

        isInitialized.current = true;
      } else {
        setTimeout(configureFlixmedia, 1000);
      }
    } catch (error) {
    }
  };

  const getProductBrand = (): string => {
    if (!productContext?.product?.brand) return '';
    return productContext.product.brand;
  };

  const getProductMPN = (): string => {
    if (!productContext?.product?.items?.[0]?.referenceId) return '';
    return productContext.product.items[0].referenceId;
  };

  const getProductEAN = (): string => {
    if (!productContext?.product?.items?.[0]?.ean) return '';
    return productContext.product.items[0].ean;
  };

  const getProductPrice = (): string => {
    if (!productContext?.product?.priceRange?.sellingPrice?.lowPrice) return '';
    return productContext.product.priceRange.sellingPrice.lowPrice.toString();
  };

  useEffect(() => {
    if (productContext?.product && isInitialized.current) {
      if (typeof window !== 'undefined' && (window as any).flixJsCallbacks) {
        try {
          (window as any).flixJsCallbacks.reset();
        } catch (error) {
        }
      }

      createFlixmediaContainers();
      loadFlixmediaScript();
    }
  }, [productContext?.product]);

  return (
    <div 
      ref={flixmediaRef}
      className="flixmedia-container"
      data-flixmedia-distributor={partnerId}
      data-flixmedia-language={locale}
      data-flixmedia-currency={currency}
    >
    </div>
  );
};

export { Flixmedia };

declare global {
  interface Window {
    flixJsCallbacks: {
      reset: () => void;
      setLoadCallback: (callback: () => void, type: 'inpage' | 'minisite' | 'noshow') => void;
    };
  }
}