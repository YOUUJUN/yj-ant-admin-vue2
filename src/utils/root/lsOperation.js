import Storage from 'vue-ls'

const { ls } = Storage.useStorage({
	namespace: 'pro__',
	name: 'ls',
	storage: 'local',
})

import { ACCESS_TOKEN } from '@/utils/root/localStorageKeys'

export function saveStorage(name, value, expire) {
	ls.set(name, value, expire)
}

export function getStorage(name, def) {
	ls.get(name, def)
}

export function removeStorage(name) {
	ls.remove(name)
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
