import { roundFiveDigits } from './helpers.js'

const firstSelect = document.querySelector('[data-first-select]')
const secondSelect = document.querySelector('[data-second-select]')

const swapBtn = document.querySelector('[data-swap-btn]')
const compareInfo = document.querySelector('[data-compare-info]')

const firstInput = document.querySelector('[data-first-input]')
const secondInput = document.querySelector('[data-second-input]')

const BASE_URL = 'https://open.er-api.com/v6/latest'
const FIRST_DEFAULT_CURRENCY = 'USD'
const SECOND_DEFAULT_CURRENCY = 'RUB'

let rates = {}

firstSelect.addEventListener('change', () => updateExchangeRates())
secondSelect.addEventListener('change', () => renderInfo())

firstInput.addEventListener('input', () => {
	secondInput.value = roundFiveDigits(
		firstInput.value * rates[secondSelect.value]
	)
})
secondInput.addEventListener('input', () => {
	firstInput.value = roundFiveDigits(
		secondInput.value / rates[secondSelect.value]
	)
})

swapBtn.addEventListener('click', () => {
	const temp = firstSelect.value
	firstSelect.value = secondSelect.value
	secondSelect.value = temp
	updateExchangeRates()
})

const updateExchangeRates = async () => {
	try {
		const responce = await fetch(`${BASE_URL}/${firstSelect.value}`)
		const data = await responce.json()

		rates = data.rates
		renderInfo()
	} catch (error) {
		console.log(err.message)
	}
}

const renderInfo = () => {
	compareInfo.textContent = `
    1 ${firstSelect.value} = ${rates[secondSelect.value]} ${secondSelect.value}
    `
	firstInput.value = rates[firstSelect.value]
	secondInput.value = rates[secondSelect.value]
}

const populateSelects = () => {
	firstSelect.innerHTML = ''
	secondSelect.innerHTML = ''

	for (let rate of Object.keys(rates)) {
		firstSelect.innerHTML += `<option value="${rate}" ${
			rate === FIRST_DEFAULT_CURRENCY ? 'selected' : ''
		}>${rate}</option>`
		secondSelect.innerHTML += `<option value="${rate}" ${
			rate === SECOND_DEFAULT_CURRENCY ? 'selected' : ''
		}>${rate}</option>`
	}
}

const getInitialRates = async () => {
	try {
		const responce = await fetch(`${BASE_URL}/${FIRST_DEFAULT_CURRENCY}`)
		const data = await responce.json()

		rates = data.rates

		populateSelects()
		renderInfo()
	} catch (err) {
		console.log(err.message)
	}
}

getInitialRates()
