/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles.scss */ \"./src/styles.scss\");\n/* harmony import */ var _js_steps__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/steps */ \"./src/js/steps.js\");\n/* harmony import */ var _js_generals__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/generals */ \"./src/js/generals.js\");\n/* harmony import */ var _js_shipping__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/shipping */ \"./src/js/shipping.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n$(document).ready(() => {\r\n  (0,_js_steps__WEBPACK_IMPORTED_MODULE_1__.checkoutStepsReader)()\r\n  ;(0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addCartCheckboxes)()\r\n  const hash = window.location.hash\r\n  if (hash.includes('email')) {\r\n    (0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addPlaceholder)()\r\n    ;(0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addTermsAndConditions)()\r\n  } else if (hash.includes('email') || hash.includes('profile')) {\r\n    (0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addPlaceholder)()\r\n    ;(0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addTermsAndConditions)()\r\n  }\r\n})\r\n\r\n$(window).on('hashchange', () => {\r\n\r\n  ;(0,_js_steps__WEBPACK_IMPORTED_MODULE_1__.checkoutStepsReader)()\r\n  ;(0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addCartCheckboxes)()\r\n  const hash = window.location.hash\r\n  if (hash.includes('email')) {\r\n    (0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addPlaceholder)()\r\n  } else if (hash.includes('email') || hash.includes('profile')) {\r\n    (0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addPlaceholder)()\r\n    ;(0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addTermsAndConditions)()\r\n\r\n  }\r\n  // addShippingInfo()\r\n})\r\n\r\n$(window).on('orderFormUpdated.vtex', function (evt, orderForm) {\r\n  const hash = window.location.hash\r\n  setTimeout(() => {\r\n    ;(0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.changePlaceholder)()\r\n    ;(0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addCartCheckboxes)()\r\n  }, 200)\r\n  if (hash.includes('email') || hash.includes('profile')) {\r\n    (0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addPlaceholder)()\r\n    ;(0,_js_generals__WEBPACK_IMPORTED_MODULE_2__.addTermsAndConditions)()\r\n  }\r\n  (0,_js_shipping__WEBPACK_IMPORTED_MODULE_3__.addShippingInfo)()\r\n})\r\n\n\n//# sourceURL=webpack://checkout/./src/index.js?\n}");

/***/ }),

