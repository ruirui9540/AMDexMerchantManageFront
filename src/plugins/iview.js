// 按需引入iview
import Vue from 'vue'
import 'iview/dist/styles/iview.css'


import { Cell, CellGroup, Circle ,Message, Button, InputNumber, Icon} from 'iview';


Vue.component('Cell', Cell);
Vue.component('CellGroup', CellGroup);
Vue.component('iCircle', Circle);
Vue.component('Button', Button);
Vue.component('InputNumber', InputNumber);
Vue.component('Icon', Icon);


Vue.prototype.$Message = Message;