<template>
    <el-container>
        <el-header class="header-top">
            <p class="float-r color-9 ht-search ">
                <el-tooltip placement="right">
                    <div slot="content" class="tip-content">
                        <p>{{$t('message.supportImportType')}}</p>
                    </div>
                    <i class="iconfont icon-iconfonticonfonticon4"></i>
                </el-tooltip>
                <el-upload ref='uploadComponent' class='import-knowledge'
                    accept=".doc,.docx,.pdf,.caj,.png,.jpg,.jpeg,.gif,.bmp"
                    :before-upload="handleUploadChange" 
                    :action="uploadUrl"
                    :on-success="handleUploadSuccess"
                    :show-file-list="false">
                    <el-button type="primary">导入知识</el-button>
                </el-upload> 
                <span class="posr search-knowledge"> 
                    <input type="text" name="" class="ht-input" v-model.trim="searchKey" @keypress.enter="getKnowledgeDocuments"/>
                    <i class="iconfont icon-sousuo posa" @click="getKnowledgeDocuments"></i>
                </span>
            </p>
        </el-header>
        <div class="main-panel main-panel02">
             <div class="table-parent">
                <ul>
                    <li class="knowledge-item" v-for="(knowledgeFile,index) in fileList" :key="index">
                        <p class="knowledge-item-title" @mouseenter="computeTitle(knowledgeFile,false)">
                            <i class="iconM knowledge-title-icon">M</i>
                            <span class="knowledge-title"  @click="clickFileName(knowledgeFile)"><span :id=knowledgeFile.id>{{knowledgeFile.name}}</span></span>
                        </p>
                        <p class="knowledge-abstract" @mouseenter="computeTitle(knowledgeFile,true)">
                            <span>
                                <span :id="`${knowledgeFile.id}-abstract`">
                                    来不及再轰轰烈烈，就保留告别的尊严，<span class="searched-font">分手</span>应该体面，谁都不要说抱歉，何来亏欠，镜头前面是从前的我们，爱的热烈，认真付出的画面来不及再轰轰烈烈，就保留告别的尊严，<span class="searched-font">分手</span>应该体面，谁都不要说抱歉，何来亏欠，镜头前面是从前的我们，爱的热烈，认真付出的画面
                                    来不及再轰轰烈烈，就保留告别的尊严，<span class="searched-font">分手</span>应该体面，谁都不要说抱歉，何来亏欠，镜头前面是从前的我们，爱的热烈，认真付出的画面来不及再轰轰烈烈，就保留告别的尊严，<span class="searched-font">分手</span>应该体面，谁都不要说抱歉，何来亏欠，镜头前面是从前的我们，爱的热烈，认真付出的画面
                                    来不及再轰轰烈烈，就保留告别的尊严，<span class="searched-font">分手</span>应该体面，谁都不要说抱歉，何来亏欠，镜头前面是从前的我们，爱的热烈，认真付出的画面来不及再轰轰烈烈，就保留告别的尊严，<span class="searched-font">分手</span>应该体面，谁都不要说抱歉，何来亏欠，镜头前面是从前的我们，爱的热烈，认真付出的画面
                                </span>
                                
                            </span>
                        </p>
                        <p class="posr">
                            <span>
                                <img :src="currentUser.logo" alt="" class="header-img">
                                {{currentUser.realName}}
                            </span>
                            <span class="knowledge-time">2020/06/30 09:21</span>
                            <span class="tabcon-item-poper posa">
                                <i class="iconfont icon-bianji color-9 mr05" :title="$t('message.edit',{'typeName':''})"  @click="emitCreateOrEdit(knowledgeFile)"></i>
                                <i class="iconfont icon-huishouzhan color-9 mr05" :title="$t('message.delete',{'deleteType':''})" @click="deleteKnowledgeFile(knowledgeFile)"></i>
                            </span>
                        </p>        
                    </li>
                </ul>
             </div>
        </div>
        <EditKnowledgeDocument ref="editKnowledge" :curOperateFile="curOperateFile" @handdleSuccess="handdleSuccess"/>
    </el-container>
