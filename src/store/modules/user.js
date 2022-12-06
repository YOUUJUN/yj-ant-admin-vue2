import ls, { getToken, setToken, removeToken } from '@/utils/ls_operation'

import {
	USER_NAME,
	USER_REALNAME,
	USER_INFO,
	UI_CACHE_DB_DICT_DATA,
	USER_AUTH,
	SYS_BUTTON_AUTH,
} from '@/utils/root/local_storageKeys'
import { login, logout, queryPermissionsByUser } from '@/api/user'

const state = {
	token: getToken(),
	userInfo: '',
	username: '',
	realname: '',
	avatar: '',
	permissionList: [],

	introduction: '',
	roles: [],
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
		setToken(token, 7 * 24 * 60 * 60 * 1000)
		console.log('setting token')
	},

	SET_USER_INFO: (state, userInfo) => {
		state.userInfo = userInfo
		userInfo ? ls.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000) : ls.remove(USER_INFO)
	},

	SET_USER_NAME: (state, names) => {
		let { username, realname } = names
		state.username = username
		state.realname = realname
		username ? ls.set(USER_NAME, username, 7 * 24 * 60 * 60 * 1000) : ls.remove(USER_NAME)
		realname ? ls.set(USER_REALNAME, realname, 7 * 24 * 60 * 60 * 1000) : ls.remove(USER_REALNAME)
	},

	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},

	SET_PERMISSIONLIST: (state, permissionList) => {
		state.permissionList = permissionList
	},

	SET_INTRODUCTION: (state, introduction) => {
		state.introduction = introduction
	},

	SET_ROLES: (state, roles) => {
		state.roles = roles
	},
}

const actions = {
	//登录
	Login({ commit }, userInfo) {
		return new Promise((resolve, reject) => {
			login(userInfo)
				.then((res) => {
					if (res.code == '200') {
						const result = res.result
						let { sysUserVO, token, sysAllDictItems, sysRole } = result
						let { username, realName, avatar } = sysUserVO

						//设置token
						commit('SET_TOKEN', token)
						//储存用户数据
						ls.set(UI_CACHE_DB_DICT_DATA, sysAllDictItems, 7 * 24 * 60 * 60 * 1000)
						commit('SET_USER_INFO', sysUserVO)
						commit('SET_USER_NAME', {
							username: username,
							realname: realName,
						})
						commit('SET_AVATAR', avatar)
						resolve(res)
					} else {
						reject(res)
					}
				})
				.catch((err) => {
					reject(err)
				})
		})
	},

	// user logout
	Logout({ commit, state, dispatch }) {
		console.log('logout...')
		return new Promise((resolve, reject) => {
			const lastToken = state.token
			//清除token
			commit('SET_TOKEN', '')
			removeToken()
			//清除用户权限等数据
			commit('SET_PERMISSIONLIST', [])
			ls.remove(UI_CACHE_DB_DICT_DATA)
			// ls.remove(CACHE_INCLUDED_ROUTES)
			ls.remove(USER_AUTH)
			ls.remove(SYS_BUTTON_AUTH)

			commit('SET_USER_INFO', '')
			commit('SET_USER_NAME', {
				username: '',
				realname: '',
			})
			commit('SET_AVATAR', '')

			logout(lastToken)
				.then(() => {
					resolve()
				})
				.catch((err) => {
					reject(err)
				}).finally(() => {
					location.reload()
				})
		})
	},

	//获取用户权限列表
	GetPermissionList({ commit }) {
		return new Promise((resolve, reject) => {
			queryPermissionsByUser()
				.then((response) => {
					console.log('response', response)
					let { menu, auth, allAuth } = response.result

					let menuData = menu
					const authData = auth
					const allAuthData = allAuth

					ls.set(USER_AUTH, JSON.stringify(authData))
					ls.set(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))
					if (menuData?.length > 0) {
						menuData.forEach((item, index) => {
							if (item['children']) {
								let hasChildrenMenu = item['children'].filter((i) => {
									return !i.hidden || i.hidden == false
								})
								if (hasChildrenMenu == null || hasChildrenMenu.length == 0) {
									item['hidden'] = true
								}
							}
						})

						commit('SET_PERMISSIONLIST', menuData)
					} else {
						reject('getPermissionList: permissions must be a non-null array !')
					}
					resolve(response)
				})
				.catch((error) => {
					reject(error)
				})
		})
	},

	// remove token
	resetToken({ commit }) {
		return new Promise((resolve) => {
			commit('SET_TOKEN', '')
			removeToken()
			resolve()
		})
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
