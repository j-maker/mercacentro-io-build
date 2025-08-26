import React, { useEffect, useRef } from 'react';
import { useProduct } from 'vtex.product-context';

interface FlixmediaConfig {
  partnerId: string;
  locale?: string;
  currency?: string;
}

const Flixmedia: React.FC<FlixmediaConfig> = ({ 
  partnerId, 
  locale = 'es-CO', 
  currency = 'COP' 
}) => {
  const productContext = useProduct();
  const flixmediaRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Limpiar contenido anterior si existe
    if (typeof window !== 'undefined' && (window as any).flixJsCallbacks) {
      try {
        (window as any).flixJsCallbacks.reset();
      } catch (error) {
        console.log('Flixmedia reset no disponible aún');
      }
    }

    // Crear contenedores para Flixmedia
    createFlixmediaContainers();

    // Cargar script de Flixmedia
    loadFlixmediaScript();

    return () => {
      // Cleanup: remover script si fue agregado por este componente
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, []);

  const createFlixmediaContainers = () => {
    if (!flixmediaRef.current) return;

    // Limpiar contenedor
    flixmediaRef.current.innerHTML = '';

    // Crear contenedores según la documentación oficial
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
    // Verificar si ya existe el script
    if (document.querySelector('script[src*="media.flixfacts.com/js/loader.js"]')) {
      console.log('Script de Flixmedia ya existe, configurando...');
      configureFlixmedia();
      return;
    }

    // Crear script según la documentación oficial
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = '//media.flixfacts.com/js/loader.js';

    // Configurar atributos según la documentación
    script.setAttribute('data-flix-distributor', partnerId);
    script.setAttribute('data-flix-language', locale);
    script.setAttribute('data-flix-brand', getProductBrand());
    script.setAttribute('data-flix-mpn', getProductMPN());
    script.setAttribute('data-flix-ean', getProductEAN());
    script.setAttribute('data-flix-button', 'flix-minisite');
    script.setAttribute('data-flix-inpage', 'flix-inpage');
    script.setAttribute('data-flix-price', getProductPrice());

    // Evento onload para configurar callbacks
    script.onload = () => {
      console.log('Script de Flixmedia cargado correctamente');
      setTimeout(configureFlixmedia, 500);
    };

    script.onerror = () => {
      console.error('Error al cargar el script de Flixmedia');
    };

    // Agregar script al head
    document.head.appendChild(script);
    scriptRef.current = script;
  };

  const configureFlixmedia = () => {
    if (isInitialized.current) return;

    try {
      // Configurar callbacks según la documentación
      if (typeof window !== 'undefined' && (window as any).flixJsCallbacks) {
        const flixJsCallbacks = (window as any).flixJsCallbacks;

        // Callback para inpage
        flixJsCallbacks.setLoadCallback(() => {
          console.log('Flixmedia INpage cargado correctamente');
        }, 'inpage');

        // Callback para minisite
        flixJsCallbacks.setLoadCallback(() => {
          console.log('Flixmedia MiniSite cargado correctamente');
        }, 'minisite');

        // Callback para cuando no hay contenido
        flixJsCallbacks.setLoadCallback(() => {
          console.log('No hay contenido de Flixmedia disponible');
        }, 'noshow');

        isInitialized.current = true;
        console.log('Flixmedia configurado correctamente');
      } else {
        console.warn('Flixmedia callbacks no disponibles aún, reintentando...');
        setTimeout(configureFlixmedia, 1000);
      }
    } catch (error) {
      console.error('Error al configurar Flixmedia:', error);
    }
  };

  // Funciones helper para obtener datos del producto
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

  // Recargar cuando cambie el producto
  useEffect(() => {
    if (productContext?.product && isInitialized.current) {
      console.log('Producto cambiado, recargando Flixmedia...');
      
      // Reset y recargar
      if (typeof window !== 'undefined' && (window as any).flixJsCallbacks) {
        try {
          (window as any).flixJsCallbacks.reset();
        } catch (error) {
          console.log('Error en reset de Flixmedia:', error);
        }
      }

      // Recrear contenedores y recargar
      createFlixmediaContainers();
      loadFlixmediaScript();
    }
  }, [productContext?.product]);

  return (
    <div 
      ref={flixmediaRef}
      className="flixmedia-container"
      data-flixmedia-partner-id={partnerId}
      data-flixmedia-locale={locale}
      data-flixmedia-currency={currency}
    >
      {/* Los contenedores se crean dinámicamente en createFlixmediaContainers() */}
      <div className="flixmedia-loading">
        <p>Cargando contenido multimedia de Flixmedia...</p>
      </div>
    </div>
  );
};

export { Flixmedia };

// Tipos globales para TypeScript según la documentación oficial
declare global {
  interface Window {
    flixJsCallbacks: {
      reset: () => void;
      setLoadCallback: (callback: () => void, type: 'inpage' | 'minisite' | 'noshow') => void;
    };
  }
}