import './styles.scss'
import { checkoutStepsReader } from './js/steps'
import { changePlaceholder, addPlaceholder, addTermsAndConditions, addCartCheckboxes, hidePostalCodeIfNoPickupPoints, addTolimaCities } from './js/generals'
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
})

$(window).on('orderFormUpdated.vtex', function (evt, orderForm) {
  const hash = window.location.hash
  setTimeout(() => {
    changePlaceholder()
    addCartCheckboxes()
    hidePostalCodeIfNoPickupPoints()
    addTolimaCities()
  }, 200)
  if (hash.includes('email') || hash.includes('profile')) {
    addPlaceholder()
    addTermsAndConditions()
  }
  addShippingInfo()
})

$(window).on('geolocationChanged', function (evt) {
  setTimeout(() => {
    hidePostalCodeIfNoPickupPoints()
    addTolimaCities()
  }, 500)
})