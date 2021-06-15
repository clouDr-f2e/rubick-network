<!-- eslint-disable -->
<template>
  <div class="record-list">
    <a-directory-tree
        v-if="!!records.length"
        multiple
        class="tree-container"
        @select="getRequestDetail"
        @rightClick="opItem"
    >
      <a-tree-node v-for="(item, index) in records" :key="item.host" :title="item.host">
        <a-tree-node
            :key="JSON.stringify(api)"
            v-for="(api, i) in item.apiList"
            is-leaf
        >
          <template #title>
            <a-tag color="blue">{{api.method}}</a-tag>
            <a-tag v-if="api.statusCode" :color="getColor(api.statusCode)">{{api.statusCode}}</a-tag>
            <a-popover trigger="contextmenu" placement="bottom">
              <template #content>
                <p style="cursor: pointer" @click="addMock(api)">加入mock</p>
                <div style="cursor: pointer">复制Curl</div>
              </template>
              {{api.url}}
            </a-popover>
            <span style="color: #999">{{formatDate(api.startTime)}}</span>
          </template>
          <template #icon>
            <component :is="api.icon" />
          </template>
        </a-tree-node>
      </a-tree-node>
    </a-directory-tree>
    <a-empty description="暂无数据" v-else />
  </div>
</template>
<script lang="ts">
import {computed, reactive} from 'vue';
import { useStore } from 'vuex'
import dayjs from 'dayjs';

import CSSFile from './icon/css';
import DefaultFile from './icon/default';
import JSFile from './icon/js';
import NetWorkFile from './icon/network';
import ImgFile from './icon/img';
import HtmlFile from './icon/html';
import {message} from "ant-design-vue";

export default{
  setup() {
    const store = useStore();
    const state = reactive({
      statusTag: {
        '2': 'green',
        '3': 'orange',
        '4': 'red',
        '5': 'red'
      },
    });

    const getColor = (code) => {
      try {
        const codeType = code.toString()[0];
        return state.statusTag[codeType];
      } catch (e) {
        // ignore
      }
      return 'blue';
    }

    const addMock = (item) => {
      if(item.mime !== 'application/json') return message.error('暂不支持返回非json数据mock')
      store.dispatch('addMock', item)
    }

    return {
      records: computed(() => store.state.records),
      getColor,
      addMock,
      formatDate: (timer) => dayjs(timer).format('MM-DD HH:mm:ss'),
      getRequestDetail: (key) => {
        try {
          const item = JSON.parse(key[0]);
          store.dispatch('getRequestDetail', item);
        } catch (e) {
          // ignore
        }
      }
    }
  },
  components: {
    CSSFile, DefaultFile, JSFile, NetWorkFile, ImgFile, HtmlFile
  }
};
</script>
<style>
 .record-list {
   height: 400px;
   overflow: auto;
 }
</style>
