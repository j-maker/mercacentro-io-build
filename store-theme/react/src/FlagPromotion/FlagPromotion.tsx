import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';
import { useQuery } from 'react-apollo';

import GET_BENEFITS from '../../graphql/getBenefits.gql';

const FlagPromotion = () => {
    const productContext = useProduct();
    const [apiData, setApiData] = useState<any>(null);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState<any>(null);

    if (!productContext) {
        return null;
    }

    const { selectedItem, product } = productContext;

    if (!selectedItem || !product) {
        return null;
    }

    if (!selectedItem.sellers || selectedItem.sellers.length === 0) {
        return null;
    }

    const seller = selectedItem.sellers[0];

    // Obtener clusterHighlights del producto
    const clusterHighlights = (product as any).clusterHighlights || [];

    const fetchApiData = async () => {
        if (!selectedItem.itemId || !seller.sellerId) return;

        setApiLoading(true);
        setApiError(null);

        try {
            const byNameVariants = [
                'dto bines',
                'dto bines',
                'descuento bines',
                'bines',
                'DTO BINES',
                'Descuento Bines'
            ];

            const endpoints = [];
            
            byNameVariants.forEach((byName, index) => {
                endpoints.push({
                    url: '/api/rnb/pvt/benefits/calculatorconfiguration/search',
                    params: new URLSearchParams({
                        'byName': byName
                    }),
                    description: `byName: "${byName}"`
                });
            });

            byNameVariants.slice(0, 3).forEach((byName, index) => {
                endpoints.push({
                    url: '/api/rnb/pvt/benefits/calculatorconfiguration/search',
                    params: new URLSearchParams({
                        'byName': byName,
                        'items[0].id': selectedItem.itemId,
                        'items[0].seller': seller.sellerId,
                        'items[0].quantity': '1'
                    }),
                    description: `byName: "${byName}" + items`
                });
            });

            let response;
            let apiUrl = '';
            let lastError = null;

            const maxAttempts = Math.min(5, endpoints.length);
            for (let i = 0; i < maxAttempts; i++) {
                const endpoint = endpoints[i];
                apiUrl = `${endpoint.url}?${endpoint.params.toString()}`;
                
                try {
                    response = await fetch(apiUrl, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'VtexIdclientAutCookie': document.cookie
                                .split('; ')
                                .find(row => row.startsWith('VtexIdclientAutCookie='))
                                ?.split('=')[1] || ''
                        }
                    });

                    if (response.ok) {
                        break;
                    } else {
                        let errorMessage = `API Error (Attempt ${i + 1}): ${response.status} ${response.statusText}`;
                        try {
                            const errorData = await response.text();
                            errorMessage += ` - ${errorData}`;
                        } catch (e) {
                        }
                        lastError = new Error(errorMessage);
                    }
                } catch (error) {
                    lastError = error;
                }
            }

            if (!response || !response.ok) {
                throw lastError || new Error('All API attempts failed');
            }

            const data = await response.json();

            setApiData(data);
        } catch (error) {
            setApiError(error);
        } finally {
            setApiLoading(false);
        }
    };

    useEffect(() => {
        if (selectedItem.itemId && seller.sellerId) {
            fetchApiData();
        }
    }, [selectedItem.itemId, seller.sellerId]);

    const { data, loading, error } = useQuery(GET_BENEFITS, { 
        variables: { 
            items: [ 
                { id: selectedItem.itemId, seller: seller.sellerId, quantity: "1" } 
            ] 
        },
        skip: !selectedItem.itemId || !seller.sellerId,
        errorPolicy: 'all'
    });

    if (loading) {
        return null;
    }

    if (error) {
        return null;
    }

    if (!data) {
        return null;
    }

    const { benefits } = data || {};
    const allBenefits = benefits || [];
    
    // Buscar específicamente la promoción con nombre 'dto bines' (fijo)
    const dtoBinesPromotion = allBenefits.find((benefit: any) => {
        if (!benefit || !benefit.name) return false;
        return benefit.name.toLowerCase() === 'dto bines';
    });

    // Guardar los nombres de las colecciones si se encuentra la promoción
    if (dtoBinesPromotion && dtoBinesPromotion.collections && Array.isArray(dtoBinesPromotion.collections)) {
        const collectionNames = dtoBinesPromotion.collections.map((c: any) => c.name);
        (dtoBinesPromotion as any).collectionNames = collectionNames;
    }

    let apiDtoBinesPromotion = null;
    if (apiData) {
        let processedApiBenefits = [];
        if (Array.isArray(apiData)) {
            processedApiBenefits = apiData;
        } else if (apiData && typeof apiData === 'object') {
            processedApiBenefits = apiData.benefits || apiData.items || apiData.data || Object.values(apiData);
        }

        // Buscar específicamente la promoción con nombre 'dto bines' (fijo) en la API
        apiDtoBinesPromotion = processedApiBenefits.find((benefit: any) => {
            if (!benefit || !benefit.name) return false;
            return benefit.name.toLowerCase() === 'dto bines';
        });

        // Guardar los nombres de las colecciones si se encuentra la promoción en la API
        if (apiDtoBinesPromotion && apiDtoBinesPromotion.collections && Array.isArray(apiDtoBinesPromotion.collections)) {
            const collectionNames = apiDtoBinesPromotion.collections.map((c: any) => c.name);
            (apiDtoBinesPromotion as any).collectionNames = collectionNames;
        }
    }

    if (!dtoBinesPromotion && !apiDtoBinesPromotion) {
        return null;
    }

    // Priorizar la promoción de la API ya que tiene las colecciones
    const promotionData = apiDtoBinesPromotion || dtoBinesPromotion;
    
    // Guardar los nombres de las colecciones para usar en la lógica
    if (promotionData && promotionData.collections && Array.isArray(promotionData.collections)) {
        const finalCollectionNames = promotionData.collections.map((c: any) => c.name);
        (promotionData as any).collectionNames = finalCollectionNames;
    }

    // Función para validar si el producto pertenece a la colección de la promoción
    const isProductInPromotionCollection = (): boolean => {
        if (!promotionData || !(promotionData as any).collectionNames) {
            return false;
        }

        const promotionCollectionNames = (promotionData as any).collectionNames;
        
        // Verificar si alguna colección del producto coincide con las colecciones de la promoción
        const hasMatchingCollection = clusterHighlights.some((cluster: any) => {
            if (!cluster || !cluster.name) {
                return false;
            }
            return promotionCollectionNames.includes(cluster.name);
        });

        return hasMatchingCollection;
    };

    // Validar si el producto pertenece a la colección de la promoción
    if (!isProductInPromotionCollection()) {
        return null;
    }

    const findPercentualDiscount = (data: any): any => {
        if (!data) return null;
        
        if (data.percentualDiscountValue !== undefined) {
            return data.percentualDiscountValue;
        }
        
        if (Array.isArray(data)) {
            for (const item of data) {
                const found = findPercentualDiscount(item);
                if (found !== null) return found;
            }
        }
        
        if (typeof data === 'object') {
            for (const value of Object.values(data)) {
                const found = findPercentualDiscount(value);
                if (found !== null) return found;
            }
        }
        
        return null;
    };

    const discountValue = apiData ? findPercentualDiscount(apiData) : null;
    const productPrice = seller.commertialOffer?.Price || 0;

    if (!discountValue || discountValue <= 0 || productPrice <= 0) {
        return null;
    }

    const discountAmount = (productPrice * discountValue) / 100;
    const finalPrice = productPrice - discountAmount;

    return (
        <div className="mb3">
            <div>
                <div className="tl flex align-items-center justify-content-left">
                    <img className="mr3" src="/arquivos/promotion-flag.svg" alt="Promotion Flag" />
                    <span>${Math.round(finalPrice).toLocaleString('es-CO')}</span>
                </div>
            </div>
        </div>
    );
};

export { FlagPromotion };
