const state = {
	sidebar: {
		opened: false,
		width: '240',
	},
}

const mutations = {
	TOGGLE_SIDE_BAR(state, payload) {
		state.sidebar.opened = !state.sidebar.opened
	},

	CLOSE_SIDE_BAR(state) {
		state.sidebar.opened = fasle
	},
}

const actions = {
	toggleSideBar({ commit }) {
		commit('TOGGLE_SIDE_BAR')
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
