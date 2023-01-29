const state = {
	sidebar: {
		opened: false,
		width: '240',
	},
}

const mutations = {
	TOGGLE_SIDE_BAR(state, payload) {
		let opened = payload?.opened
		if(opened !== undefined){
			state.sidebar.opened = opened
		}else{
			state.sidebar.opened = !state.sidebar.opened
		}

		if (state.sidebar.opened === true) {
			state.sidebar.width = '80'
		} else {
			state.sidebar.width = '240'
		}
	},

	CLOSE_SIDE_BAR(state) {
		state.sidebar.opened = fasle
	},
}

const actions = {
	toggleSideBar({ commit }, opened) {
		commit('TOGGLE_SIDE_BAR', { opened })
	},

	closeSideBar({ commit }) {
		commit('CLOSE_SIDE_BAR')
	},
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
}
