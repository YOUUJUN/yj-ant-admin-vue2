import { getToken, setToken, removeToken } from '@/utils/auth'
import { getMenus } from '@/utils/routerUtils'
import { login, logout, getInfo, queryPermissionsByUser } from '@/api/user'

import router from '@/router'

const state = {
	token: getToken(),
	name: '',
	avatar: '',
	introduction: '',
	roles: [],
	permissionList : [],
}

const mutations = {
	SET_TOKEN: (state, token) => {
		state.token = token
	},
	SET_INTRODUCTION: (state, introduction) => {
		state.introduction = introduction
	},
	SET_NAME: (state, name) => {
		state.name = name
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar
	},
	SET_ROLES: (state, roles) => {
		state.roles = roles
	},

	SET_PERMISSIONLIST: (state, permissionList) => {
		state.permissionList = permissionList
	},
}

const actions = {
	login({ commit }, userInfo) {
		const { username, password } = userInfo
		return new Promise((resolve, reject) => {
			login({
				username: username.trim(),
				password,
			})
				.then((res) => {
					console.log('res', res)
					const { data } = res
					commit('SET_TOKEN', data.token)
					setToken(data.token)
					resolve(res)
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
					let menuData = response.result.menu
					const authData = response.result.auth
					const allAuthData = response.result.allAuth

					//Vue.ls.set(USER_AUTH,authData);
					sessionStorage.setItem(USER_AUTH, JSON.stringify(authData))
					sessionStorage.setItem(SYS_BUTTON_AUTH, JSON.stringify(allAuthData))

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
						try {
							menuData = [...menuData, ...getMenus()]
							// console.log(" menu show json ", menuData);
						} catch (err) {
							console.log(err)
						}

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

	// user logout
	logout({ commit, state, dispatch }) {
		return new Promise((resolve, reject) => {
			logout(state.token)
				.then(() => {
					commit('SET_TOKEN', '')
					commit('SET_ROLES', [])
					removeToken()
					// resetRouter();

					resolve()
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
