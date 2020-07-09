/*jshint esversion: 6*/
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import zh from 'root/i18n/i18nZh';
import en from 'root/i18n/i18nEn';
Vue.use(VueI18n);
var enObj=Object.assign(en, enLocale);
var zhObj=Object.assign(zh, zhLocale);
const messages = {
    'en':enObj,
    'zh-cn':zhObj
};
const i18n = new VueI18n({
    messages, 
});
export default i18n;