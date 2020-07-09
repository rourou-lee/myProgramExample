<template>
    <el-container>
        <el-header class="header-top">
            <p class="float-r color-9 ht-search posr">
                <input type="text" name="" class="ht-input" v-model.trim="searchKey" @keypress.enter="getLibraryDocuments"/>
                <i class="iconfont icon-sousuo posa" @click="getLibraryDocuments"></i>
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
                    <el-table-column prop="chargeMan" label="归档者" width="200">
                        <template slot-scope="">
                            <img :src="currentUser.logo" class="header-img" />
                            <span>{{currentUser.realName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="归档时间" width="150">
                        <template slot-scope="scope">
                            <!-- <span>{{computeTime(scope.row.time)}}</span> -->
                            <span>{{scope.row.time}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('message.operate')" width="150">
                        <template slot-scope="scope">
                            <el-dropdown trigger="click" @command="operate">
                                <el-button class="edit" @click="handleOperate(scope.row)"><img src="../../assets/images/moreImg.png"></el-button>
                                <el-dropdown-menu slot="dropdown" class="select02">
                                    <el-dropdown-item command="download" class="posr drop-posr" v-if="!scope.row.folder">
                                        <i class="iconfont icon-xiazai1"></i>{{$t('message.download')}}
                                    </el-dropdown-item>
                                    <el-dropdown-item command="edit" v-if="isDisplay(scope.row)">
                                        <i class="iconfont icon-bianji"></i>{{$t('message.edit',{typeName:''})}}
                                    </el-dropdown-item>
                                     <el-dropdown-item command="delete" v-if="isDisplay(scope.row)"> 
                                        <i class="iconfont icon-huishouzhan"></i>{{$t('message.delete',{'deleteType':''})}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <EditLibraryDocument ref="editDoc" :curOperateFile="curOperateFile" v-if="curOperateFile.id" @handdleSuccess="handdleSuccess"/>
    </el-container>
</template>
<script>
import docLibraryApi from 'root/api/docLibraryApi.js';
import documentsApi from 'root/api/documentsApi.js';
import {mapState} from 'vuex';
import validateWords from 'root/utils/validateWords';
import EditLibraryDocument from 'root/components/documentsLibrary/EditLibraryDocument'
export default {
    name:'LibraryDocuments',
    mixins: [validateWords],
    components:{EditLibraryDocument},
    data(){
        return {
            currentUser:window.currentUser,  //当前登录用户
            searchKey:'',
            fileList:[{name:'文档名称',time:'2020/06/29',projectType:2},{name:'文档名称',time:'2020/06/29',projectType:2},{name:'文档名称',time:'2020/06/29',projectType:2},{name:'文档名称',time:'2020/06/29',projectType:2},{name:'文档名称',time:'2020/06/29',projectType:2}
            ,{name:'文档名称',time:'2020/06/29',projectType:2},{name:'文档名称',time:'2020/06/29',projectType:2},{name:'文档名称',time:'2020/06/29',projectType:2},{name:'文档名称',time:'2020/06/29',projectType:2}],
            emptyData:'',
            curOperateFile:{},//当前操作文档
            downloadFileCode:'',//下载转换码,
           
        }
    },
    computed:{
        ...mapState('documentsModule',['highlightFirst','folderNames']),
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
        //获取文件列表
        getLibraryDocuments(){
            if(this.searchKey&&!this.validateSearchKey(this.searchKey)) return;
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
            docLibraryApi.getLibraryDocumentsRequest({}).then((data)=>{
                this.haddleData({data:[...data],orderBy:'updateTime'});
            }).finally(()=>{this.$store.commit('changeLoading',{loading:false,loadingTxt:''});})
        },
        //点击文件名称
        clickFileName(row){
            window.open(window.applicationPath+'/project/detail?id='+row.id);
        },
        //判断操作类型   
        operate (command) {
            let param;
            switch (command) {
                case 'delete':
                    this.deleteLibraryDoc();
                    break;
                case 'edit':
                    this.emitCreateOrEdit();
                    break;
                case 'download':
                    this.downLoadFile();
                    break;
            }
        },
        //新建或编辑组件的触发
        emitCreateOrEdit(){
            this.$refs['editDoc'].editFileVisible=true;
        },
        handleOperate(row){
            this.curOperateFile=row;
        },
        //删除文档
        deleteLibraryDoc(){
            this.$confirm(this.$t('message.sureToDelete'), this.$t('message.delete',{'deleteType':''}), {
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                confirmButtonClass: 'confirm-btn',
                cancelButtonClass: 'cancel-btn',
                type: 'warning'
            }).then(()=>{
                this.submitDeleteLibraryDoc();
            });
        },
        //确定删除文档
        submitDeleteLibraryDoc(){
            docLibraryApi.DeleteLibraryDocRequest({projectId:this.curOperateFile.id}).then((data)=>{
                if(data) this.handdleSuccess({msg:this.$t('message.delSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        handdleSuccess(data){
            this.$message.success(data.msg);
            this.$store.commit('documentsModule/setHighlightFirst',data.highlightType);
            if(!data.ifReload) return;
            this.getLibraryDocuments();
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
        }
    },
    mounted(){
        this.getLibraryDocuments();
    },
    watch:{
        $route:{
            handler(to,from){
                if(to.fullPath!==from.fullPath) {
                    this.searchKey='';
                    this.getLibraryDocuments();
                }
            },
            deep:true
        },
    }
}
</script>