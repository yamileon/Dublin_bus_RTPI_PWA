import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'

import VueOnsen from 'vue-onsenui';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
Vue.use(VueOnsen);

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
