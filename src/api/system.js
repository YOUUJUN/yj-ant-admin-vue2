import { getAction, postAction, putAction, deleteAction } from './manage'
import ls from '@/utils/lsOperation'
import { UI_CACHE_DB_DICT_DATA } from '@/utils/root/localStorageKeys'

//权限管理
const getPermissionList = (params) => getAction('/sys/permission/list', params)

//字典标签专用（通过code获取字典数组）
const ajaxGetDictItems = (code, params) => getAction(`/sys/dict/getDictItems/${code}`, params)
//从缓存中获取字典配置
const getDictItemsFromCache = (dictCode) => ls.get(UI_CACHE_DB_DICT_DATA)?.[dictCode] || null

// 校验授权标识是否重复
const duplicateCheck = (params) => getAction('/sys/duplicate/check', params)

//获取树形结构菜单数据
const queryTreeMenuList = (params) => getAction('/sys/permission/queryTreeList', params)

//权限管理
const addPermission = (params) => postAction('/sys/permission/add', params)
const editPermission = (params) => putAction('/sys/permission/edit', params)
const deletePermission = (params) => deleteAction('/sys/permission/delete', params)

export {
	getPermissionList,
	ajaxGetDictItems,
	getDictItemsFromCache,
	duplicateCheck,
	queryTreeMenuList,
	addPermission,
	editPermission,
	deletePermission,
}
