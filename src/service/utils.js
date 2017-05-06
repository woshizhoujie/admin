
import { AppInfo } from './index'
 
export function request(config) {
  config = Object.assign({}, {
    url: '',
    body: undefined,
    method: 'GET',
    hasCert: true,
    isJson: true,
  }, config)

  let elements = {
    method: config.method,
    body: config.body,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  if (config.hasCert) {
    elements.headers.Authorization = `JWT ${AppInfo.token}`
  }

  // console.log('config: %o, elements: %o', config, elements)

  return (
    fetch(config.url, elements)
      .then((response) => {
        console.log("Get response:%o", response)
        if (!response.ok) {
          console.log("Get fail response:%o", response)
          let error = new Error(response.statusText || 'Something bas happen')
          error.response = response
          throw error
        }

        return config.isJson ? response.json() : response.text()
      })
  )
}

export const combineDataSource = (results, entities) => results.map(item => entities[item])