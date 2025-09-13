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
  
  // Función para verificar el estado de los checkboxes y controlar el enlace
  const checkButtonState = () => {
    const cartLink = $('#cart-to-orderform');
    if (cartLink.length > 0) {
      const termsChecked = $('#terms-checkbox').is(':checked');
      const privacyChecked = $('#privacy-checkbox').is(':checked');
      
      if (termsChecked && privacyChecked) {
        // Habilitar el enlace
        cartLink.removeAttr('disabled');
        cartLink.removeClass('disabled-link');
        cartLink.off('click.prevent');
        cartLink.css({
          'opacity': '1',
          'pointer-events': 'auto',
          'cursor': 'pointer'
        });
      } else {
        // Deshabilitar el enlace
        cartLink.attr('disabled', 'true');
        cartLink.addClass('disabled-link');
        cartLink.css({
          'opacity': '0.5',
          'pointer-events': 'none',
          'cursor': 'not-allowed'
        });
        
        // Prevenir el comportamiento por defecto del enlace
        cartLink.off('click.prevent').on('click.prevent', function(e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
      }
    }
  };
  
  // Usar un intervalo para verificar cuando el elemento esté disponible
  const interval = setInterval(() => {
    const cartLink = $('#cart-to-orderform');
    
    if (cartLink.length > 0) {
      // Inicialmente deshabilitar el enlace siempre
      cartLink.attr('disabled', 'true');
      cartLink.addClass('disabled-link');
      cartLink.css({
        'opacity': '0.5',
        'pointer-events': 'none',
        'cursor': 'not-allowed'
      });
      
      // Prevenir el comportamiento por defecto del enlace
      cartLink.off('click.prevent').on('click.prevent', function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      });
      
      // Verificar si los checkboxes ya existen para evitar duplicados
      if (!$('#terms-checkbox').length && !checkboxesAdded) {
        // Crear el contenedor de checkboxes
        const checkboxesContainer = `
          <div class="cart-checkboxes-container" style="margin-bottom: 40px;">
            <div class="checkbox-item" style="margin-bottom: 10px;">
              <input type="checkbox" id="terms-checkbox" name="terms-checkbox">
              <label for="terms-checkbox" style="margin-left: 8px; font-size: 14px; color: #000000;">Acepto los términos y condiciones</label>
            </div>
            <div class="checkbox-item" style="margin-bottom: 10px;">
              <input type="checkbox" id="privacy-checkbox" name="privacy-checkbox">
              <label for="privacy-checkbox" style="margin-left: 8px; font-size: 14px; color: #000000;">Acepto la política de tratamiento de datos</label>
            </div>
          </div>
        `;
        
        // Insertar los checkboxes antes del enlace
        cartLink.before(checkboxesContainer);
        
        // Agregar event listeners a los checkboxes
        $('#terms-checkbox, #privacy-checkbox').on('change', checkButtonState);
        
        checkboxesAdded = true;
      }
      
      // Verificar el estado del enlace
      checkButtonState();
    }
  }, 200); // Verificar cada 200ms para ser más agresivo
  
  // Observer para detectar cambios en el DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const cartLink = $('#cart-to-orderform');
        if (cartLink.length > 0) {
          // Forzar deshabilitación del enlace si los checkboxes no están marcados
          setTimeout(() => {
            checkButtonState();
          }, 100);
        }
      }
    });
  });
  
  // Observar cambios en el body
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Limpiar el intervalo después de 15 segundos
  setTimeout(() => {
    clearInterval(interval);
    observer.disconnect();
  }, 15000);
}