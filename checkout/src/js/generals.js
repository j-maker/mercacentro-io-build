export const changePlaceholder = () => {
  const interval = setInterval(() => {
    if ($('#cart-coupon').length > 0) {
      $('#cart-coupon').attr('placeholder', 'Introduce el cupón')
      clearInterval(interval)
    }
  }, 200)
}

export const addPlaceholder = () => {
  $('#client-email').attr('placeholder', 'correo@gmail.com')
  $('#client-first-name').attr('placeholder', 'Nombre')
  $('#client-last-name').attr('placeholder', 'Apellido')
  $('#client-document').attr('placeholder', '12345678910')
}

export const addTermsAndConditions = () => {
  $('.custom-privacy-message').remove();
}

export const addCartCheckboxes = () => {
  let checkboxesAdded = false;
  
  const checkButtonState = () => {
    const cartLink = $('#cart-to-orderform');
    if (cartLink.length > 0) {
      const termsChecked = $('#terms-checkbox').is(':checked');
      const privacyChecked = $('#privacy-checkbox').is(':checked');
      
      if (termsChecked && privacyChecked) {
        cartLink.removeAttr('disabled');
        cartLink.removeClass('disabled-link');
        cartLink.off('click.prevent');
        cartLink.css({
          'opacity': '1',
          'pointer-events': 'auto',
          'cursor': 'pointer'
        });
      } else {
        cartLink.attr('disabled', 'true');
        cartLink.addClass('disabled-link');
        cartLink.css({
          'opacity': '0.5',
          'pointer-events': 'none',
          'cursor': 'not-allowed'
        });
        
        cartLink.off('click.prevent').on('click.prevent', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
      }
    }
  };
  
  const interval = setInterval(() => {
    const cartLink = $('#cart-to-orderform');
    
    if (cartLink.length > 0) {
      cartLink.attr('disabled', 'true');
      cartLink.addClass('disabled-link');
      cartLink.css({
        'opacity': '0.5',
        'pointer-events': 'none',
        'cursor': 'not-allowed'
      });
      
      cartLink.off('click.prevent').on('click.prevent', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
      
      if (!$('#terms-checkbox').length && !checkboxesAdded) {
        const checkboxesContainer = `
          <div class="cart-checkboxes-container" style="margin-bottom: 40px;">
            <div class="checkbox-item" style="margin-bottom: 10px;">
              <input type="checkbox" id="terms-checkbox" name="terms-checkbox">
              <label for="terms-checkbox" style="margin-left: 8px; font-size: 14px; color: #000000;">Acepto los <a href="/terminos-y-condiciones" target="_blank" style="color: #000000; text-decoration: underline;">términos y condiciones</a></label>
            </div>
            <div class="checkbox-item" style="margin-bottom: 10px;">
              <input type="checkbox" id="privacy-checkbox" name="privacy-checkbox">
              <label for="privacy-checkbox" style="margin-left: 8px; font-size: 14px; color: #000000;">Acepto la <a href="/politica-tratamiento-datos" target="_blank" style="color: #000000; text-decoration: underline;">política de tratamiento de datos</a></label>
            </div>
          </div>
        `;
        
        cartLink.before(checkboxesContainer);
        
        $('#terms-checkbox, #privacy-checkbox').on('change', checkButtonState);
        
        checkboxesAdded = true;
      }
      
      checkButtonState();
    }
  }, 200);
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const cartLink = $('#cart-to-orderform');
        if (cartLink.length > 0) {
          setTimeout(() => {
            checkButtonState();
          }, 100);
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  setTimeout(() => {
    clearInterval(interval);
    observer.disconnect();
  }, 15000);
}

export const hidePostalCodeIfNoPickupPoints = () => {
  const checkPickupPoints = () => {
    if (window.vtexjs && window.vtexjs.checkout && window.vtexjs.checkout.orderForm) {
      const orderForm = window.vtexjs.checkout.orderForm;
      const pickupPoints = orderForm.shippingData && orderForm.shippingData.pickupPoints ? orderForm.shippingData.pickupPoints : [];
      
      const element = document.getElementById('postalCode-finished-loading');
      
      if (pickupPoints.length === 0) {
        if (element) {
          element.style.display = 'none';
        } else {
          $('#postalCode-finished-loading').attr('style', 'display: none !important');
        }
      } else {
        if (element) {
          element.style.display = '';
        } else {
          $('#postalCode-finished-loading').removeAttr('style');
        }
      }
    }
  };
  
  checkPickupPoints();
  
  let lastPickupPointsLength = -1;
  
  const checkForOrderFormChanges = () => {
    if (window.vtexjs && window.vtexjs.checkout && window.vtexjs.checkout.orderForm) {
      const orderForm = window.vtexjs.checkout.orderForm;
      const pickupPoints = orderForm.shippingData && orderForm.shippingData.pickupPoints ? orderForm.shippingData.pickupPoints : [];
      
      if (pickupPoints.length !== lastPickupPointsLength) {
        lastPickupPointsLength = pickupPoints.length;
        checkPickupPoints();
      }
    }
  };
  
  const interval = setInterval(checkForOrderFormChanges, 200);
  const directInterval = setInterval(checkPickupPoints, 1000);
  
  setTimeout(() => {
    clearInterval(interval);
    clearInterval(directInterval);
  }, 60000);
}