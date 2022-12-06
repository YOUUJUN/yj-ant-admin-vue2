import request from '@/utils/http'
import { getAction, postAction, putAction, deleteAction } from './manage'

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
//编辑用户
const editUser = (params) => putAction('/sys/user/edit', params)
//修改用户状态
const editUserStatus = (params) => putAction('/sys/user/editStatus', params)
//删除用户
const deleteUser = (params) => deleteAction('/sys/user/delete', params)
//查询用户角色关系
const fetchUserRoleRelation = (params) => getAction('/sys/userRole/list', params)
//获取角色权限关系列表 
const queryRolePermission = (params) => getAction('/sys/rolePermission/list', params)
//新增角色权限关系
const addRolePermission = (params) => postAction('/sys/rolePermission/add', params)



//添加角色
const addRole = (params) => postAction('/sys/role/add', params)
//编辑角色
const editRole = (params) => putAction('/sys/role/edit', params)

export {
	login,
	logout,
	getRandomImage,
	queryPermissionsByUser,
	queryUserRole,
	addUser,
	editUser,
	editUserStatus,
	deleteUser,
	fetchUserRoleRelation,
	queryRolePermission,
	addRolePermission,
	addRole,
	editRole
}
