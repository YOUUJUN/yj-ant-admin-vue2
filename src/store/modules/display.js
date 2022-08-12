const state = {
    displayRow : 'X8',
    userInfo : [],
    sidebar : {
        opened : false,
        width : '240'
    }
};

const mutations = {
    CHANGE_DISPLAY_ROW (state, payload){
        state.displayRow = payload;
    },

    INIT_USER_INFO (state, payload){
        state.userInfo = payload;
    },

    TOGGLE_SIDE_BAR (state, payload){
        state.sidebar.opened = !state.sidebar.opened;
    },

    CLOSE_SIDE_BAR(state){
        state.sidebar.opened = fasle;
    }


};

const actions = {
    changeDisplayRow({commit}, payload){
        commit('CHANGE_DISPLAY_ROW', payload);
    },

    initUserInfo ({commit}, payload){
        commit('INIT_USER_INFO', payload);
    },

    toggleSideBar({commit}){
        commit('TOGGLE_SIDE_BAR');
    },

    closeSideBar({commit}){
        commit('CLOSE_SIDE_BAR');
    }
}

export default {
    namespaced : true,
    state,
    mutations,
    actions
}