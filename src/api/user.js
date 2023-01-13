import http from '@/utils/http'
import { getAction, postAction, putAction, deleteAction } from './manage'
const request = http()

const login = (params) => {
	return request({
		url: '/sso/user/login',
		method: 'post',
		params,
	})
}

// const login = (params) => postAction('/sso/user/login', params)

const logout = (logoutToken) => {
	return request({
		url: '/sso/user/logout',
		method: 'post',
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
			'X-Access-Token': logoutToken,
		},
	})
}

//获取验证码
const getRandomImage = (params) => postAction('/sso/common/generateVerificationCode', params)

//获取用户权限
const queryPermissionsByUser = (params) => getAction('/rbac/sys/permission/getUserPermissionByToken', params)

//获取用户角色
const queryUserRole = (params) => getAction('/rbac/sys/user/queryUserRole', params)
//添加用户
const addUser = (params) => postAction('/rbac/sys/user/add', params)
//编辑用户
const editUser = (params) => putAction('/rbac/sys/user/edit', params)
//修改用户状态
const editUserStatus = (params) => putAction('/rbac/sys/user/editStatus', params)
//删除用户
const deleteUser = (params) => deleteAction('/rbac/sys/user/delete', params)
//查询用户角色关系
const fetchUserRoleRelation = (params) => getAction('/rbac/sys/userRole/list', params)
//获取角色权限关系列表 
const queryRolePermission = (params) => getAction('/rbac/sys/rolePermission/list', params)
//新增角色权限关系
const addRolePermission = (params) => postAction('/rbac/sys/rolePermission/add', params)
//修改用户角色
const editUserRole = (params) => putAction('/rbac/sys/user/edit', params)


//添加角色
const addRole = (params) => postAction('/rbac/sys/role/add', params)
//编辑角色
const editRole = (params) => putAction('/rbac/sys/role/edit', params)
//删除角色
const deleteRole = (params) => deleteAction('/rbac/sys/role/delete', params)
//修改角色状态
const editRoleStatus = (params) => putAction('/rbac/sys/role/editStatus', params)

//查询用户所属平台集合
const fetchUserPlatforms = (params) => getAction('/rbac/sys/user/getPlatformTypes', params)

//用户选择业务平台
const chooseUserPlatform = (params) => postAction('/rbac/sys/user/cachePlatformType', params)

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
	editUserRole,
	addRole,
	editRole,
	deleteRole,
	editRoleStatus,
	fetchUserPlatforms,
	chooseUserPlatform,
}
