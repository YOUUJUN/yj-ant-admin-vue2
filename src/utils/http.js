import axios from 'axios'
import { getToken } from '@/utils/lsOperation'
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
			config.headers[ 'X-Access-Token' ] = token
		}
		return config
	},
	function (error) {
		return Promise.reject(error)
	},
)

service.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		console.log('error', error)
		return Promise.reject(error)
	},
)

export default service