</template>
<script>
import knowledgeLibraryApi from 'root/api/knowledgeLibraryApi.js';
import documentsApi from 'root/api/documentsApi.js';
import {mapState} from 'vuex';
import validateWords from 'root/utils/validateWords';
import EditKnowledgeDocument from 'root/components/knowledgeLibrary/EditKnowledgeDocument';
export default {
    name:'KnowledgeDocuments',
    mixins: [validateWords],
    components:{EditKnowledgeDocument},
    data(){
        return {
            currentUser:window.currentUser,  //当前登录用户
            searchKey:'',
            fileList:[],
            emptyData:'',
            curOperateFile:{},//当前操作文档,
            importTypeAry:['doc','docx','pdf','caj','png','jpg','jpeg','gif','bmp'],
            uploadUrl:'/creation/fileOperation/upload',
            uploadFile:{}
        }
    },
    computed:{
        ...mapState('documentsModule',['highlightFirst']),
       
    },
    methods:{
        //显示时间截取  2019/05/15 08:42:49
        computeTime(time){
            var date=time.split(' ')[0];
            var hourAndMinite=time.split(' ')[1].split(':')[0]+':'+time.split(' ')[1].split(':')[1];
            return date+' '+hourAndMinite;
        },
        //计算文件类型的class
        computeFileTypeClass(scope){
            let classStr='';
            if(scope.folder){
                classStr= 'icon-wenjianjia1';
            }else{
                switch(scope.projectType){
                    case 1:
                        classStr=this.$store.state.topType.indexOf('cooperative')!==-1?'icon-word-s fw':'icon-word-s';
                        break;
                    case 2:
                        'iconM';
                        break;
                    case 3:
                        classStr='icon-ppt1';
                        break;
                    case 4:
                        classStr='icon-excel1';
                        break;
                    case 5:
                        classStr='icon-word-s';
                        break;
                }
            }
            return classStr;
        },
        //计算是否显示title
        computeTitle (file,flag) {
            if(flag){
                if ($(`#${file.id}-abstract`).width() >=$(`#${file.id}-abstract`).parent().width()){
                    $(`#${file.id}-abstract`).attr("title", file.name);
                }
            }else{
                if ($(`#${file.id}`).width() >=$(`#${file.id}`).parent().width()-30){
                    $(`#${file.id}`).attr("title", file.name);
                }
            }
            
        },
        //获取知识库列表
        getKnowledgeDocuments(){
            if(this.searchKey&&!this.validateSearchKey(this.searchKey)) return;
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
            knowledgeLibraryApi.getKnowledgeDocumentsRequest({}).then((data)=>{
                this.haddleData({data:[...data],orderBy:'updateTime'});
            }).finally(()=>{this.$store.commit('changeLoading',{loading:false,loadingTxt:''});})
        },
        //点击文件名称
        clickFileName(row){
            window.open(window.applicationPath+'/project/detail?id='+row.id);
        },
        //新建或编辑组件的触发
        emitCreateOrEdit(curFile){
            this.$refs['editKnowledge'].editFileVisible=true;
            this.curOperateFile=curFile;
        },
        //删除知识
        deleteKnowledgeFile(curFile){
            this.curOperateFile=curFile;
            this.$confirm(this.$t('message.sureToDelete'), this.$t('message.delete',{'deleteType':''}), {
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                confirmButtonClass: 'confirm-btn',
                cancelButtonClass: 'cancel-btn',
                type: 'warning'
            }).then(()=>{
                this.submitDeleteKnowledgeFile(curFile);
            })
        },
        //确定删除知识
        submitDeleteKnowledgeFile(file){
            knowledgeLibraryApi.deleteKnowledgeFileRequest({projectId:file.id}).then((data)=>{
                if(data) this.handdleSuccess({msg:this.$t('message.delSuccess'),highlightType:'file',ifReload:false});
                this.fileList=this.fileList.filter((item)=>{
                    return item.id!==file.id;
                })
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        handdleSuccess(data){
            this.$message.success(data.msg);
            this.$store.commit('documentsModule/setHighlightFirst',data.highlightType);
            if(!data.ifReload) return;
            this.getKnowledgeDocuments();
        },
        //导入本地文件
        handleUploadChange(file, fileList) {
            let filetype = file.name.split('.')[file.name.split('.').length - 1];
            this.uploadFile = file;
            let pattern = /['|"|<|>|#|%|\\|\/|:|\*|\?|\|]/g;
            if (this.importTypeAry.indexOf(filetype) == -1) {
                this.$message.warning(this.$t('message.notSupport'));
                return false;
            }
            if (file.size == 0) {
                this.$message.warnind(this.$t('message.emptyDoc'));
                return false;
            }
            if (pattern.test(name)) {
                this.$message.warning(this.$t('message.specialCharName'));
                return false;
            }
        },
        handleUploadSuccess(response, file, fileList) {
            let filetype = file.name.split('.')[file.name.split('.').length - 1],
            name = file.name.substring(0, file.name.indexOf('.' + filetype));
            if (response.success ) {
                this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.uploading')});
                let param ={
                    fileExt: filetype,
                    sourceType: 4,
                    sourceId: response.content,
                    fileCode: response.content,
                    folderId: '',
                    creationType: 1,
                    projectType:3,
                    currentUserId:window.currentUser.id,
                    chargeManId:window.currentUser.id,
                    name
                }
                this.importKnowledgeDoc(param);
                // if (filetype == 'doc' || filetype == 'docx'){
                //     this.importKnowledgeDoc(param);
                // }else{
                //     this.importKnowledgeOther(param);
                // }
                
            }
        },
        //导入知识
        importKnowledgeDoc(param){
            documentsApi.useTemAddOnlineOfficeRequest(param).then((data)=>{
                if(data) this.handdleSuccess({msg:this.$t('message.importSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{})
        },
        //导入其他知识
        importKnowledgeOther(param){

        }
    },
    mounted(){
        this.getKnowledgeDocuments();
    },
    watch:{
        $route:{
            handler(to,from){
                if(to.fullPath!==from.fullPath) {
                    this.searchKey='';
                    this.getKnowledgeDocuments();
                }
            },
            deep:true
        },
    }
}
</script>