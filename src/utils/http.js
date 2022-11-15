import axios from 'axios'
import { getToken } from '@/utils/root/lsOperation'
import router from '@/router'

const baseURL = process.env.VUE_APP_API_BASE_URL

let service = axios.create({
	baseURL,
	withCredentials: true,
})

service.interceptors.request.use(
	function (config) {
		let token = getToken()
		if (token) {
			config.headers.authorization = token
			// config.headers['accessToken'] = Token;
		}
		return config
	},
	function (error) {
		return Promise.reject(error)
	},
)

service.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		console.log('error', error)
		return Promise.reject(error)
	},
)

export default service