/***/ "./src/js/generals.js":
/*!****************************!*\
  !*** ./src/js/generals.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addCartCheckboxes: () => (/* binding */ addCartCheckboxes),\n/* harmony export */   addPlaceholder: () => (/* binding */ addPlaceholder),\n/* harmony export */   addTermsAndConditions: () => (/* binding */ addTermsAndConditions),\n/* harmony export */   changePlaceholder: () => (/* binding */ changePlaceholder)\n/* harmony export */ });\nconst changePlaceholder = () => {\r\n  const interval = setInterval(() => {\r\n    if ($('#cart-coupon').length > 0) {\r\n      $('#cart-coupon').attr('placeholder', 'Introduce el cupón')\r\n      clearInterval(interval)\r\n    }\r\n  }, 200)\r\n}\r\n\r\nconst addPlaceholder = () => {\r\n  $('#client-email').attr('placeholder', 'correo@gmail.com')\r\n  $('#client-first-name').attr('placeholder', 'Nombre')\r\n  $('#client-last-name').attr('placeholder', 'Apellido')\r\n  $('#client-document').attr('placeholder', '12345678910')\r\n}\r\n\r\nconst addTermsAndConditions = () => {\r\n  /* $(\".save-data-tex\").prop('checked', false); */\r\n  $('.custom-privacy-message').remove();\r\n}\r\n\r\nconst addCartCheckboxes = () => {\r\n  let checkboxesAdded = false;\r\n  \r\n  // Función para verificar el estado de los checkboxes y controlar el enlace\r\n  const checkButtonState = () => {\r\n    const cartLink = $('#cart-to-orderform');\r\n    if (cartLink.length > 0) {\r\n      const termsChecked = $('#terms-checkbox').is(':checked');\r\n      const privacyChecked = $('#privacy-checkbox').is(':checked');\r\n      \r\n      if (termsChecked && privacyChecked) {\r\n        // Habilitar el enlace\r\n        cartLink.removeAttr('disabled');\r\n        cartLink.removeClass('disabled-link');\r\n        cartLink.off('click.prevent');\r\n        cartLink.css({\r\n          'opacity': '1',\r\n          'pointer-events': 'auto',\r\n          'cursor': 'pointer'\r\n        });\r\n      } else {\r\n        // Deshabilitar el enlace\r\n        cartLink.attr('disabled', 'true');\r\n        cartLink.addClass('disabled-link');\r\n        cartLink.css({\r\n          'opacity': '0.5',\r\n          'pointer-events': 'none',\r\n          'cursor': 'not-allowed'\r\n        });\r\n        \r\n        // Prevenir el comportamiento por defecto del enlace\r\n        cartLink.off('click.prevent').on('click.prevent', function(e) {\r\n          e.preventDefault();\r\n          e.stopPropagation();\r\n          return false;\r\n        });\r\n      }\r\n    }\r\n  };\r\n  \r\n  // Usar un intervalo para verificar cuando el elemento esté disponible\r\n  const interval = setInterval(() => {\r\n    const cartLink = $('#cart-to-orderform');\r\n    \r\n    if (cartLink.length > 0) {\r\n      // Inicialmente deshabilitar el enlace siempre\r\n      cartLink.attr('disabled', 'true');\r\n      cartLink.addClass('disabled-link');\r\n      cartLink.css({\r\n        'opacity': '0.5',\r\n        'pointer-events': 'none',\r\n        'cursor': 'not-allowed'\r\n      });\r\n      \r\n      // Prevenir el comportamiento por defecto del enlace\r\n      cartLink.off('click.prevent').on('click.prevent', function(e) {\r\n        e.preventDefault();\r\n        e.stopPropagation();\r\n        return false;\r\n      });\r\n      \r\n      // Verificar si los checkboxes ya existen para evitar duplicados\r\n      if (!$('#terms-checkbox').length && !checkboxesAdded) {\r\n        // Crear el contenedor de checkboxes\r\n        const checkboxesContainer = `\r\n          <div class=\"cart-checkboxes-container\" style=\"margin-bottom: 40px;\">\r\n            <div class=\"checkbox-item\" style=\"margin-bottom: 10px;\">\r\n              <input type=\"checkbox\" id=\"terms-checkbox\" name=\"terms-checkbox\">\r\n              <label for=\"terms-checkbox\" style=\"margin-left: 8px; font-size: 14px; color: #000000;\">Acepto los términos y condiciones</label>\r\n            </div>\r\n            <div class=\"checkbox-item\" style=\"margin-bottom: 10px;\">\r\n              <input type=\"checkbox\" id=\"privacy-checkbox\" name=\"privacy-checkbox\">\r\n              <label for=\"privacy-checkbox\" style=\"margin-left: 8px; font-size: 14px; color: #000000;\">Acepto la política de tratamiento de datos</label>\r\n            </div>\r\n          </div>\r\n        `;\r\n        \r\n        // Insertar los checkboxes antes del enlace\r\n        cartLink.before(checkboxesContainer);\r\n        \r\n        // Agregar event listeners a los checkboxes\r\n        $('#terms-checkbox, #privacy-checkbox').on('change', checkButtonState);\r\n        \r\n        checkboxesAdded = true;\r\n        console.log('Checkboxes agregados y enlace deshabilitado');\r\n      }\r\n      \r\n      // Verificar el estado del enlace\r\n      checkButtonState();\r\n    }\r\n  }, 200); // Verificar cada 200ms para ser más agresivo\r\n  \r\n  // Observer para detectar cambios en el DOM\r\n  const observer = new MutationObserver((mutations) => {\r\n    mutations.forEach((mutation) => {\r\n      if (mutation.type === 'childList') {\r\n        const cartLink = $('#cart-to-orderform');\r\n        if (cartLink.length > 0) {\r\n          // Forzar deshabilitación del enlace si los checkboxes no están marcados\r\n          setTimeout(() => {\r\n            checkButtonState();\r\n          }, 100);\r\n        }\r\n      }\r\n    });\r\n  });\r\n  \r\n  // Observar cambios en el body\r\n  observer.observe(document.body, {\r\n    childList: true,\r\n    subtree: true\r\n  });\r\n  \r\n  // Limpiar el intervalo después de 15 segundos\r\n  setTimeout(() => {\r\n    clearInterval(interval);\r\n    observer.disconnect();\r\n  }, 15000);\r\n}\n\n//# sourceURL=webpack://checkout/./src/js/generals.js?\n}");

/***/ }),

