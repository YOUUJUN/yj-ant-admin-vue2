import request from '@/utils/http'
import { getAction, postAction } from './manage'

const login = (params) => postAction('/sys/user/login', params)
const logout = (logoutToken) => {
	return request({
		url: '/sys/user/logout',
		method: 'get',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			'X-Access-Token': logoutToken,
		},
	})
}

//获取验证码
const getRandomImage = (currentTime) => getAction(`/sys/user/randomImage/${this.currentTime}`)

//获取用户权限
const queryPermissionsByUser = () => getAction('/sys/permission/getUserPermissionByToken')

//获取用户角色
const queryUserRole = (params) => getAction('/sys/user/queryUserRole', params)
//添加用户
const addUser = (params) => postAction('/sys/user/add', params)
//查询用户角色关系
const fetchUserRoleRelation = (params) => getAction('/sys/userRole/list', params)

export { login, logout, getRandomImage, queryPermissionsByUser, queryUserRole, addUser, fetchUserRoleRelation }
