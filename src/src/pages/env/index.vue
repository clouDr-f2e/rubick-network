<template>
  <div class="env-pg">
    <div class="top-setting">
      <a-button type="danger" class="proxy-start-btn" size="large" @click="$router.push('/')">
        <template #icon>
          <SwapOutlined style="font-size: 20px" />
        </template>
      </a-button>
    </div>
    <a-divider />
  </div>
</template>

<script>
import { SwapOutlined } from '@ant-design/icons-vue';
import {useStore} from 'vuex';
import {computed} from "vue";

export default {
  setup() {
    const store = useStore();

    return {
      records: computed(() => store.state.records)
    }
  },
  components: {
    SwapOutlined
  }
}
</script>
<style lang="less">
.env-pg {
  padding: 20px;
  box-sizing: border-box;
}
</style>
