<template>
    <div>
        <el-dialog  :title="dialogTitle"
                    :visible="createEditVisible"  
                    :close-on-click-modal="false"
                    @close="cancelCreateEdit('createEditForm')" class="dialog2">
            <div class="dialog-con">
                <el-form label-width="100px" :rules="rules" ref="createEditForm" :model="createEditForm" @submit="stopSubmit">
                    <el-form-item :label="$t('message.name')+'：'" prop="formName" class="el-item-mb0 form-list-required">
                        <el-input :placeholder="$t('message.enterNameTip')"
                                    v-model="createEditForm.formName"
                                    name="formName"
                                    v-focus="showFocus"
                                    @keypress.enter.native="submitCreateEdit('createEditForm')"></el-input>
                        <input type="text" style="display:none" />
                    </el-form-item>
                    <el-form-item :label="$t('message.editor')+'：'" prop="editor" class="tip-item form-list-required" v-show="isCreate&&newTypeName==$t('message.doc')">
                        <el-radio-group v-model="createEditForm.editor"  @change="selectEditor">
                            <el-radio label="1">{{$t('message.xmlEditor')}}</el-radio>
                            <el-radio label="5">{{$t('message.formatDocEditor')}}</el-radio>
                        </el-radio-group>
                        <p class="color-f0" v-show="createEditForm.editor==='1'">{{$t('message.xmlEditorApplyFor1')}}</p>
                        <p class="color-f0" v-show="createEditForm.editor==='5'">{{$t('message.layoutEditorApplyFor1')}}</p>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitCreateEdit('createEditForm')">{{computeBtnType()}}</el-button>
                <el-button @click="cancelCreateEdit('createEditForm')">{{$t('message.cancel')}}</el-button>
            </div>
        </el-dialog>
        <!-- 新建创作选择模板 -->
        <el-dialog :title="$t('message.chooseTemplateToCreate',{'templateType':templeteTypeName})" width=65% :visible="chooseTemVisible"  @close="cancelChooseTem" class="dialog3">
            <div class="tem-con">
                <div class="tc-l">
                    <el-scrollbar>
                        <ul>
                            <li class="tcl-item" 
                            v-for="(temType,index) in templateTypes.concat(templateCategory)" :key="index"
                            :class="{'cur':activeName==temType.id}" @click="selectTemplateType(temType.id)">{{temType.name}}</li>
                        </ul>
                    </el-scrollbar>
                </div>
                <div class="tc-r">
                    <el-input  :placeholder="$t('message.search')" v-model.trim="searchKey" @keyup.enter.native="searchTemplates">
                        <svg class="icon icon-search" aria-hidden="true" slot="suffix" @click="searchTemplates">
                            <use xlink:href="#icon-search"></use>
                        </svg>
                    </el-input>
                    <div class="temc-panel">
                        <el-scrollbar @scroll="LoadMoreTemplates($event)">
                            <div class="tem-list2" id="templatesDiv">
                                <div class="clearfix templatelist">
                                    <a href="javascript:;" class="create-item citemt" @click="readTemplateContent('blank')">
                                        <svg aria-hidden="true" class="icon">
                                            <use xlink:href="#icon-addTh"></use>
                                        </svg>
                                        <span>{{$t('message.blankTemplate')}}</span>
                                    </a>
                                    <a href="javascript:;" class="create-item citemb" v-for="(template,index) in templates" :key="index"
                                    @click="readTemplateContent(template)">
                                        <img :src="computeCoverSrc(template.fileCodeCover)"/>
                                        <span>{{template.templateName}}</span>
                                    </a>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </div>
        </el-dialog>
        <ReadTemplateCon :curTemplate='curTemplate' v-if="readTemplateContentFlag"
            @changeReadFlag="changeReadFlag" :createDocuments="createDocuments" :documentName="createEditForm.formName" 
            :documentType="createEditForm.editor" @createUseTemplate="createUseTemplate"/>
    </div>
