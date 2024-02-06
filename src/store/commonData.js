// commonData.js
const state = {
  userData: null,
};

const mutations = {
  setUserData(state, response) {
    state.userData = response;
  },
};

const actions = {
  saveUserData({ commit }, response) {
    commit('setuserData', response);
  },
};

const getters = {
  getUserData: (state) => {
    return state.userData;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
