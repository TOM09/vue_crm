import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './styles/h_style.css';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import 'mint-ui/lib/style.css'
import Mint from 'mint-ui';
import ajax from './axios.js';

Vue.prototype.$get = ajax.get;
Vue.prototype.$post = ajax.post;
Vue.prototype.$delete = ajax.delete;
Vue.prototype.$put = ajax.put;
Vue.prototype.$patch = ajax.patch;

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(Mint);
Vue.use(ElementUI);

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
