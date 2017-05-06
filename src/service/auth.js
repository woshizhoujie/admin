import { browserHistory } from 'react-router'

var authKey = null
var authedUserName = null

export function isAuth() {
  return authKey !== null
}

export function  auth(username, password, nextURL) {
  authKey = 1
  authedUserName = username
  browserHistory.push(nextURL)
}

export function authedUser() {
  return authedUserName
}

export function logout() {
  authKey = null
  authedUserName = null
  browserHistory.push('/login')
}
