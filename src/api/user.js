import request from '@/utils/http'
import { getAction, postAction } from './manage'

const login = (params) => postAction('/sys/login', params)
const logout = (logoutToken) => {
	return request({
		url: '/sys/logout',
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			'X-Access-Token': logoutToken,
		},
	})
}

const queryPermissionsByUser = () => getAction('/sys/permission/getUserPermissionByToken')
const getInfo = (params) => postAction('/users/info', params)

export { login, logout, getInfo, queryPermissionsByUser }
