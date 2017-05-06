/**
 * Global app variables and infomation
 */

const serviceDomain = 'http://dongwu-inc.com:10011'
//const serviceDomain = 'http://192.168.0.105:8000'
// const serviceDomain = 'http://127.0.0.1:8000'
// const serviceDomain = 'http://83.169.20.231'

export const address = {
	domain: serviceDomain,

	cookbooks: `${serviceDomain}/cookbooks/cores/`,

	steps: `${serviceDomain}/cookbooks/steps/`,

	ingredients: `${serviceDomain}/cookbooks/ingredients/`,

	images: `${serviceDomain}/cookbooks/images/`,

	materials: `${serviceDomain}/materials/`,

	categories: `${serviceDomain}/categories/`,

	recommends: `${serviceDomain}/recommendations/`,

	markets: `${serviceDomain}/users/biz/?role=market`,

	restaurants: `${serviceDomain}/users/biz/?role=restaurant`,

	marketsCreate: `${serviceDomain}/users/create/?role=market`,

	restaurantsCreate: `${serviceDomain}/users/create/?role=restaurant`,

	create: `${serviceDomain}/users/create/`,

	login: `${serviceDomain}/users/login/`,
}

