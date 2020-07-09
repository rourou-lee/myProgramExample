import Vue from 'vue';
import ElementUI from 'element-ui';
import App from 'root/App';
import store from 'root/store/index.js';
import router from 'root/router/router.js';
import i18n from 'root/i18n/index.js';
import 'root/assets/fonts/iconfont.js';
import 'root/assets/fonts-new/iconfont.js';
import 'root/assets/outerStatic/iconfont.js';
import 'root/assets/css/main.css';
import 'root/assets/outerStatic/main.css';
Vue.config.productionTip = false;
Vue.use(ElementUI);
$.ajax({
    url: '/creation/getConfig',
    success(result) {
        if(!result.success) return;
        var data = result.content;
        window.applicationPath=data.applicationPath;
        window.foundationUrl=data.foundationUrl;
        window.localLanguage=data.localLanguage;  // 'en';'zh-cn'    
        window.ssoAppId=data.ssoAppId;
        window.ssoAppKey=data.ssoAppKey;
        window.ssoHost=data.ssoHost;
        window.currentUser={
            id:data.userId,
            realName:data.realName,
            logo:data.logo
        };
        window.isAdmin=data.isAdmin; //是否是超级管理员，如果是，不显示协同和个人导航
        window.supportOnlineEditor=data.supportOnlineEditor;
        window.manageContentTemplate=data.manageContentTemplate;
        window.cloudModel=data.cloudModel;   //是否是云版
        window.mindUrl=data.mindUrl;
        i18n.locale ='zh-cn';
        new Vue({
            i18n,
            store,
            router,
            render: h => h(App)
        }).$mount('#app');
    }
});