</template>
<script>
import ReadTemplateCon from 'root/components/templates/ReadTemplateCon'
import documentsApi from 'root/api/documentsApi.js';
import templateApi from 'root/api/templateApi';
import docLibraryApi from 'root/api/docLibraryApi';
import knowledgeLibraryApi from 'root/api/knowledgeLibraryApi.js';
import {mapState} from 'vuex';
import validateWords from 'root/utils/validateWords';
import validateFormRule from 'root/utils/validateFormRule';
export default {
    name:'CreateOrEditFolderAndFile',
    components:{ReadTemplateCon},
    props:['curOperateFile'],
    mixins: [validateWords,validateFormRule],
    data(){
        return {
            createEditVisible: false,
            isCreate:true,//表示弹框用于新建还是编辑
            showFocus: false,   //表单聚焦指令
            newTypeName: '',   //新建的类型
            createEditForm: {
                formName: '',
                editor:'1'
            },
            rules: {
                formName: [
                    { validator: this.invalidCharacter, trigger: 'change' }
                ]
            },
            //选择模板弹框
            templeteTypeName:'',//模板类型
            templeteType:1,//模板分类的类型
            chooseTemVisible:false,
            activeName:'4', //模板的类型  最近使用4，个人0，机构1, 
            templateTypes:[{id:'4',name:this.$t('message.recentlyUsed')},{id:'0',name:this.$t('message.personalTemplate')}], //{id:'1',name:this.$t('message.publicTemplate')}
            searchKey:'',//检索模板
            pageIndex:1,
            defaultCover:require('root/assets/images/temImg2.jpg'),
            scrollFlag:true,
            curTemplate:{},
            createDocuments:false,//传给阅读模板组件，表示是新建创作选择模板还是在模板列表选择模板
            readTemplateContentFlag:false,//阅读模板
        }
    },
    computed:{
        ...mapState('templatesModule',['templateCategory','templates','templatesCount']),
        //新建或编辑的dialog弹框名称
        dialogTitle(){
            if(!this.isCreate) return this.$t('message.rename');
            return this.$t('message.create',{'typeName':this.newTypeName.toLowerCase()});
        }
    },
    directives: {
        focus: {
            update(el,{value}) {
                if(value) $(el).find('input').focus();
            }
        }
    },
    methods: {
        stopSubmit (e) {
            if (e.keyCode === 13 || !e) return false;
        },
        //判断按钮显示确定还是下一步
        computeBtnType(){
            if(this.newTypeName==this.$t('message.docClassify')||this.newTypeName==this.$t('message.knowledgeClassify')) return this.$t('message.sure');
            else if(this.newTypeName==this.$t('message.folder')||!this.isCreate) return this.$t('message.sure');
            else return this.$t('message.next');
        },
        //新建或编辑-取消
        cancelCreateEdit (formName) {
            this.$refs[formName].resetFields();
            this.$refs[formName].clearValidate();
            this.$nextTick(()=>{
                this.initData();
            })
        },
        //弹框关闭，初始化数据
        initData(){
            this.createEditVisible = false;
            this.isCreate=true;
            this.newTypeName='';
        },
        //新建或编辑-确定
        submitCreateEdit (formName) {
            this.$refs[formName].validate((valid)=>{
                if (valid) {
                    this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
                    if(!this.isCreate){
                        this.submitEdit();
                        
                    }else{
                        this.submitCreateNew();
                    }
                } else {
                    return false;
                }
            });
        },
        //确定编辑
        submitEdit(){
            switch(this.newTypeName){
                case this.$t('message.docClassify'):
                    this.submitEditDocClassify();
                    break;
                case this.$t('message.knowledgeClassify'):
                    this.submitEditKnowledgeClassify();
                    break;
                default:
                    this.curOperateFile.folder?this.submitRenameFolder():this.submitRenameFile();
                    break;
            }
        },
        //重命名文件夹
        submitRenameFolder(){
            documentsApi.reNameFolderRequest({
                id:this.curOperateFile.id,
                name:this.createEditForm.formName.trim(),
                parentId:this.$route.query.id
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.renameSuccess'),highlightType:'folder',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.createEditVisible=false;});
        },
        //重命名文件
        submitRenameFile(){
            documentsApi.reNameFileRequest({
                projectId: this.curOperateFile.id,
                name: this.createEditForm.formName.trim()
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.renameSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.createEditVisible=false;});
        },
        //重命名文档库文档分类
        submitEditDocClassify(){
            docLibraryApi.editDocumentClassifyRequest({
                id: this.curOperateFile.id,
                name: this.createEditForm.formName.trim()
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.renameSuccess'),ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.createEditVisible=false;});
        },
        //重命名知识库知识分类
        submitEditKnowledgeClassify(){
            knowledgeLibraryApi.editKnowledgeClassifyRequest({
                id: this.curOperateFile.id,
                name: this.createEditForm.formName.trim()
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.renameSuccess'),ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.createEditVisible=false;});
        },
        //确认新建
        submitCreateNew () {
            switch(this.newTypeName){
                case this.$t('message.docClassify'):
                    this.submitAddDocClassify();
                    break;
                case this.$t('message.knowledgeClassify'):
                    this.submitAddKnowledgeClassify();
                    break;
                case this.$t('message.folder'):
                    this.createFolder();
                    break;
                case this.$t('message.mindmap'):
                case this.$t('message.ppt'):
                case this.$t('message.excel'):
                case this.$t('message.doc'):
                    this.createOther();
                    break;
            }
        },
        //新建文件夹
        createFolder(){
            documentsApi.createFolderRequest({
                name: this.createEditForm.formName,
                parentId: this.$router.currentRoute.query.id || '',
                creationType: 1
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.newSuccess'),highlightType:'folder',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.createEditVisible=false;});
        },
        //新建文档。ppt excel mindMap
        createOther(){
            this.getTemplateCategory();
            this.getTemplates();
            this.chooseTemVisible=true;
        },
        //选择编辑器
        selectEditor(value){
            this.createEditForm.editor = value;
        },
        //新建创作选择模板的模板类型
        computeTemType(){
            switch (this.newTypeName) {
                case this.$t('message.mindmap'):
                    this.templeteTypeName = this.$t('message.mindmapTemplate').toLowerCase();
                    this.templeteType=2;
                    break;
                case this.$t('message.ppt'):
                    this.templeteTypeName = this.$t('message.pptTemplate').toLowerCase();
                    this.templeteType=3;
                    break;
                case this.$t('message.excel'):
                    this.templeteTypeName = this.$t('message.excelTemplete').toLowerCase();
                    this.templeteType=4;
                    break;
                case this.$t('message.doc'):
                    this.templeteTypeName = this.$t('message.docTemplate').toLowerCase();
                    this.templeteType=1;
                    break;
            }
        },
        //取消选择模板
        cancelChooseTem(){
            this.searchKey='';
            this.activeName='4';
            this.pageIndex = 1;
            this.$store.commit('templatesModule/clearTemplates',{list:[],total:0});
            this.chooseTemVisible=false;
        },
        //获取模板分类
        getTemplateCategory(){
            templateApi.getTemplateCategoryRequest({
                belongType:window.cloudModel?1:0,
                templateType:this.templeteType,
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
                type: Number(this.activeName)<6?Number(this.activeName):'',
                categoryId:Number(this.activeName)<6?'':this.activeName,
                key: this.searchKey,
                templateType:this.templeteType,
            }).then((data)=>{
                this.$store.commit('templatesModule/setTemplates',data);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //检索模板
        searchTemplates(){
            if(!this.validateSearchKey(this.searchKey)) return;
            this.$store.commit('templatesModule/clearTemplates',{list:[],total:0});
            this.getTemplates();
        },
        //选择模板类型
        selectTemplateType(tabIndex){
            this.$store.commit('templatesModule/clearTemplates',{list:[],total:0});
            this.pageIndex = 1;
            this.activeName=tabIndex;
            this.getTemplates();
        },
        //模板封面
        computeCoverSrc(fileCodeCover) {
            if (fileCodeCover) {
                return `${window.applicationPath}/fileOperation/download?fileCode=${fileCodeCover}&fileName=111`;
            } 
            return this.defaultCover;
        },
        //加载更多模板
        LoadMoreTemplates (e) {
            if (this.templates.length>= this.templatesCount) return;
            e = e || window.event;
            if (e.wheelDelta || e.detail) {  //判断浏览器ie，谷歌滑轮事件   
                if (e.wheelDelta < 0 || e.detail > 0) { //当滑轮向下滚动时 
                    if (this.scrollFlag) {
                        this.scrollFlag = false;
                        setTimeout(()=>{
                            if ($('#templatesDiv').scrollTop() + $('#templatesDiv').height() >= $('div.templatelist').height()) {
                                this.pageIndex = this.pageIndex + 1;
                                self.getTemplates();
                            }
                            this.scrollFlag = true;
                        }, 1000);
                    }
                }
            }
        },
        //点击封面，阅读模板没内容
        readTemplateContent(template) {
            if(template=='blank'){
                this.$confirm(this.$t('message.sureUseBlankTem'), this.$t('message.tip'), {
                    confirmButtonText: this.$t('message.sure'),
                    confirmButtonClass: 'confirm-btn',
                    cancelButtonText: this.$t('message.cancel'),
                    cancelButtonClass: 'cancel-btn',
                    type: 'warning'
                }).then(()=>{
                    this.createUseBlankTemplate();
                }).catch(()=>{
                    return;
                });
            }else{
                this.$store.commit('templatesModule/setCurTemplate',template);
                this.curTemplate = template;
                this.$store.dispatch('templatesModule/getTemplateInfo',{templateId: template.id}).catch(()=>{
                    this.$message.error(this.$t('message.requestError'));
                });
                this.createDocuments=true;
                this.readTemplateContentFlag = true;
            }
        },
        //使用空白模板新建
        createUseBlankTemplate(){
            documentsApi.useTemAddOnlineOfficeRequest({
                sourceType: 1,
                sourceId:'',
                folderId:this.$router.currentRoute.query.id,
                fileCode:'',
                creationType: 1,
                projectType:this.templeteType==1?Number(this.createEditForm.editor):this.templeteType,
                currentUserId:window.currentUser.id,
                chargeManId:window.currentUser.id,
                name: this.createEditForm.formName,
                templateId:''
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.newSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{
                this.cancelChooseTem();
                this.initData();
            });
        },
        //关闭阅读状态
        changeReadFlag(flag){
            //{closeFlag:false,createdFlag:true}
            this.readTemplateContentFlag = flag.closeFlag;
            if(flag.createdFlag){
                this.$emit('handdleSuccess',{msg:this.$t('message.newSuccess'),highlightType:'file',ifReload:true});
                this.cancelChooseTem();
                this.initData();
            } 
        },
        //使用模板新建创作
        createUseTemplate(param){
            documentsApi.useTemAddOnlineOfficeRequest(param).then((data)=>{
                if(data) this.changeReadFlag({closeFlag:false,createdFlag:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //新建文档分类
        submitAddDocClassify(){
            docLibraryApi.addDocClassifyRequest({
                name: this.createEditForm.formName.trim()
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.newSuccess'),ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.createEditVisible=false;});
        },
        //新建知识分类
        submitAddKnowledgeClassify(){
            knowledgeLibraryApi.addKnowledgeClassifyRequest({
                name: this.createEditForm.formName.trim()
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.newSuccess'),ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.createEditVisible=false;});
        }
    },
    watch:{
        createEditVisible(val){
            if(val){
                this.$nextTick(()=>{
                     if(!this.isCreate){
                        this.createEditForm.formName=this.curOperateFile.name;
                    }
                    this.computeTemType();
                    this.showFocus=true;
                })
            }
        }
    }
}
</script>

