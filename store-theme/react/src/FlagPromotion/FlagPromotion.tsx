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

    const dtoBinesPromotion = allBenefits.find((benefit: any) => {
        if (!benefit || !benefit.name) return false;
        const benefitName = benefit.name.toLowerCase();
        return benefitName.includes('dto bines');
    });

    let apiDtoBinesPromotion = null;
    if (apiData) {
        let processedApiBenefits = [];
        if (Array.isArray(apiData)) {
            processedApiBenefits = apiData;
        } else if (apiData && typeof apiData === 'object') {
            processedApiBenefits = apiData.benefits || apiData.items || apiData.data || Object.values(apiData);
        }

        apiDtoBinesPromotion = processedApiBenefits.find((benefit: any) => {
            if (!benefit || !benefit.name) return false;
            const benefitName = benefit.name.toLowerCase();
            return benefitName.includes('dto bines');
        });
    }

    if (!dtoBinesPromotion && !apiDtoBinesPromotion) {
        return null;
    }

    const promotionData = dtoBinesPromotion || apiDtoBinesPromotion;

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
