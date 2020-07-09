import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
import Login from 'root/views/Login.vue';
import DocumentsIndex from 'root/views/DocumentsIndex.vue';
import MyDocuments from 'root/components/documents/MyDocuments.vue';
import TemplatesIndex from 'root/views/TemplatesIndex.vue';
import Templates from 'root/components/templates/Templates.vue';
import DocumentsLibraryIndex from 'root/views/DocumentsLibraryIndex.vue';
import KnowledgeLibraryIndex from 'root/views/KnowledgeLibraryIndex.vue';
const routes = [
    { path: '', redirect: '/login' },
    { path: '/login', component: Login,meta:'login' },
    { path: '/documentsIndex', component: DocumentsIndex,
        children:[
            { path: '/', redirect: '/documentsIndex/myDocuments' },
            {path:'/documentsIndex/myDocuments',component: MyDocuments,meta:'myDocuments',query:{id:''}},
            {path:'/documentsIndex/recentlyOpen',component: MyDocuments,meta:'recentlyOpen'},
            {path:'/documentsIndex/recycleBin',component: MyDocuments,meta:'recycleBin'}
        ],
        meta:'documentsIndex'
    },
    { path: '/templatesIndex', component: TemplatesIndex,
        children:[
            { path: '', redirect: '/templatesIndex/docContentTemplates' },
            {path:'/templatesIndex/docContentTemplates',component: Templates,meta:'docContentTemplates'},
            {path:'/templatesIndex/mindMapTemplates',component: Templates,meta:'mindMapTemplates'},
            {path:'/templatesIndex/pptTemplates',component: Templates,meta:'pptTemplates'},
            {path:'/templatesIndex/excelTemplates',component: Templates,meta:'excelTemplates'}
        ],
        meta:'templatesIndex'
    },
    { path: '/documentsLibraray', component: DocumentsLibraryIndex,meta:'docLibraray'},
    {path:'/knowledgeLibraray',component: KnowledgeLibraryIndex,meta:'knowledgeLibraray'}
]
const router = new VueRouter({
    routes
});
export default router;