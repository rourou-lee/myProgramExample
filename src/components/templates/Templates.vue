<template>
    <el-container>
        <el-header class="header-top">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="float-l">
                <el-breadcrumb-item ><span>{{breadcrumb}}</span></el-breadcrumb-item>
            </el-breadcrumb>
            <p class="float-r color-9 ht-search posr">
                <input type="text" name v-model.trim="searchText" @keypress.enter="searchTemplates" class="ht-input">
                <i class="iconfont icon-sousuo posa" @click="searchTemplates"></i>
            </p>
        </el-header>
        <div class="main-panel main-panel02">
            <el-tabs class="el-tabs-panel" v-model="activeTemType" @tab-click="changeTemTab">
                <el-tab-pane v-for="(temType,index) in templateTypes.concat(templateCategory)" :key="index" :label="temType.name" :name="temType.id">
                    <p>
                        <span class="font-s12 mr10 cp color-6" :class="{'color-4f': orderBy === 'createTime'}" 
                        @click.stop="orderTemplates('createTime')">{{$t('message.latestRelease')}}</span>
                        <span class="font-s12 cp color-6" v-bind:class="{'color-4f': orderBy === 'usageCount'}"
                        @click.stop="orderTemplates('usageCount')">{{$t('message.mostUsed')}}</span>
                    </p>
                    <!--   @reloadCategory="reloadCategory"
                    :templateType='templateType'-->
                    <CategoryEdit v-if="isContentAdmin" ref='editCatogy' :templateType='templateType'
                    @operateTemplateCategorySuccess="operateTemplateCategorySuccess"/>
                </el-tab-pane>
            </el-tabs>
            <div class="tabscon tp02">
                <div class="el-tabscon-panel mt30">
                    <el-row id="tempalteView" :class="{'other-temlist':breadcrumb!=$t('message.docTemplate')}" :gutter="20" @scroll="loadMoreTemplates($event)"><!--文档模板以外的类型添加类名-->
                        <el-col :span="3" class="mb30" v-for="(template,index) in templates" :key="index">
                            <el-card :body-style="{ padding: '0px' }" class="tabscon-item posr">
                                <img :src="computeCoverSrc(template)" class="image"
                                    @click="readTemplateContent(template)">
                                <div class="tabcon-item-poper posa" v-if="showEditFun(template)">
                                    <i class="iconfont icon-bianji color-9 mr05" :title="$t('message.edit',{'typeName':''})" @click="editTemplate(template)"></i>
                                    <i class="iconfont icon-huishouzhan color-9 mr05" :title="$t('message.delete',{'deleteType':''})" @click="deleteTemplate(template.id)"></i>
                                    <!--复制按钮-->
                                    <i class="iconfont icon-copy color-9" :title="$t('message.use')" @click='useTemCreateOnlineOffice(template)'></i>
                                </div>
                                <div class="tabscon-item-txt text-ellipsis" @mouseenter="computeTitle(template)">
                                    <span class="text-ellipsis" :id="template.id">{{template.templateName}}</span>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                    <div class="el-table__empty-block" v-if="!templatesCount">
                            <span class="el-table__empty-text">{{emptyData}}</span>
                    </div>
                </div>
            </div>
        </div> 
        <ReadTemplateCon v-if="readTemplateContentFlag"
            @changeReadFlag="changeReadFlag" :createDocuments="false" @createUseTemplate="createUseTemplate"/>
        <CreateOrEditTemplate ref='editTemplate' @handdleSuccess="handdleSuccess"/> 
    </el-container>
