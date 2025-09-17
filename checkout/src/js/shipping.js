export const addShippingInfo = () => {
  const observer = new MutationObserver((mutations, obs) => {
    const $container = $('.vtex-omnishipping-1-x-SummaryItemGroup');


    if ($container.length === 0) return;

    if ($('.myship').length > 0) return;

    const logisticsInfo = vtexjs?.checkout?.orderForm?.shippingData?.logisticsInfo;
    if (!logisticsInfo || logisticsInfo.length === 0) return;

    const selectedSla = logisticsInfo[0].selectedSla;
    if (!selectedSla) return;
    if ($('.myship').length > 0) return;
    const html = `
          <div class="myship">
            <p class="warning-envio">
              <span>Tipo de Envío:</span> ${selectedSla}
            </p>
          </div>
        `;

    $container.append(html);
    obs.disconnect();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};


