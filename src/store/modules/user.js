import { getToken, setToken, removeToken } from "@/utils/auth";
import { login, logout, getInfo } from "@/api/user";

import router from "@/router";

const state = {
    token: getToken(),
    name: "",
    avatar: "",
    introduction: "",
    roles: [],
};

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction;
    },
    SET_NAME: (state, name) => {
        state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles;
    },
};

const actions = {
    login({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({
                username: username.trim(),
                password,
            })
                .then((res) => {
                    console.log('res', res);
                    const { data } = res;
                    commit("SET_TOKEN", data.token);
                    setToken(data.token);
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            getInfo(state.token)
                .then((res) => {
                    const { data } = res;

                    if (!data) {
                        reject("Verification failed, please Login again.");
                    }

                    const { roles, name, avatar, introduction } = data;

                    // roles must be a non-empty array
                    if (!roles || roles.length <= 0) {
                        reject("getInfo: roles must be a non-null array!");
                    }

                    commit("SET_ROLES", roles);
                    commit("SET_NAME", name);
                    commit("SET_AVATAR", avatar);
                    commit("SET_INTRODUCTION", introduction);
                    resolve(data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    // user logout
    logout({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            logout(state.token)
                .then(() => {
                    commit("SET_TOKEN", "");
                    commit("SET_ROLES", []);
                    removeToken();
                    // resetRouter();

                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    // remove token
    resetToken({ commit }) {
        return new Promise((resolve) => {
            commit("SET_TOKEN", "");
            commit("SET_ROLES", []);
            removeToken();
            resolve();
        });
    },
};


export default {
	namespaced : true,
	state,
	mutations,
	actions
}