import { getAction, postAction } from './manage'

const login = (params) => postAction('/sys/login', params)
const logout = (params) => postAction('/sys/logout', params)
const queryPermissionsByUser = () => getAction('/sys/permission/getUserPermissionByToken')
const getInfo = (params) => postAction('/users/info', params)

export { login, logout, getInfo, queryPermissionsByUser }
