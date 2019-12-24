import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const IdKey = 'User-Id'


export function getToken() {
  console.log('getToken')
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  console.log('setToken')
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getId() {
  console.log('getId')
  return Cookies.get(IdKey)
}

export function setId(Id) {
  console.log('setId')
  return Cookies.set(IdKey, Id)
}

export function removeId() {
  return Cookies.remove(IdKey)
}
