/**
 * Wrap web srvice process detail 
 */

// import { address, app } from './Information'
import { AppInfo } from './index'

//import _ from 'lodash'

/**
 * @param  {} url
 * @param  {} body=null
 * @param  {} hasCert=true
 * @param  {} method='GET'
 */
function request(url, body = null, hasCert = true, method = 'GET', isJson = true) {
  let elements = {
    method: method
  }

  if (body !== null) {
    elements.body = body
  }

  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
  
  if (hasCert) {
    headers.Authorization = `JWT ${AppInfo.token}`
    
    
    // 平台admin
    // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNzEsImVtYWlsIjoiIiwiZXhwIjoxNDkwOTQwOTY3LCJ1c2VybmFtZSI6InNjaG9vbGFkbWluIn0.LeBfnwcovaQo-wdiLJiekbI4U_Ql3NXlU_gEooC50Rc'
    // console.log('token',AppInfo.token)
  }

  elements.headers = headers

  // console.log("Web service request: %s, headers: %o", url, elements)

  return (
    fetch(url, elements)
      .then((response) => {
        // console.log("Get response:%o", response)
        if (!response.ok) {
          // console.log("Get fail response:%o", response)
          let error = new Error(response.statusText)
          error.response = response
          throw error
        }

        return isJson ? response.json() : response.text()
      })
  )
}


export { request }
