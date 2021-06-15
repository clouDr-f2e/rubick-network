<template>
  <a-typography-title :level="5">mock</a-typography-title>
  <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="mockList"
      :pagination="false"
      :scroll="{x: 500, y: 130}"
      size="small"
      :customRow="rowClick"
  >
    <template #name="{ text }">
      <a>{{ text }}</a>
    </template>
  </a-table>
</template>
<script>
import {computed, h, reactive, toRefs} from "vue";
import {useStore} from 'vuex';
import {parseSize} from "@/common/common";

const columns = [
  {
    title: '协议',
    dataIndex: 'requestDetail.protocol',
    width: 70
  },
  {
    title: '域名',
    dataIndex: 'requestDetail.host',
    width: 150,
    tooltip: true
  },
  {
    title: '路径',
    dataIndex: 'requestDetail.path',
    width: 300,
    tooltip: true
  },
  {
    title: '方法',
    dataIndex: 'requestDetail.method',
    width: 80
  },
  {
    title: '类型',
    dataIndex: 'requestDetail.mime',
    width: 120
  },
  {
    title: '体积',
    dataIndex: 'requestDetail.length',
    width: 100,
    customRender: ({ text }) => {
      return h('span', parseSize(text));
    }
  },
  {
    title: '时长',
    dataIndex: 'requestDetail.duration',
    width: 90,
    customRender: ({ text }) => {
      return h('span', text + 'ms');
    }
  }
];
export default{
  setup() {
    const store = useStore();

    const state = reactive({
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {

          const selectIds = selectedRows.map((item) => item.requestDetail.id);
          store.commit('changeMockSelect', selectIds)
        },
        getCheckboxProps: record => ({
          checked: !!record.__mock
        })
      }
    });

    const rowClick = (record) => {
      return {
        onClick: () => {
          store.commit('setDetail', record);
          store.commit('changePanelStatus');
          store.commit('changeReadOnly', false);
        }
      };
    }

    return {
      ...toRefs(state),
      data: [],
      columns,
      rowClick,
      mockList: computed(() => store.state.mockList)
    };
  }
};
</script>
