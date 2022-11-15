import Vue from 'vue'
import {ACCESS_TOKEN} from '@/utils/root/localStorageKeys'

export function saveStorage(name, value, expire){
	Vue.ls.set(name, value, expire)
}

export function getStorage(name, def){
	Vue.ls.get(name, def)
}

export function removeStorage(name){
	Vue.ls.remove(name)
}


export function getToken() {
	return getStorage(ACCESS_TOKEN)
}

export function setToken(token, expire) {
	return saveStorage(ACCESS_TOKEN, token, expire)
}

export function removeToken() {
	return removeStorage(ACCESS_TOKEN)
}

