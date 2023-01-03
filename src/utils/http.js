import axios from 'axios'
import { getToken } from '@/utils/ls_operation'
import store from '@/store'
import { Modal, notification } from 'ant-design-vue'

const baseURL = window._CONFIG['domianURL']

function myAxios(customOptions, axiosConfig) {
	//自定义配置
	const custom_options = Object.assign(
		{},
		{
			if_handle_error_status: true, //是否开启接口错误信息处理,默认为true
			if_reduct_data_format: true, //是否开启简洁的数据结构响应, 默认为true
		},
		customOptions,
	)

	const axios_options = Object.assign(
		{},
		{
			baseURL,
			withCredentials: true,
			timeout: 9000,
		},
		axiosConfig
	)

	const service = axios.create(axios_options)

	service.interceptors.request.use(
		function (config) {
			let token = getToken()
			if (token) {
				config.headers['X-Access-Token'] = token
			}
			return config
		},
		function (error) {
			return Promise.reject(error)
		},
	)
	
	service.interceptors.response.use(
		(response) => {
			return custom_options.if_reduct_data_format ? response.data : response;
		},
		(error) => {
			custom_options.if_handle_error_status && httpErrorStatusHandle(error)
			return Promise.reject(error)
		},
	)

	return service
}

function httpErrorStatusHandle(error) {
	if (error.response) {
		const data = error.response.data
		const notifyOption = {
			message: '系统提示',
			description: '',
			duration: 4,
		}
		switch (error.response.status) {
			case 403:
				notifyOption.description = '拒绝访问'
				break
			case 500:
				notifyOption.description = 'Token失效，请重新登录!'

				if (data.message.includes('Token失效')) {
					Modal.error({
						title: '登录已过期',
						content: '很抱歉，登录已过期，请重新登录',
						okText: '重新登录',
						mask: false,
						onOk: () => {
							store.dispatch('user/Logout')
						},
					})
				}
				break
			case 404:
				notifyOption.description = '很抱歉，资源未找到!'
				break
			case 504:
				notifyOption.description = '网络超时'
				break
			case 401:
				notifyOption.description = '未授权，请重新登录'
				setTimeout(() => {
					store.dispatch('user/Logout')
				}, 1500)
				break
			default:
				notifyOption.description = data.message
				break
		}

		notification.error(notifyOption)
	}
}


export default myAxios