/***/ "./src/js/shipping.js":
/*!****************************!*\
  !*** ./src/js/shipping.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addShippingInfo: () => (/* binding */ addShippingInfo)\n/* harmony export */ });\nconst addShippingInfo = () => {\r\n  const observer = new MutationObserver((mutations, obs) => {\r\n    const $container = $('.vtex-omnishipping-1-x-SummaryItemGroup');\r\n\r\n\r\n    if ($container.length === 0) return;\r\n\r\n\r\n    if ($('.myship').length > 0) return;\r\n\r\n\r\n    const logisticsInfo = vtexjs?.checkout?.orderForm?.shippingData?.logisticsInfo;\r\n    if (!logisticsInfo || logisticsInfo.length === 0) return;\r\n\r\n    const selectedSla = logisticsInfo[0].selectedSla;\r\n    if (!selectedSla) return;\r\n    if ($('.myship').length > 0) return;\r\n    const html = `\r\n          <div class=\"myship\">\r\n            <p class=\"warning-envio\">\r\n              <span>Tipo de Envío:</span> ${selectedSla}\r\n            </p>\r\n          </div>\r\n        `;\r\n\r\n    $container.append(html);\r\n    obs.disconnect();\r\n    ;\r\n  });\r\n\r\n  observer.observe(document.body, {\r\n    childList: true,\r\n    subtree: true\r\n  });\r\n};\r\n\r\n\r\n\n\n//# sourceURL=webpack://checkout/./src/js/shipping.js?\n}");

/***/ }),

/***/ "./src/js/steps.js":
/*!*************************!*\
  !*** ./src/js/steps.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   checkoutStepsReader: () => (/* binding */ checkoutStepsReader)\n/* harmony export */ });\nconst STEP_CLASSES = {\r\n  cart: 'cart-step',\r\n  info: 'info-step',\r\n  shipping: 'shipping-step',\r\n  payment: 'payment-step',\r\n}\r\n\r\nconst ALL_STEPS_CLASS = 'step2 step3 step4 active done'\r\n\r\nconst setStepState = ($wrapper, $steps, stepClass, doneSteps, activeStep) => {\r\n  $wrapper.addClass(stepClass)\r\n  doneSteps.forEach(step => $steps.filter(`.${step}`).addClass('done'))\r\n  $steps.filter(`.${activeStep}`).addClass('active')\r\n}\r\n\r\nconst checkoutStepsReader = () => {\r\n  const hash = window.location.hash\r\n  const $wrapper = $('.checkout-steps-custom')\r\n  const $steps = $wrapper.find('.checkout-step')\r\n\r\n  $wrapper.removeClass(ALL_STEPS_CLASS)\r\n  $steps.removeClass(ALL_STEPS_CLASS)\r\n\r\n  if (hash.includes('cart')) {\r\n    $steps.filter(`.${STEP_CLASSES.cart}`).addClass('active')\r\n  } else if (hash.includes('email') || hash.includes('profile')) {\r\n    setStepState($wrapper, $steps, 'step2', [STEP_CLASSES.cart], STEP_CLASSES.info)\r\n  } else if (hash.includes('shipping')) {\r\n    setStepState($wrapper, $steps, 'step3', [STEP_CLASSES.cart, STEP_CLASSES.info], STEP_CLASSES.shipping)\r\n  } else if (hash.includes('payment')) {\r\n    setStepState(\r\n      $wrapper,\r\n      $steps,\r\n      'step4',\r\n      [STEP_CLASSES.cart, STEP_CLASSES.info, STEP_CLASSES.shipping],\r\n      STEP_CLASSES.payment\r\n    )\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack://checkout/./src/js/steps.js?\n}");

/***/ }),

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://checkout/./src/styles.scss?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;