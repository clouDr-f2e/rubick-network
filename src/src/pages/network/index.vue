<template>
  <div class="network-pg">
    <div class="top-setting">
      <a-button type="danger" class="proxy-start-btn" size="large" @click="$router.push('/env')">
        <template #icon>
          <SwapOutlined style="font-size: 20px" />
        </template>
      </a-button>
      <a-button type="primary" class="proxy-start-btn" size="large" @click="changeProxy">
        <template #icon>
          <PauseOutlined v-if="status === 'start'" style="font-size: 20px"/>
          <CaretRightOutlined v-else style="font-size: 20px"/>
        </template>
      </a-button>
      <a-button class="proxy-start-btn" size="large" @click="showSetting">
        <template #icon>
          <SettingOutlined style="font-size: 20px"/>
        </template>
      </a-button>
      <a-button class="proxy-start-btn" size="large" @click="clearRecords">
        <template #icon>
          <ClearOutlined style="font-size: 20px" />
        </template>
      </a-button>
      <a-input-group compact>
        <a-select placeholder="选择过滤请求条件" mode="multiple" v-model:value="typeRule" class="filter-input">
          <a-select-option v-for="(rule, index) in rules" :value="rule.value" :key="index" >
            {{rule.label}}
          </a-select-option>
        </a-select>
        <a-input placeholder="根据url过滤" class="filter-input" v-model:value="urlRule" />
      </a-input-group>
    </div>

    <a-divider />
    <a-drawer
        title="代理设置"
        placement="right"
        v-model:visible="visible"
        width="400"
    >
      <a-descriptions :column="1">
        <a-descriptions-item label="IP">{{ serverInfo.ipAddress[1] }}</a-descriptions-item>
        <a-descriptions-item label="端口">{{ serverInfo.port }}</a-descriptions-item>
        <a-descriptions-item label="根证书安装地址">{{ serverInfo.rootCADirPath }}</a-descriptions-item>
        <a-descriptions-item label="手机扫码"></a-descriptions-item>
        <a-descriptions-item>
          <div v-html="serverInfo.CAQrCodeImageDom"></div>
        </a-descriptions-item>
        <a-descriptions-item label="手动下载"></a-descriptions-item>
        <a-descriptions-item>
          <a-button type="primary" @click="openInBrowser(serverInfo.url)">下载证书</a-button>
        </a-descriptions-item>

      </a-descriptions>
    </a-drawer>
    <RecordList />
    <MockList />
    <RecordDetail />
  </div>
</template>

<script>
import {computed, reactive, toRefs} from 'vue';
import ws from '@/common/ws';
import { PauseOutlined, CaretRightOutlined, SettingOutlined, ClearOutlined, SwapOutlined } from '@ant-design/icons-vue';
import RecordList from './components/record-list';
import MockList from './components/mock-list';
import RecordDetail from './components/record-detail';
import {useStore} from 'vuex';
import {message} from "ant-design-vue";

const rubick = window.rubick;

export default {
  setup() {
    const store = useStore();
    const state = reactive({
      status: 'pause',
      visible: false,
      typeRule: [],
      urlRule: '',
      rules: [
        {
          value: 0,
          label: 'js'
        },
        {
          value: 1,
          label: 'css'
        },
        {
          value: 2,
          label: 'html'
        },
        {
          value: 3,
          label: 'api'
        },
        {
          value: 4,
          label: 'image'
        }
      ]
    });

    const connectWs = () => {
      const wsClient = ws.initWs();
      wsClient.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        store.commit('addRecord', data.content);
      });

      store.dispatch('getQrCode');
      store.dispatch('getInitData');
    }

    const changeProxy = () => {
      if (state.status === 'pause') {
        rubick.network.initNetwork('start', {
          beforeSendResponse: (requestDetail, responseDetail) => {
            const newResponse = responseDetail.response;
            const mockList = store.state.mockList;
            const mockItem = mockList.filter(({requestDetail: item, __mock, __verifyQuery}) => {
              return (
                  item.url === requestDetail.url &&
                  item.method === requestDetail.requestOptions.method &&
                  __mock &&
                  (!__verifyQuery || item.reqBody === requestDetail.requestData.toString())
              );
            });
            if (mockItem.length) {
              newResponse.body = JSON.stringify(mockItem[0].data);
            }
            return { response: newResponse };
          },
          success: () => {
            state.status = 'start';
          },
          onRecord: (data) => {
            store.commit('addRecord', data);
          }
        });
        return;
      }
      rubick.network.initNetwork('pause', {
        success: () => {
          state.status = 'pause';
        }
      });
    }

    const showSetting = () => {
      if (state.status === 'pause') {
        message.error('请先启动服务');
        return;
      }
      state.visible = true;
    }

    const openInBrowser = (url) => {
      rubick.common.openInBrowser(url);
    }

    const clearRecords = () => {
      store.commit('clearRecord');
    }

    return {
      ...toRefs(state),
      changeProxy,
      showSetting,
      openInBrowser,
      clearRecords,
      serverInfo: computed(() => store.state.serverInfo)
    }
  },
  components: {
    PauseOutlined,
    CaretRightOutlined,
    SettingOutlined,
    ClearOutlined,
    SwapOutlined,
    RecordList,
    MockList,
    RecordDetail
  }
}
</script>

<style lang="less">
.network-pg {
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  border-top: 1px solid #e6f7ff;
  .proxy-start-btn {
    border-radius: 6px;
    margin-right: 10px;
    width: 50px;
  }
  .top-setting {
    width: 100%;
    display: flex;
    align-items: center;
    .filter-input {
      width: 250px;
      height: 40px;
      .ant-select-selector {
        height: 40px;
      }
      &:nth-child(1) {
        min-width: 300px;
      }
    }
  }
}
</style>
