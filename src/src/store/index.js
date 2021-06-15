import { createStore } from 'vuex'
import axios from 'axios';
import parseJson from 'json-parse-better-errors';

const schema2str = obj => JSON.stringify(obj, null, 2) || '';

const {network} = window.rubick;

const request = axios.create({
  baseURL: `http://${network.getIPAddress()}:8002`
});

// Create a new store instance.
const store = createStore({
  state () {
    return {
      records: [],
      methodWhiteList: ['POST', 'GET'],
      serverInfo: {},
      recordDetail: {},
      showDetail: false,
      readonly: true,
      mockList: [],
    }
  },
  mutations: {
    changeReadOnly(state, type) {
      state.readonly = type;
    },
    clearRecord (state) {
      state.records = [];
    },
    changePanelStatus(state) {
      state.showDetail = !state.showDetail;
    },
    changeDetailBody(state, payload) {
      state.recordDetail.schema2str = payload;
      try {
        state.recordDetail.data = parseJson(payload);
        const id = state.recordDetail.requestDetail.id;
        state.mockList = state.mockList.map(item => {
          if (item.requestDetail.id === id) {
            return state.recordDetail
          }
          return item;
        });
      } catch (e) {
        console.log(e);
        // ignore
      }
    },
    addRecord (state, payload) {
      const newRecords = state.records.slice();
      let include = false;
      payload.forEach(item => {
        if (!state.methodWhiteList.includes(item.method)) return;
        item.icon = 'NetWorkFile'
        if (item.url.indexOf('html') > 0) {
          item.icon = 'HtmlFile'
        }
        if (item.url.indexOf('js') > 0) {
          item.icon = 'JSFile'
        }
        if (item.url.indexOf('css') > 0) {
          item.icon = 'CSSFile'
        }
        if (item.url.indexOf('jpg') > 0 || item.url.indexOf('icon') > 0 || item.url.indexOf('png') > 0 || item.url.indexOf('gif') > 0 || item.url.indexOf('jpeg') > 0) {
          item.icon = 'ImgFile'
        }

        newRecords.find((res) => {
          if (res.host === item.host) {
            include = res;
            return true;
          }
          return false;
        });
        if (!include) {
          newRecords.unshift({
            host: item.host,
            apiList: [
              item,
            ],
          })
        } else {
          const index = include.apiList.findIndex((api) => {
            return api.id === item.id;
          });

          if (index >= 0) {
            // set the mark to ensure the item get re-rendered
            include.apiList[index] = item;
          } else {
            include.apiList.unshift(item);
          }

        }
      })

      state.records = newRecords
    },
    setServerInfo(state, payload) {
      console.log(payload)
      state.serverInfo = payload;
    },
    setDetail(state, payload) {
      state.recordDetail = payload;
    },
    addMock(state, payload) {
      state.mockList.push(payload);
    },
    changeMockSelect(state, selectIds) {
      state.mockList = state.mockList.map(item => {
        if (selectIds.indexOf(item.requestDetail.id) >= 0) {
          return {
            ...item,
            __mock: true,
          };
        }
        return {
          ...item,
          __mock: false,
        };
      })
    }
  },
  actions: {
    getQrCode({ commit, state }) {
      request
        .get('/api/getQrCode')
        .then((response) => {
          const { qrImgDom, isRootCAFileExists, url } = response.data;
          commit('setServerInfo', {
            ...state.serverInfo,
            loadingCAQr: false,
            CAQrCodeImageDom: qrImgDom,
            isRootCAFileExists,
            url
          });
        })
        .catch((error) => {
          console.log('getQrCode: ' + error);
        });
    },
    getInitData({ commit, state }) {
      request
        .get('/api/getInitData')
        .then((response) => {
          const { rootCADirPath, ipAddress, rootCAExists } = response.data;
          commit('setServerInfo', {
            ...state.serverInfo,
            rootCADirPath: rootCADirPath,
            rootCAExists,
            port: '8001',
            ipAddress
          });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getRequestDetail({ commit }, item) {
      request
        .get(`/fetchBody?id=${item.id}&__t=${Date.now()}`)
        .then((response) => {
          commit('setDetail', {
            data: JSON.parse(response.data.resBody),
            requestDetail: item,
            schema2str: schema2str(JSON.parse(response.data.resBody)),
          });
          commit('changePanelStatus');
          commit('changeReadOnly', true);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addMock({commit}, payload) {
      request
        .get(`/fetchBody?id=${payload.id}&__t=${Date.now()}`)
        .then((response) => {
          const mockItem = {
            data: JSON.parse(response.data.resBody),
            requestDetail: payload,
            schema2str: schema2str(JSON.parse(response.data.resBody)),
            __mock: true,
          };
          commit('addMock', mockItem)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
});

export default store;
