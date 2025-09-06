const STEP_CLASSES = {
  cart: 'cart-step',
  info: 'info-step',
  shipping: 'shipping-step',
  payment: 'payment-step',
}

const ALL_STEPS_CLASS = 'step2 step3 step4 active done'

const setStepState = ($wrapper, $steps, stepClass, doneSteps, activeStep) => {
  $wrapper.addClass(stepClass)
  doneSteps.forEach(step => $steps.filter(`.${step}`).addClass('done'))
  $steps.filter(`.${activeStep}`).addClass('active')
}

export const checkoutStepsReader = () => {
  const hash = window.location.hash
  const $wrapper = $('.checkout-steps-custom')
  const $steps = $wrapper.find('.checkout-step')

  $wrapper.removeClass(ALL_STEPS_CLASS)
  $steps.removeClass(ALL_STEPS_CLASS)

  if (hash.includes('cart')) {
    $steps.filter(`.${STEP_CLASSES.cart}`).addClass('active')
  } else if (hash.includes('email') || hash.includes('profile')) {
    setStepState($wrapper, $steps, 'step2', [STEP_CLASSES.cart], STEP_CLASSES.info)
  } else if (hash.includes('shipping')) {
    setStepState($wrapper, $steps, 'step3', [STEP_CLASSES.cart, STEP_CLASSES.info], STEP_CLASSES.shipping)
  } else if (hash.includes('payment')) {
    setStepState(
      $wrapper,
      $steps,
      'step4',
      [STEP_CLASSES.cart, STEP_CLASSES.info, STEP_CLASSES.shipping],
      STEP_CLASSES.payment
    )
  }
}
