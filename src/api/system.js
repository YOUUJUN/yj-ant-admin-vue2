import { getAction, postAction, putAction, deleteAction } from './manage'
import ls from '@/utils/ls_operation'
import { UI_CACHE_DB_DICT_DATA } from '@/utils/root/local_storageKeys'

//权限管理
const getPermissionList = (params) => getAction('/sys/permission/list', params)

//字典标签专用（通过code获取字典数组）
const ajaxGetDictItems = (code, params) => getAction(`/sys/dict/getDictItems/${code}`, params)
//从缓存中获取字典配置
const getDictItemsFromCache = (dictCode) => ls.get(UI_CACHE_DB_DICT_DATA)?.[dictCode] || null
//新增字典项
const addDictItem = (params) => postAction('/sys/dict/add', params)
//修改字典项
const editDictItem = (params) => putAction('/sys/dict/edit', params)
//删除字典项
const deleteDictItem = (params) => deleteAction('/sys/dict/delete', params)

// 校验授权标识是否重复
const duplicateCheck = (params) => getAction('/sys/common/duplicateCheck', params)


//获取树形结构菜单数据(不包含按钮)
const queryTreeMenuList = (params) => getAction('/sys/permission/queryTreeList', params)
//获取树形结构菜单数据(包含按钮)
const queryFullTreeMenuList = (params) => getAction('/sys/permission/getTree', params)

//权限管理
const addPermission = (params) => postAction('/sys/permission/add', params)
const editPermission = (params) => putAction('/sys/permission/edit', params)
const deletePermission = (params) => deleteAction('/sys/permission/delete', params)

export {
	getPermissionList,
	ajaxGetDictItems,
	getDictItemsFromCache,
	addDictItem,
	editDictItem,
	deleteDictItem,
	duplicateCheck,
	queryTreeMenuList,
	queryFullTreeMenuList,
	addPermission,
	editPermission,
	deletePermission,
}
