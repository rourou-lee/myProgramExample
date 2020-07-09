import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import documentsModule from './modules/documentsModule';
import templatesModule from './modules/templatesModule'
const store =new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
        documentsModule,
        templatesModule
    }
});
export default store;