</template>
<script>
import templateApi from 'root/api/templateApi';
import documentsApi from 'root/api/documentsApi';
import {mapState, mapActions} from 'vuex';
import validateWords from 'root/utils/validateWords';
import ReadTemplateCon from 'root/components/templates/ReadTemplateCon';
import CreateOrEditTemplate from 'root/components/templates/CreateOrEditTemplate';
import CategoryEdit from 'root/components/templates/CategoryEdit'
export default {
    name:'Templates',
    components:{ReadTemplateCon,CreateOrEditTemplate,CategoryEdit},
    mixins: [validateWords],
    data(){
        return {
            breadcrumb:'',
            searchText:'',//模板检索词
            templateType:1,//文档内容、思维导图、ppt\excel模板类型
            templateTypes:[{id:'3',name:this.$t('message.allTemplate')},{id:'0',name:this.$t('message.personalTemplate')}],
            activeTemType:'3',//模板分类激活项
            defaultCover:require('root/assets/images/temImg2.jpg'),
            emptyData:'',
            pageIndex:1,
            orderBy: "createTime",//模板排序类型
            flag:true,
            readTemplateContentFlag:false,
            childrenRouterMeta:['docContentTemplates','mindMapTemplates','pptTemplates','excelTemplates'],
        }
    },
    computed:{
        ...mapState('templatesModule',['templateCategory','templates','templatesCount','curTemplate']),
        isContentAdmin() {
            return true;// window.manageContentTemplate;
        },
    },
    methods:{
        ...mapActions('templatesModule',['uesMindAddCreation']),
        //清除检索条件
        initSearchKey(){
            this.$store.commit('templatesModule/clearTemplates',{list:[],total:0});
            this.pageIndex = 1;
        },
        //初始化所有检索条件
        initAllSearchKey(){
           this.initSearchKey();
           this.activeTemType='3';
           this.orderBy="createTime";
        },
        //检索模板
        searchTemplates(){
            if(!this.validateSearchKey(this.searchText)) return;
            this.initSearchKey();
            this.getTemplates();
        },
        //切换分类
        changeTemTab(tab){
            this.initSearchKey();
            this.initAllSearchKey();
            this.activeTemType = tab.name;
            this.getTemplates();
        },
        //模板按使用次数和创建时间排序
        orderTemplates(orderBy) {
            this.initSearchKey();
            this.orderBy = orderBy;
            this.getTemplates();
        },
        //获取模板分类
        getTemplateCategory(type){
            templateApi.getTemplateCategoryRequest({
                belongType:window.cloudModel?1:0,
                templateType:type,
                searchKey:''
            }).then((data)=>{
                this.$store.commit('templatesModule/setTemplateCategory',[...data]);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //获取模板
        getTemplates(){
            templateApi.getTemplatesRequest({
                page: this.pageIndex,
                size: 12,
                type: Number(this.activeTemType)<6?Number(this.activeTemType):'',
                categoryId:Number(this.activeTemType)<6?'':this.activeTemType,
                key: this.searchText,
                templateType:this.templateType,
                orderBy: this.orderBy
            }).then((data)=>{
                if(data.total==0) this.emptyData=this.$t('message.noData');
                this.$store.commit('templatesModule/setTemplates',data);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //滚动加载更多
        loadMoreTemplates(e){
            if(this.templates.length>=this.templatesCount) return;
            e = e || window.event;
            if (e.wheelDelta || e.detail) {  //判断浏览器ie，谷歌滑轮事件   
                if (e.wheelDelta < 0 || e.detail > 0) { //当滑轮向下滚动时 
                    if (this.flag) {
                        this.flag = false;
                        setTimeout(()=>{
                            if ($('#tempalteView').scrollTop() + $('#tempalteView').height() >= $('div.el-tabscon-panel').height()) {
                                this.pageIndex = this.pageIndex + 1;
                                this.getTemplates();
                            }
                            this.flag = true;
                        }, 1000);
                    }
                }
            }
        },
        //模板封面
        computeCoverSrc(template) {
            if (template.fileCodeCover) {
                return `${window.applicationPath}/fileOperation/download?fileCode=${template.fileCodeCover}&fileName=${template.templateName}`;
            } 
            return this.defaultCover;
        },
        //鼠标滑过展示编辑删除按钮
        showEditFun(template) {
            return (
                (template.organizationId != "-1" &&
                (template.ifPublic == 1 &&window.manageContentTemplate)) ||
                template.ifPublic == 0
            );
        },
        //计算是否显示title
        computeTitle(template) {
            if ($("#" + template.id).width() >=$("#" + template.id).parent().width()){
                $("#" + template.id).attr("title", template.templateName);
            }
        },
        //根据路由获取模板的类型
        getTemplateType(typeName){
            switch(typeName){
                case 'docContentTemplates':
                    this.templateType=1;
                    this.breadcrumb=this.$t('message.docTemplate');
                    break;
                case 'mindTemplates':
                    this.templateType=2;
                    this.breadcrumb=this.$t('message.mindmapTemplate');
                    break;
                case 'pptTemplates':
                    this.templateType=3;
                    this.breadcrumb=this.$t('message.pptTemplate');
                    break;
                case 'excelTemplates':
                    this.templateType=4;
                    this.breadcrumb=this.$t('message.excelTemplete');
                    break;
            }
        },
        initGetData(meta){
            this.searchText='';
            this.getTemplateType(meta);
            this.getTemplateCategory(this.templateType);
            this.initAllSearchKey();
            this.getTemplates();
        },
        //点击阅读模板
        readTemplateContent(template){
            this.$store.commit('templatesModule/setCurTemplate',template);
            this.$store.dispatch('templatesModule/getTemplateInfo',{templateId: template.id}).then((data)=>{
                debugger;
                this.readTemplateContentFlag = true;
            }).catch(()=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //关闭阅读状态
        changeReadFlag(flag){
            //{closeFlag:false,createdFlag:true}
            this.readTemplateContentFlag = flag.closeFlag;
            if(flag.createdFlag){
                this.$message.success(this.$t('message.newSuccess'));
            } 
        },
        //快速适用创建
        useTemCreateOnlineOffice(template){
            this.$store.commit('templatesModule/setCurTemplate',template);
            if(template.type==2){
                this.uesMindAddCreation().then((data)=>{
                    this.createMindCreation(data);
                });
            }else{
                this.createOtherCreation();
            }
        },
        //快速使用思维导图
        createMindCreation(data){
            this.createUseTemplate({
                sourceType:5,
                sourceId:this.curTemplate.id,
                folderId:'',
                fileCode:this.curTemplate.fileCode,
                creationType: 1,
                projectType:this.curTemplate.type,
                currentUserId:window.currentUser.id,
                chargeManId:window.currentUser.id,
                name:this.curTemplate.templateName,
                content:data
            });
        },
        //快速使用其他
        createOtherCreation(){
            this.createUseTemplate({
                name: this.curTemplate.templateName,
                currentUserId:window.currentUser.id,
                chargeManId:window.currentUser.id,
                creationType: 1,
                projectType:this.curTemplate.type==1?5:this.curTemplate.type,
                sourceType: 5,
                sourceId: this.curTemplate.id,
                fileCode:this.curTemplate.fileCode
            });
        },
        //使用模板新建创作
        createUseTemplate(param){
            documentsApi.useTemAddOnlineOfficeRequest(param).then((data)=>{
                if(data) this.changeReadFlag({closeFlag:false,createdFlag:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //删除模板
        deleteTemplate(id) {
            this.$confirm(this.$t("message.delTemTip"), this.$t("message.delete",{'deleteType':''}), {
                confirmButtonText: this.$t("message.sure"),
                confirmButtonClass: "confirm-btn",
                cancelButtonText: this.$t("message.cancel"),
                cancelButtonClass: "cancel-btn",
                type: "warning"
            }).then(() => {
                this.deleteTemplateAction(id);
            });
        },
        //确认删除模板
        deleteTemplateAction(id){
            templateApi.deleteTemplateRequest({templateId: id }).then((data)=>{
                this.$message.success(this.$t('message.delSuccess'));
                this.$store.commit('templatesModule/deleteTemplates',id);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //编辑模板
        editTemplate(template) {
            this.$store.commit('templatesModule/setCurTemplate',template);
            this.emitCreateOrEdit(false);
        },
        //新建或编辑成功后
        handdleSuccess(data){
            this.$message.success(data.msg);
            if(!data.ifReload){
                 this.$router.push({path:`/templatesIndex/${this.childrenRouterMeta[this.$refs['editTemplate'].newType-1]}`});
            }else{
                this.getTemplates();
            };
        },
        //新建或编辑组件的触发
        emitCreateOrEdit(ifCreate,createType){
            this.$refs['editTemplate'].editOrCreateVisible=true;
            this.$nextTick(()=>{
                this.$refs['editTemplate'].isCreate=ifCreate;
            })
            if(createType){
                this.getTemplateCategory(createType);
                this.$refs['editTemplate'].newType=createType;
            }
        },
        //添加模板分类成功
        operateTemplateCategorySuccess(data){
            this.$message.success(data.msg);
            if(!data.ifReload) return;
            this.getTemplateCategory(this.templateType);
        },
    },
    mounted(){
        this.initGetData(this.$router.currentRoute.meta);
    },
    watch:{
        $route:{
            handler(to,from){
                if(to.fullPath!==from.fullPath) {
                    this.initGetData(to.meta);
                }
            },
            deep:true
        },
    }
}
</script>