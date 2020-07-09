<template>
    <el-container>
        <el-header class="header-top">
            <el-breadcrumb separator-class="el-icon-arrow-right" class="float-l">
                <el-breadcrumb-item :to="{path:breadcrumbPath}"><span @click="clearSessionFolder">{{breadcrumb}}</span></el-breadcrumb-item>
                <el-breadcrumb-item v-for="(folderName,index) in folderNames" :key="index" 
                                    :to="computePath(folderName)"
                                    :title="folderName.name">
                    <span @click='goIntoFolder(folderName,index)'>{{folderName.name}}</span>
                </el-breadcrumb-item>
            </el-breadcrumb> 
            <p class="float-r color-9 ht-search posr" v-show="breadcrumb!==$t('message.recentlyOpened')">
                <el-select v-model="searchType" class="select-doc">
                    <el-option label="全部" value="1"></el-option>
                    <el-option label="我负责的" value="2"></el-option>
                    <el-option label="我参与的" value="3"></el-option>
                </el-select>
                <input type="text" name="" class="ht-input" v-model.trim="searchKey" @keypress.enter="getDocuments"/>
                <i class="iconfont icon-sousuo posa" @click="getDocuments"></i>
            </p>
        </el-header>
        <div class="main-panel main-panel02">
            <div class="table-parent">
                <el-table :data="fileList" ref="fileTable" class="table-first" style="width: 100%" :highlight-current-row="true" 
                        @row-click="haddleClickRow" @cell-mouse-enter="computeTitle">
                    <template slot="empty">
                        <div>{{emptyData}}</div>
                    </template>
                    <el-table-column prop="name" :label="$t('message.name')">
                        <template slot-scope="scope">
                                <i class="iconM" v-if='scope.row.projectType===2'>M</i>
                                <svg class="icon icon-fxml" aria-hidden="true" v-else-if='scope.row.projectType===1||scope.row.projectType===5'>
                                    <use :xlink:href="scope.row.projectType===1?'#icon-xml':'#icon-Format'"></use>
                                </svg> 
                                <i class="iconfont" :class="computeFileTypeClass(scope.row)" v-else></i>
                                <span :id="scope.row.id" @click="clickFileName(scope.row)">{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="chargeMan" :label="$t('message.director')" width="200">
                        <template slot-scope="scope">
                            <img :src="scope.row.folder?currentUser.logo:scope.row.chargeMan.logo" class="header-img" />
                            <span>{{scope.row.folder?currentUser.realName:scope.row.chargeMan.realName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" :label="tableHeadTime" width="150">
                        <template slot-scope="scope">
                            <span v-if="breadcrumb!=$t('message.recentlyOpened')">{{computeTime(scope.row.updateTime||scope.row.createTime)}}</span>
                            <span v-else>{{computeTime(scope.row.openTime||scope.row.updateTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.operate')" width="150" v-if="breadcrumb==$t('message.myFiles')">
                        <template slot-scope="scope">
                            <el-dropdown trigger="click" @command="operate">
                                <el-button class="edit" @click="handleOperate(scope.row)"><img src="../../assets/images/moreImg.png"></el-button>
                                <el-dropdown-menu slot="dropdown" class="select02">
                                    <el-dropdown-item command="collaborate" v-if="!scope.row.folder"> 
                                        <i class="iconfont icon-xz"></i>{{$t('message.collaborate')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="changeLeader" v-if="!scope.row.folder&&scope.row.hasAuthority&&scope.row.partManCount!==0"> 
                                        <i class="iconfont icon-jjrw color-9 ml10"></i>{{$t('message.leaderTransfer')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="move">
                                        <i class="iconfont icon-yidong"></i>{{$t('message.move')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="copy" v-if="!scope.row.folder">
                                        <i class="iconfont icon-copy"></i>{{$t('message.copy')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="download" class="posr drop-posr" v-if="!scope.row.folder">
                                        <i class="iconfont icon-xiazai1"></i>{{$t('message.download')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="rename" v-if="isDisplay(scope.row)">
                                        <i class="iconfont icon-bianji"></i>{{$t('message.rename')}}
                                    </el-dropdown-item>
                                     <el-dropdown-item command="delete" v-if="isDisplay(scope.row)"> 
                                        <i class="iconfont icon-huishouzhan"></i>{{$t('message.delete',{'deleteType':''})}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="saveAsTemplate" v-if="!scope.row.folder">
                                        <i class="iconfont icon-temM ml03"></i>{{$t('message.saveAs')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="saveAsTemplate" v-if="!scope.row.folder">
                                        <i class="iconfont icon-temM ml03"></i>归档
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.operate')" width="150" v-if="breadcrumb==$t('message.recentlyOpened')">
                        <template slot-scope="scope">
                            <el-dropdown trigger="click" @command="operate" v-if="isDisplay(scope.row)">
                                <el-button class="edit" @click="handleOperate(scope.row)"><img src="../../assets/images/moreImg.png"></el-button>
                                <el-dropdown-menu slot="dropdown" class="select02">
                                    <el-dropdown-item command="rename"> 
                                        <i class="iconfont icon-bianji"></i>{{$t('message.rename')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="delete">
                                        <i class="iconfont icon-huishouzhan"></i>{{$t('message.delete',{'deleteType':''})}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.operate')" width="150" v-if="breadcrumb==$t('message.recycleBin')">
                        <template slot-scope="scope">
                            <i class="iconfont icon-chexiao edit-btn01" :title="$t('message.restore')" @click="completeDeleteOrRestore(scope.row,true)"></i>
                            <i class="iconfont icon-huishouzhan edit-btn" :title="$t('message.deletePermanently')" @click="completeDeleteOrRestore(scope.row,false)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <CreateOrEditFolderAndFile ref='createEdit' :curOperateFile="curOperateFile" @handdleSuccess="handdleSuccess"/>
        <MoveToDialog ref='moveToDialog' :curOperateFile="curOperateFile" @handdleSuccess="handdleSuccess"/>
        <SaveAsTemplate ref="saveAsTemplate" :curOperateFile="curOperateFile" @handdleSuccess="handdleSuccess"/>
        <CollaborateOrChangeLeader ref='collaborateOrChangeLeader' :curOperateFile="curOperateFile" @handdleSuccess="handdleSuccess" v-if="hasLoadMembers"/>
    </el-container>
</template>
<script>
import documentsApi from 'root/api/documentsApi.js';
import {mapState} from 'vuex';
import validateWords from 'root/utils/validateWords';

import CreateOrEditFolderAndFile from './CreateOrEditFolderAndFile';
import MoveToDialog from './MoveToDialog';
import SaveAsTemplate from './SaveAsTemplate';
import CollaborateOrChangeLeader from './CollaborateOrChangeLeader';
export default {
    name:'MyDocuments',
    components:{CreateOrEditFolderAndFile,MoveToDialog,SaveAsTemplate,CollaborateOrChangeLeader},
    mixins: [validateWords],
    data(){
        return {
            currentUser:window.currentUser,  //当前登录用户
            breadcrumb:'',   //一级面包屑名称
            breadcrumbPath:'',  //面包屑路由
            searchType:"1",
            searchKey:'',
            fileList:[],
            emptyData:'',
            curOperateFile:{},//当前操作文档
            isCollaborate:true,
            downloadFileCode:'',//下载转换码,
            ifRestoreFromRecycleBin:true,  //从回收站还原或删除标志
            hasLoadMembers:false,//协作或者负责人权限转交，请求回成员信息后再展示相应组件
        }
    },
    computed:{
        ...mapState('documentsModule',['highlightFirst','folderNames']),
        tableHeadTime(){
            let timeTypeStr='';
            this.breadcrumb = '';
            this.breadcrumbPath='';
            switch (this.$route.meta) {
                case 'myDocuments':
                    timeTypeStr = this.$t('message.modifiedTime');
                    this.breadcrumb = this.$t('message.myFiles');
                    this.breadcrumbPath ='/documentsIndex/myDocuments';
                    break;
                case 'recentlyOpen':
                    timeTypeStr = this.$t('message.openedTime');
                    this.breadcrumb = this.$t('message.recentlyOpened');
                    this.breadcrumbPath ='/documentsIndex/recentlyOpen';
                    break;
                case 'recycleBin':
                    timeTypeStr = this.$t('message.deletedTime');
                    this.breadcrumb = this.$t('message.recycleBin');
                    this.breadcrumbPath = '/documentsIndex/recycleBin';
                    break;
            }
            return timeTypeStr;
        }
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
        //点击表格某一行
        haddleClickRow(row, event, column) {
            this.$refs.fileTable.setCurrentRow(row);
        },
        //计算是否显示title
        computeTitle (row, column, cell) {
            if (column.property == 'name') {
                if (!$('#' + row.id).length) return;
                if ($('#' + row.id).width() >= $('#' + row.id).parent().width()) {
                    $('#' + row.id).attr('title', row.name)
                } else {
                    $('#' + row.id).attr('title') && $('#' + row.id).attr('title').length ? $('#' + row.id).attr('title', '') : null
                }
            }
        },
        //判断操作按钮是否显示
        isDisplay (scope) {
            if(scope.creationType==2) return scope.folder||true;
            return scope.folder ||(scope.chargeMan ? scope.chargeMan.userId ==this.currentUser.id : true)
        },
        //面包屑跳转路径
        //{name:(topType=='cooperative'?'myFiles':'myPersonalFiles'),query:{id:folderName.id}}
        computePath(folder){
            return {meta:'myDocuments',query:{id:folder.id}}
        },
        //获取文件列表
        getDocuments(){
            if(this.searchKey&&!this.validateSearchKey(this.searchKey)) return;
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
            let param={};
            switch(this.$route.meta){
                case 'myDocuments':
                    this.getMyDocuments();
                    break;
                case 'recentlyOpen':
                    this.getRecentlyOpen();
                    break;
                case 'recycleBin':
                    this.getRecycleBin();
                    break;
            }
        },
        //获取我的文件
        getMyDocuments(){
            let param={};
            if(this.searchKey){
                param={searchKey:this.searchKey};
                documentsApi.searchMyDocumentsRequest(param).then((data)=>{
                    this.haddleData({data:[...data],orderBy:'updateTime'});
                }).finally(()=>{this.$store.commit('changeLoading',{loading:false,loadingTxt:''});})
            }else{
                param= {parentId: this.$router.currentRoute.query.id || '',}
                documentsApi.getMyDocumentsRequest(param).then((data)=>{
                    this.haddleData({data:[...data],orderBy:'updateTime'});
                }).finally(()=>{this.$store.commit('changeLoading',{loading:false,loadingTxt:''});})
            }
        },
        //获取最近打开
        getRecentlyOpen(){
            let param={searchKey:this.searchKey,creationType:1, top:5};
            documentsApi.getRecentlyOpenRequest(param).then((data)=>{
                this.haddleData({data:[...data],orderBy:'openTime'});
            }).finally(()=>{this.$store.commit('changeLoading',{loading:false,loadingTxt:''});})
        },
        //获取回收站
        getRecycleBin(){
            let param={searchKey:this.searchKey,creationType:1};
            documentsApi.getRecycleBinRequest(param).then((data)=>{
                this.haddleData({data:[...data],orderBy:'updateTime'});
            }).finally(()=>{this.$store.commit('changeLoading',{loading:false,loadingTxt:''});})
        },
        //点击文件名称
        clickFileName(row){
            if (this.breadcrumb == this.$root.$t('message.recycleBin')) return;
            if (row.folder) {
                var folder = { name: row.name, id: row.id, children: [],parentId:row.parentId };
                if(!this.folderNames.includes(folder)){
                    this.$store.commit('documentsModule/changeFolderName',{ifAdd:true,folder});
                }
                this.$router.push({ meta: this.$route.meta, query: { id: row.id, } });
            } else {
                window.open(window.applicationPath+'/project/detail?id='+row.id);
            }
        },
        //点击面包屑第一级，清空session
        clearSessionFolder () {
            this.$store.commit('documentsModule/setFolderName',[]);
        },
        //点击面包屑，改变缓存的面包屑关系
        goIntoFolder(folder,index){
            this.$store.commit('documentsModule/changeFolderName',{folder,index});
        },
        //判断操作类型   
        operate (command) {
            let param;
            switch (command) {
                case 'delete':
                    //只能删除空文件夹
                    if(this.curOperateFile.folder){
                        this.judgeEmptyFolder({ parentId: this.curOperateFile.id });
                    }else{
                        this.falseDelFun();
                    }
                    break;
                case 'rename':
                    this.emitCreateOrEdit(false);
                    break;
                case 'move':
                    this.$refs['moveToDialog'].moveToVisible= true;
                    break;
                case 'copy':
                    this.copyFile();
                    break;
                case 'download':
                    this.downLoadFile();
                    break;
                case 'collaborate':
                    this.isCollaborate=true;
                    this.getFilePerson(param);
                    break;
                case 'changeLeader':
                    this.isCollaborate=false;
                    this.getFilePerson(param);
                    break;
                case 'saveAsTemplate':
                    this.$refs['saveAsTemplate'].saveAsTemplateVisible=true;
                    break;
            }
        },
        //新建或编辑组件的触发
        emitCreateOrEdit(ifCreate,createType){
            this.$refs['createEdit'].createEditVisible=true;
            this.$refs['createEdit'].isCreate=ifCreate;
            if(createType) this.$refs['createEdit'].newTypeName=createType;
        },
        handleOperate(row){
            this.curOperateFile=row;
        },
        //判断是否是空文件夹
        judgeEmptyFolder(param){
            documentsApi.getMyDocumentsRequest(param).then((data)=>{
                if(data.length){
                    this.$message({
                        message:this.$t('message.cannotDeldoc'),
                        type: 'warning'
                    });
                    return;
                } 
                this.falseDelFun();
            })
        },
        //删除空文件夹或者文档
        falseDelFun(){
            this.$confirm(this.$t('message.sureToDelete'), this.$t('message.delete',{'deleteType':''}), {
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                confirmButtonClass: 'confirm-btn',
                cancelButtonClass: 'cancel-btn',
                type: 'warning'
            }).then(()=>{
                this.curOperateFile.folder?this.falseDelFolder():this.falseDelFile();
            })
        },
        //删除文件夹
        falseDelFolder(){
            documentsApi.falseDelFolderRequest({folderId:this.curOperateFile.id}).then((data)=>{
                if(data) this.handdleSuccess({msg:this.$t('message.delSuccess'),highlightType:'folder',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        falseDelFile(){
            documentsApi.falseDelFileRequest({projectId:this.curOperateFile.id}).then((data)=>{
                if(data) this.handdleSuccess({msg:this.$t('message.delSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //复制文件
        copyFile(){
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
            let param={
                sourceType: 0,
                sourceId: this.curOperateFile.id,
                folderId: this.$router.currentRoute.query.id || '',
                name: `${this.curOperateFile.name}-${this.$t('message.fuben')}`
            }
            switch(this.curOperateFile.projectType){
                case 1:
                    this.copyDocument(param);
                    break;
                case 2:
                    this.copyMind(param)
                    break;
                default:
                    this.copyPPTExcel(param);
                    break;
            }
        },
        //复制文档
        copyDocument(param){
            documentsApi.copyDocumentRequest(param).then((data)=>{
                if(data) this.handdleSuccess({msg:this.$t('message.copySuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //复制思维导图
        copyMind(param){
            let otherParam={
                id: this.curOperateFile.id,
                creationType: 1,
                projectType:2
            }
            documentsApi.copyMindRequest(Object.assign(param,otherParam)).then((data)=>{
                if(data) this.handdleSuccess({msg:this.$t('message.copySuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //复制ppt excel
        copyPPTExcel(param){
            let otherParam={
                fileExt:this.curOperateFile.projectType===3?'pptx':(this.curOperateFile.projectType===4?'xlsx':'docx'),
                projectID: this.curOperateFile.id,
                creationType: 1,
            }
            documentsApi.copyPPTExcelRequest(Object.assign(param,otherParam)).then((data)=>{
                if(data) this.handdleSuccess({msg:this.$t('message.copySuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        handdleSuccess(data){
            this.$message.success(data.msg);
            this.$store.commit('documentsModule/setHighlightFirst',data.highlightType);
            if(!data.ifReload) return;
            this.getDocuments();
        },
        //下载文件
        downLoadFile(){
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.downloading')});
            switch(this.curOperateFile.projectType){
                case 1:
                    this.downLoadDoc();
                    break;
                case 2:
                    this.downLoadMind();
                    break;
                default:
                    this.downLoadPPTExcel();
                    break;
            }
        }, 
        //下载创作
        downLoadDoc(){ 
            documentsApi.convertDocRequest({projectId:this.curOperateFile.id,xmlNullEnable:1}).then((data)=>{
                this.downloadFileCode=data.fileCode.split('.')[0]+'.docx';
                if(data.fileCode=='d2597df3-9e1a-4765-8820-99795580ff38.docx'){
                    this.downLoadFileByParam({loadType:'download',requestParam:{
                        fileCode:data.fileCode,
                        fileName:this.curOperateFile.name
                    }});
                    return;
                }
                this.checkConvertState({convertTaskId: data.taskId});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //查询转换状态
        checkConvertState(param){
            documentsApi.checkConvertStateRequest(param).then((data)=>{
                if(data==4){
                    this.downLoadFileByParam({loadType:'download',requestParam:{
                        fileCode:this.downloadFileCode,
                        fileName:this.curOperateFile.name
                    }});
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
        //下载思维导图
        downLoadMind(){
            let param={
                projectId:this.curOperateFile.id
            }
            this.downLoadFileByParam({loadType:'downloadMind',requestParam:param});
        },
        //下载PPT EXCEL
        downLoadPPTExcel(){ 
            documentsApi.getOnlineEditorFileCode({projectId:this.curOperateFile.id}).then((result)=>{
                this.downLoadFileByParam({loadType:'download',requestParam:{
                    fileCode:result,
                    fileName:this.curOperateFile.name
                }});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //下载文件
        downLoadFileByParam(param){
            let paramStr='?'
            for(let key in param.requestParam){
                paramStr+=key+'='+param.requestParam[key]+'&';
            }
            if(paramStr.lastIndexOf('&')==paramStr.length-1){
                paramStr=paramStr.substring(0,paramStr.length-1);
            }
            let url = window.applicationPath + '/fileOperation/'+param.loadType+paramStr;
            let a = document.createElement('a');    // 转换完成，创建一个a标签用于下载
            a.href = url;
            $("body").append(a);  // 修复firefox中无法触发click
            a.click();
            $(a).remove();
            this.$store.commit('changeLoading',{loading:false,loadingTxt:''});
        }, 
        //回收站删除或还原
        completeDeleteOrRestore (row, flag) {
            this.curOperateFile=row;
            this.ifRestoreFromRecycleBin=flag;
            if (!flag) {
                this.$confirm(this.$t('message.sureToDelete'), this.$t('message.delete',{'deleteType':''}), {
                    confirmButtonText: this.$t('message.sure'),
                    cancelButtonText: this.$t('message.cancel'),
                    confirmButtonClass: 'confirm-btn',
                    cancelButtonClass: 'cancel-btn',
                    type: 'warning'
                }).then( ()=>{
                    row.folder?this.completeRestoreOrDeleteFolder():this.completeRestoreOrDeleteFile();
                })
                return;
            } 
            row.folder?this.completeRestoreOrDeleteFolder():this.completeRestoreOrDeleteFile();
        },
        //回收站删除或者还原文件夹
        completeRestoreOrDeleteFolder(){
            let api=this.ifRestoreFromRecycleBin?'completeRestoreFolderRequest':'completeDeleteFolderRequest';
            documentsApi[api]({folderId:this.curOperateFile.id}).then((data)=>{
                if(data) this.handdleSuccess({msg:this.ifRestoreFromRecycleBin?this.$t('message.restoreSuc'):this.$t('message.delSuccess'),highlightType:'folder',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //回收站删除或还原文件
        completeRestoreOrDeleteFile(){
            let api=this.ifRestoreFromRecycleBin?'completeRestoreFileRequest':'completeDeleteFileRequest';
            documentsApi[api]({projectId:this.curOperateFile.id}).then((data)=>{
                if(data) this.handdleSuccess({msg:this.ifRestoreFromRecycleBin?this.$t('message.restoreSuc'):this.$t('message.delSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //获取文档的成员及负责人
        getFilePerson(){
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
            documentsApi['getFilePersonRequest']({projectId:this.curOperateFile.id}).then(async(data)=>{
                await this.haddleFilePerson(data);
                this.collaborateOrChangeLeader();
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.$store.commit('changeLoading',{loading:false,loadingTxt:''});});
        },
        //给成员添加属性
        haddleFilePerson(data){
            if(data.partMen&&data.partMen.length){
                let userIndex;
                data.partMen.forEach((item,index)=>{
                    this.$set(item,'id',item.userId);
                    this.$set(item,'icon',item.logo);
                    this.$set(item,'userName',item.realName);
                    if(window.currentUser.id==item.userId) userIndex=index;
                });
                data.partMen.unshift(data.partMen.splice(userIndex,1)[0]);
            }
            if(data.chargeMan){
                this.$set(data.chargeMan,'id',data.chargeMan.userId);
                this.$set(data.chargeMan,'icon',data.chargeMan.logo);
                this.$set(data.chargeMan,'userName',data.chargeMan.realName);
            }
            this.$set(this.curOperateFile,'chargeMan',data.chargeMan);
            this.$set(this.curOperateFile,'partMan',data.partMen||[]);
            this.hasLoadMembers=true;
        },
        //协作或者改变负责人弹框
        collaborateOrChangeLeader(){
            this.isCollaborate?this.$refs['collaborateOrChangeLeader'].collaborateVisible=true:this.$refs['collaborateOrChangeLeader'].changeLeaderVisible=true;
        }
    },
    mounted(){
        
        this.getDocuments();
    },
    watch:{
        $route:{
            handler(to,from){
                if(to.fullPath!==from.fullPath) {
                    this.searchKey='';
                    this.getDocuments();
                }
            },
            deep:true
        },
    }
}
</script>