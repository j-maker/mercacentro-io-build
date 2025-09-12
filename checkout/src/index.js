import './styles.scss'
import { checkoutStepsReader } from './js/steps'
import { changePlaceholder, addPlaceholder, addTermsAndConditions, addCartCheckboxes } from './js/generals'
import { addShippingInfo } from './js/shipping'




$(document).ready(() => {
  checkoutStepsReader()
  addCartCheckboxes()
  const hash = window.location.hash
  if (hash.includes('email')) {
    addPlaceholder()
    addTermsAndConditions()
  } else if (hash.includes('email') || hash.includes('profile')) {
    addPlaceholder()
    addTermsAndConditions()
  }
})

$(window).on('hashchange', () => {

  checkoutStepsReader()
  addCartCheckboxes()
  const hash = window.location.hash
  if (hash.includes('email')) {
    addPlaceholder()
  } else if (hash.includes('email') || hash.includes('profile')) {
    addPlaceholder()
    addTermsAndConditions()

  }
  // addShippingInfo()
})

$(window).on('orderFormUpdated.vtex', function (evt, orderForm) {
  const hash = window.location.hash
  setTimeout(() => {
    changePlaceholder()
    addCartCheckboxes()
  }, 200)
  if (hash.includes('email') || hash.includes('profile')) {
    addPlaceholder()
    addTermsAndConditions()
  }
  addShippingInfo()
})

// Escuchar eventos de geolocalización desde el store-theme
$(window).on('geolocationChanged', function (evt) {
  console.log('Evento de geolocalización recibido en checkout:', evt.detail)
})