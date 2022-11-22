import { ACCESS_TOKEN } from '@/utils/root/localStorageKeys'
import Storage from 'vue-ls'

const { ls } = Storage.useStorage({
	namespace: 'pro__',
	name: 'ls',
	storage: 'local',
})

export function getToken() {
	return ls.get(ACCESS_TOKEN)
}

export function setToken(token, expire) {
	return ls.set(ACCESS_TOKEN, token, expire)
}

export function removeToken() {
	return ls.remove(ACCESS_TOKEN)
}


export default ls