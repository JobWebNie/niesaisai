import api from '../api'
export const TAB_MENU_SELECT = 'TAB_MENU_SELECT'
export const SET_CHIN_SELECT = 'SET_CHIN_SELECT'
export const SET_TABLE_DATA = 'SET_TABLE_DATA'
const getters = {
  chinOptions: (state) => {
    const base = state.params.name === 'search' ? ['流量指数', '搜索人气'] : ['支付转化率指数', '交易增长幅度']
    const baseGroup = [['牛仔裤', '休闲裤', '打底裤'], ['热销排名', ...base, '支付子订单数'], [7, 14]]
    return baseGroup.map(function (item) {
      return item.map(function (item) {
        if (typeof item === 'number') {
          return {
            label: `近${item}天`,
            value: item
          }
        } else {
          return {
            label: item,
            value: item
          }
        }
      })
    })
  }
}
const state = {
  params: {
    name: 'hotseller',
    dateTime: api.formaterDate(Date.now() - 8.64e7, 'YYYY-MM-DD'),
    productStyle: '牛仔裤',
    extraShown: '热销排名',
    timeLen: 7,
    pageSize: 20,
    pageCurrent: 1
  },
  tableData: {
    tableTitle: [],
    tableBody: [],
    tableTotal: 0
  }
}
const mutations = {
  [TAB_MENU_SELECT] (state, option) {
    state.params.name = option.name
  },
  [SET_CHIN_SELECT] (state, params) {
    for (let k in params) {
      state.params[k] = params[k]
    }
  },
  [SET_TABLE_DATA] (state, data) {
    state.tableData.tableTitle = data.title
    state.tableData.tableBody = data.body
    state.tableData.tableTotal = data.total
  }
}
const actions = {
  fetchProductList ({commit, state}) {
    api.getProductList({params: state.params})
      .then((response) => {
        let [body, title, total] = [[], [], 0]
        if (response) {
          for (let j in response) {
            for (let k in response[j]) {
              if (k === 'total') {
                total = response[j][k]
              } else {
                title.push(k)
              }
            }
            break
          }
          for (let i in response) {
            body.push(response[i])
          }
          commit('SET_TABLE_DATA', {title: title, body: body, total: total})
        }
      })
  }
}
export default {
  getters,
  state,
  mutations,
  actions
}
