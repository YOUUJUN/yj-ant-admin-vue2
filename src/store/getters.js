import { USER_INFO, ACCESSIBLE_PLATFORM, SELECTED_PLATFORM } from '@/utils/root/local_storageKeys'
import ls from '@/utils/ls_operation'
const getters = {
	permissionList: (state) => state.user.permissionList,
	permission_routers: (state) => state.permission.addRoutes,
	sidebar: (state) => state.display.sidebar,
	userInfo: (state) => ls.get(USER_INFO),
	accessiblePlatforms : (state) => ls.get(ACCESSIBLE_PLATFORM),	//用户可访问平台
	selectedPlatform : (state) => ls.get(SELECTED_PLATFORM),	//用户选择进入的平台
}

export default getters
