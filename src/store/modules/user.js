import { getToken, setToken, removeToken, saveStorage, removeStorage } from '@/utils/lsOperation'
import {
	USER_NAME,
	USER_REALNAME,
	USER_INFO,
	UI_CACHE_DB_DICT_DATA,
	USER_AUTH,
	SYS_BUTTON_AUTH,
} from '@/utils/root/localStorageKeys'
import { getMenus } from '@/utils/root/routerUtils'
import { login, logout, getInfo, queryPermissionsByUser } from '@/api/user'

import router from '@/router'

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
		saveStorage(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
	},

	SET_USER_NAME: (state, names) => {
		let { username, realname } = names
		state.username = username
		state.realname = realname
		saveStorage(USER_NAME, username, 7 * 24 * 60 * 60 * 1000)
		saveStorage(USER_REALNAME, username, 7 * 24 * 60 * 60 * 1000)
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
						let { userInfo, token, sysAllDictItems, sysRole } = result
						let { username, realname, avatar } = userInfo

						//设置token
						commit('SET_TOKEN', token)
						//储存用户数据
						saveStorage(UI_CACHE_DB_DICT_DATA, sysAllDictItems, 7 * 24 * 60 * 60 * 1000)
						commit('SET_USER_INFO', userInfo)
						commit('SET_USER_NAME', {
							username: username,
							realname: realname,
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
			//清除token
			commit('SET_TOKEN', '')
			removeToken()
			//清除用户权限等数据
			commit('SET_PERMISSIONLIST', [])
			removeStorage(UI_CACHE_DB_DICT_DATA)
			// removeStorage(CACHE_INCLUDED_ROUTES)

			commit('SET_USER_INFO', '')
			commit('SET_USER_NAME', {
				username: '',
				realname: '',
			})
			commit('SET_AVATAR', '')

			logout(state.token)
				.then(() => {
					resolve()
				})
				.catch((err) => {
					reject(err)
				})
		})
	},

	//获取用户权限列表
	GetPermissionList({ commit }) {
		return new Promise((resolve, reject) => {
			queryPermissionsByUser()
				.then((response) => {
					let { menu, auth, allAuth } = response.result

					let menuData = menu
					const authData = auth
					const allAuthData = allAuth

					saveStorage(USER_AUTH, JSON.stringify(authData))
					saveStorage(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))
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

	// get user info
	getInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			getInfo(state.token)
				.then((res) => {
					const { data } = res

					if (!data) {
						reject('Verification failed, please Login again.')
					}

					const { roles, name, avatar, introduction } = data

					// roles must be a non-empty array
					if (!roles || roles.length <= 0) {
						reject('getInfo: roles must be a non-null array!')
					}

					commit('SET_ROLES', roles)
					commit('SET_NAME', name)
					commit('SET_AVATAR', avatar)
					commit('SET_INTRODUCTION', introduction)
					resolve(data)
				})
				.catch((err) => {
					reject(err)
				})
		})
	},

	// remove token
	resetToken({ commit }) {
		return new Promise((resolve) => {
			commit('SET_TOKEN', '')
			commit('SET_ROLES', [])
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
