<template>
    <el-container class="container">
        <el-aside class="left-sider" style="width:166px;">
            <el-dropdown trigger="click" @command="selectNewType">
                <el-button type="primary">{{$t('message.create',{'typeName':''})}}</el-button>
                <el-dropdown-menu slot="dropdown" class="select01">
                    <el-dropdown-item command="folder"><i class="iconfont icon-wenjianjia1"></i>{{$t('message.folder')}}</el-dropdown-item>                   
                    <div>
                        <el-dropdown-item command="importFile" class="import-file" style="border-bottom:1px solid #f3f6fc">
                            <i class="iconfont icon-dr"></i>
                                <el-upload :before-upload="handleUploadChange" ref='uploadComponent'
                                    :action="uploadUrl"
                                    :on-success="handleSuccess"
                                    :show-file-list="false" class="file-upload">
                                <span>{{$t('message.import')}}</span>
                            </el-upload> 
                        </el-dropdown-item>
                        <el-dropdown-item command="document"><i class="iconfont icon-word-s"></i>{{$t('message.doc')}}</el-dropdown-item>
                        <el-dropdown-item command="mindMap"><i class="iconM">M</i>{{$t('message.mindmap')}}</el-dropdown-item>
                        <el-dropdown-item command="ppt" v-show="supportPptExcel"><i class="iconfont icon-ppt1"></i>{{$t('message.ppt')}}</el-dropdown-item>
                        <el-dropdown-item command="excel" v-show="supportPptExcel"><i class="iconfont icon-excel1"></i>{{$t('message.excel')}}</el-dropdown-item>
                    </div>
                </el-dropdown-menu> 
            </el-dropdown>
            <el-menu class="left-sider-menu" :default-active="$route.meta" router v-on:select="handleSelectMenu">
                <el-menu-item index="myDocuments" >
                    <i class="iconfont icon-wenjianjia"></i>{{$t('message.myFiles')}}
                </el-menu-item>
                <el-menu-item index="recentlyOpen">
                    <i class="iconfont icon-history"></i>{{$t('message.recentlyOpened')}}
                </el-menu-item>
                <el-menu-item index="recycleBin">
                    <i class="iconfont icon-huishouzhan"></i>{{$t('message.recycleBin')}}
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main class="main" id="mainCon">
            <router-view ref='documents-router-view'></router-view>
        </el-main>
        <!-- 导入-选择编辑器弹窗 -->
        <el-dialog :title="$t('message.selctEditor')" width="750px" :visible="choseEditorVisible"
                :close-on-click-modal="false" @close="cancelChoseEditor">
            <div class="dialog-con">
                <el-form label-width="100px">
                <el-form-item :label="$t('message.editor')+':'" class="tip-item form-list-required">
                    <el-radio-group v-model="docEditor" @change="selectEditor">
                        <el-radio label="1">{{$t('message.xmlEditor')}}</el-radio>
                        <el-radio label="5">{{$t('message.formatDocEditor')}}</el-radio>
                    </el-radio-group>
                    <p class="color-f0" v-show="docEditor==='5'">{{$t('message.layoutEditorApplyFor2')}}</p>
                    <p class="color-f0" v-show="docEditor==='1'">{{$t('message.xmlEditorApplyFor2')}}</p>
                </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureToChoseEditor">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelChoseEditor">{{$t('message.cancel')}}</el-button>
            </span>
        </el-dialog> 
    </el-container>
</template>
<script>
import{mapState} from 'vuex';

