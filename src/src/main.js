import { createApp } from 'vue';
import router from '@/router';
import {
  Button,
  message,
  Tree,
  Drawer,
  Descriptions,
  Divider,
  Empty,
  Typography,
  Table,
  Input,
  Select,
  Tag,
  Tabs,
  Popover
} from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import store from '@/store/index';
import App from './App';

const app = createApp(App);
app.config.productionTip = false;

/* Automatically register components under Button, such as Button.Group */
app.use(Button);
app.use(Tree);
app.use(Drawer);
app.use(Descriptions);
app.use(Divider);
app.use(Empty);
app.use(Typography);
app.use(Table);
app.use(Input);
app.use(Select);
app.use(Tag);
app.use(Tabs);
app.use(Popover);

app.use(store);
app.use(router);

app.config.globalProperties.$message = message;

app.mount('#app');
