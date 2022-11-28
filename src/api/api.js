import { getAction, postAction } from './manage'
import ls from '@/utils/lsOperation'
import { UI_CACHE_DB_DICT_DATA } from '@/utils/root/localStorageKeys'

//权限管理
const getPermissionList = (params) => getAction('/sys/permission/list', params)

//字典标签专用（通过code获取字典数组）
const ajaxGetDictItems = (code, params) => getAction(`/sys/dict/getDictItems/${code}`, params)
//从缓存中获取字典配置
const getDictItemsFromCache = (dictCode) => ls.get(UI_CACHE_DB_DICT_DATA)?.[dictCode] || []

export { getPermissionList, ajaxGetDictItems, getDictItemsFromCache }
