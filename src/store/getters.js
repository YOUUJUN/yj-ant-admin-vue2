import { USER_INFO, ACCESSIBLE_PLATFORM } from '@/utils/root/local_storageKeys'
import ls from '@/utils/ls_operation'
const getters = {
	permissionList: (state) => state.user.permissionList,
	permission_routers: (state) => state.permission.addRoutes,
	sidebar: (state) => state.display.sidebar,
	userInfo: (state) => ls.get(USER_INFO),
	accessiblePlatforms : (state) => ls.get(ACCESSIBLE_PLATFORM),	//用户可访问平台
	
}

export default getters
