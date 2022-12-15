import { USER_INFO } from '@/utils/root/local_storageKeys'
import ls from '@/utils/ls_operation'
const getters = {
	permissionList: (state) => state.user.permissionList,
	permission_routers: (state) => state.permission.addRoutes,
	sidebar: (state) => state.display.sidebar,
	userInfo: (state) => ls.get(USER_INFO),
}

export default getters
