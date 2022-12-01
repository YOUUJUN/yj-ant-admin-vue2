import axios from 'axios'
import { getToken } from '@/utils/lsOperation'
import router from '@/router'

const baseURL = window._CONFIG['domianURL']

let service = axios.create({
	baseURL,
	withCredentials: true,
	timeout: 9000,
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
		return Promise.reject(error)
	},
)

export default service