import documentsApi from 'root/api/documentsApi.js';
export default {
    name:'DocumentsIndex',
    data(){
        return {
            uploadUrl:'/creation/fileOperation/upload',
            supportPptExcel:window.supportOnlineEditor,
            uploadFile:{},//本地导入的文件
            importTypeAry: ['doc', 'docx', 'xmind', 'km', 'md', 'mm', 'mmap', 'xls', 'xlsx', 'ppt', 'pptx'],
            choseEditorVisible:false,  //导入文档选择编辑器
            docEditor:'5',
            showHaddleSuccess:true,  //如果导入思维导图，上传成功不需要处理,
            docFileCode:'',   //上传成功后的fileCode
            newMindType:'',
        }
    },
    computed:{
        ...mapState(['loadingHome'])
    },
    methods:{
        handleSelectMenu(index, indexPath){
            if (this.loadingHome) return;
            this.$store.commit('documentsModule/setFolderName',[]);
        },
        //新建类型选择
        selectNewType(command){
            if (command === 'importFile') return;
            let createType=''
            switch (command) {
                case 'folder': 
                    createType = this.$t('message.folder');
                    break;
                case 'mindMap':
                    createType = this.$t('message.mindmap');
                    break;
                case 'document':
                    createType = this.$t('message.doc');
                    break;
                case 'ppt':
                    createType= this.$t('message.ppt');
                    break;
                case 'excel':
                    createType= this.$t('message.excel');
                    break;
            }
            this.$refs['documents-router-view'].emitCreateOrEdit(true,createType);
        },
        //导入本地文件
        handleUploadChange(file, fileList) {
            let filetype = file.name.split('.')[file.name.split('.').length - 1];
            this.uploadFile = file;
            let ary = ['xls', 'xlsx', 'ppt', 'pptx'];
            let mindAry = ['km', 'md', 'mm', 'xmind', 'mmap'];
            if(mindAry.indexOf(filetype)>0) this.showHaddleSuccess=false;
            let pattern = /['|"|<|>|#|%|\\|\/|:|\*|\?|\|]/g;
            if (this.importTypeAry.indexOf(filetype) == -1 || (!this.supportPptExcel && ary.indexOf(filetype)>-1)) {
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
            if(mindAry.indexOf(filetype)>0) this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.uploading')});
            switch (filetype) {
                case 'km':
                    this.newMindType = "json";
                    this.importMindAsync(file);
                    break;
                case 'md':
                    this.newMindType = "markdown";
                    this.importMindAsync(file);
                    break;
                case 'mm':
                    this.newMindType = "freemind";
                    this.importMindAsync(file);
                    break;
                case 'xmind':
                    this.newMindType = "xmind";
                    this.importMindSync({content:file, type:this.newMindType});
                    break;
                case 'mmap':
                    this.newMindType = "mindmanager";
                    this.importMindSync({content:file, type:this.newMindType});
                    break;
                case 'doc':
                case 'docx':
                case 'xls':
                case 'xlsx':
                case 'ppt':
                case 'pptx':
                    break;
            }
        },
        //异步导入
        importMindAsync(file){
            this.$store.dispatch('templatesModule/importAsync',{file, type:this.newMindType}).then((data)=>{
                this.importMind(data);
            });
        },
        //同步导入
        importMindSync(param){
            this.$store.dispatch('templatesModule/importSync',param).then((data)=>{
                this.importMind(data);
            }).catch(error=>{this.$message.error(this.$t('message.requestError'));});
        },
        importMind(data){
            let filetype = this.uploadFile.name.split('.')[this.uploadFile.name.split('.').length - 1],
                name = this.uploadFile.name.substring(0, this.uploadFile.name.indexOf('.' + filetype));
            documentsApi.copyMindRequest({
                folderId:this.$router.currentRoute.query.id||'',
                creationType: 1,
                projectType:2,
                name: name,
                content:data
            }).then((data)=>{
                if(data) this.$refs['documents-router-view'].handdleSuccess({msg:this.$t('message.importSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.showHaddleSuccess=true;});
        },
        //上传pptExcel,docDocx
        handleSuccess(response, file, fileList) {
            if(!this.showHaddleSuccess) return;
            let ary = ['xls', 'xlsx', 'ppt', 'pptx'];
            let filetype = file.name.split('.')[file.name.split('.').length - 1],
            name = file.name.substring(0, file.name.indexOf('.' + filetype));
            if (response.success ) {
                if (ary.indexOf(filetype) !== -1) {
                    this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.uploading')});
                    let param ={
                        fileExt: filetype,
                        sourceType: 4,
                        sourceId: response.content,
                        fileCode: response.content,
                        folderId:this.$router.currentRoute.query.id || '',
                        creationType: 1,
                        projectType:(filetype==='ppt'||filetype==='pptx')?3:4,
                        currentUserId:window.currentUser.id,
                        chargeManId:window.currentUser.id,
                        name
                    }
                    this.importDocuments(param);
                } else if (filetype == 'doc' || filetype == 'docx') {
                    this.choseEditorVisible=true;
                    this.docFileCode=response.content; 
                }
            }
        },
        importDocuments(param){
            documentsApi.useTemAddOnlineOfficeRequest(param).then((data)=>{
                if(data) this.$refs['documents-router-view'].handdleSuccess({msg:this.$t('message.importSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.cancelChoseEditor();})
        },
        //取消选择编辑器
        cancelChoseEditor(){
            this.docEditor='5';
            this.choseEditorVisible=false;
            this.showHaddleSuccess=true;
        },
        //上传文档选择编辑器
        selectEditor(value){
            this.docEditor=value;
        },
        sureToChoseEditor(){
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.uploading')});
            let param={};
            let filetype = this.uploadFile.name.split('.')[this.uploadFile.name.split('.').length - 1],
                    name = this.uploadFile.name.substring(0, this.uploadFile.name.indexOf('.' + filetype));
           
            if(this.docEditor==='1'){
                this.convertFile();
            }else{
                this.importDocuments({
                    sourceType:4,
                    sourceId:this.docFileCode,
                    folderId:this.$router.currentRoute.query.id || '',
                    fileCode:this.docFileCode,
                    creationType: 1,
                    projectType:5,
                    currentUserId:window.currentUser.id,
                    chargeManId:window.currentUser.id,
                    name: name,
                });
            }
        },
        //导入word类型转换
        convertFile(){
            documentsApi.convertFileRequest({
                fileCode: this.docFileCode, 
                desFileType:'.xml'
            }).then((data)=>{
                if(data) this.checkConvertState({convertTaskId: data});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //查询转换状态
        checkConvertState(param){
            documentsApi.checkConvertStateRequest(param).then((data)=>{
                if(data==4){
                    let filetype = this.uploadFile.name.split('.')[this.uploadFile.name.split('.').length - 1];
                    this.importDocuments({
                        sourceType:4,
                        sourceId:this.docFileCode,
                        folderId:this.$router.currentRoute.query.id || '',
                        fileCode:this.docFileCode,
                        creationType: 1,
                        projectType:1,
                        currentUserId:window.currentUser.id,
                        chargeManId:window.currentUser.id,
                        name: this.uploadFile.name.substring(0, this.uploadFile.name.indexOf('.' + filetype))
                    });
                }else if(data<0){
                    this.$message.error(this.$t('message.TransferFail'));
                }else{
                    setTimeout(()=>{
                        this.checkConvertState(param);
                    }, 3000);
                }
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
    }
}
</script>