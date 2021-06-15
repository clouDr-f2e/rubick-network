<template>
  <a-drawer
      title="请求详情"
      placement="right"
      :visible="showDetail"
      @close="changePanelStatus"
      width="600"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="header" tab="Headers">
        <div class="detail-container">
          <a-descriptions title="General" :column="1">
            <a-descriptions-item label="URL">{{ recordDetail.requestDetail.url }}</a-descriptions-item>
            <a-descriptions-item label="Request Method">{{ recordDetail.requestDetail.method }}</a-descriptions-item>
            <a-descriptions-item label="Status Code">{{ recordDetail.requestDetail.statusCode }}</a-descriptions-item>
            <a-descriptions-item label="Protocol">{{ recordDetail.requestDetail.protocol }}</a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="Response Header" :column="1">
            <a-descriptions-item :key="key" v-for="(value, key) in recordDetail.requestDetail.resHeader" :label="key">{{ value }}</a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="Request Header" :column="1">
            <a-descriptions-item :key="key" v-for="(value, key) in recordDetail.requestDetail.reqHeader" :label="key">{{ value }}</a-descriptions-item>
          </a-descriptions>
          <a-divider />
          <a-descriptions title="Request Body" :column="1">
            <a-descriptions-item>{{ recordDetail.requestDetail.reqBody }}</a-descriptions-item>
          </a-descriptions>
        </div>

      </a-tab-pane>
      <a-tab-pane forceRender key="body" tab="ResBody">
        <prism-editor
            class="my-editor"
            :modelValue="recordDetail.schema2str"
            :highlight="highlighter"
            @update:modelValue="changeData"
            line-numbers
            :readonly="readonly"
        >
        </prism-editor>
      </a-tab-pane>
      <a-tab-pane key="cookie" tab="Cookies">

      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script>
import {computed, reactive, toRefs} from 'vue';
import {useStore} from 'vuex';
import { PrismEditor } from 'vue-prism-editor';
import { highlight, languages } from 'prismjs/components/prism-core';

import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-coy.css'; // import syntax highlighting styles


export default {
  setup() {
    const store = useStore();
    const state = reactive({
      activeKey: 'header',
      recordDetail: computed(() => store.state.recordDetail)
    });

    return {
      ...toRefs(state),
      showDetail: computed(() => store.state.showDetail),
      readonly: computed(() => store.state.readonly),
      changePanelStatus: () => store.commit('changePanelStatus'),
      changeData: (v) => store.commit('changeDetailBody', v),
    }

  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.js);
    }
  },
  components: {
    PrismEditor,
  }
}
</script>

<style lang="less">
.ant-descriptions-row>th, .ant-descriptions-row>td {
  padding-bottom: 4px !important;
}
.detail-container {
  height: 600px;
  overflow: auto;
}
</style>
