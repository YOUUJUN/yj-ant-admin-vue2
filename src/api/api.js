import { getAction, postAction } from './manage'

//权限管理
const getPermissionList = (params) => getAction('/sys/permission/list', params)

export { getPermissionList }
