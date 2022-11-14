import { getAction, postAction } from './manage'

const login = (params) => postAction('/users/login', params)
const logout = (params) => postAction('/users/logout', params)
const queryPermissionsByUser = () => getAction('/sys/permission/getUserPermissionByToken')
const getInfo = (params) => postAction('/users/info', params)

export { login, logout, getInfo, queryPermissionsByUser }
