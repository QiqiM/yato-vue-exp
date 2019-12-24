import { login, logout, getInfo } from '@/api/user'
import { getButton } from '@/api/system'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getId, setId, removeId } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '../index'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  permissions: [],
  buttons: {},
  _id : getId(),
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
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_BUTTON: (state, buttons) => {
    state.buttons = buttons
  },
  SET_ID: (state, id) => {
    state._id = id
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    console.log('login', 1111)
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log('login', 2222)
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_ID', data.user._id)
        setToken(data.token)
        setId(data.user._id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    store.dispatch('user/getButton')
    return new Promise((resolve, reject) => {
      getInfo(state._id).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction, permissions } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_PERMISSIONS', permissions)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getButton({ commit, state }) {
    return new Promise((resolve, reject) => {
      getButton({
        page_no: 1,
        page_size: 20
      }).then((res) => {
        const data = res.data.items
        const btn = {}
        data.forEach(item => {
          btn[item.code] = item.name
        })

        commit('SET_BUTTON', btn)
        resolve(btn)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ID', '')
        removeToken()
        removeId()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_ID', '')
      removeToken()
      removeId()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
