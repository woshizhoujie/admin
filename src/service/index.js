import { address } from './address'
import { request } from './utils'
import {isAuth, auth, authedUser, logout, authedUserName} from './auth'

var AppService = {
  request,
}

var AppInfo = {
  address,
  // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IiIsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE0ODk1ODE1MjcsInVzZXJfaWQiOjF9.Trf8MMBqsVcVfHQrEqj7VRlgj7Uf8kiU87pYZc0JCjU',
  token: '',
}

var Auth = {
  auth,
  isAuth,
  authedUser,
  logout
}

export { AppService, AppInfo, Auth }