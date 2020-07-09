<template>
    <div>
        <el-container class="container doc-library-container">
            <el-aside class="left-sider" style="width:166px;">
                <el-button type="primary" @click="emitCreateOrEdit(true,$t('message.docClassify'))">{{$t('message.create',{'typeName':''})}}</el-button>
                <el-menu default-active="1-4-1" class="doc-library-left-menu">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="iconfont iconfile1"></i>
                            <span slot="title">{{$t('message.docClassify')}}</span>
                        </template>
                        <div>
                            <el-menu-item index="1-1" class="posr" v-for="(docClassify,index) in documentClassifyAry" :key="index">
                                <span>全部分类</span>
                                <span class="tabcon-item-poper posa" v-if="docClassify!=='全部分类'">
                                    <i class="iconfont icon-bianji color-9 mr05" :title="$t('message.edit',{'typeName':''})" @click="emitCreateOrEdit(false,$t('message.docClassify'),docClassify)"></i>
                                    <i class="iconfont icon-huishouzhan color-9 mr05" :title="$t('message.delete',{'deleteType':''})" @click="deleteClassify(docClassify)"></i>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="1-2">
                                <span>产品文档</span>
                            </el-menu-item>
                            <el-menu-item index="1-2"><span>全部分类设计产品文档产品文档产品文档产品文档文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>售后文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>服务文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>其他</span></el-menu-item>
                            <el-menu-item index="1-1"><span>全部分类</span></el-menu-item>
                            <el-menu-item index="1-2"><span>产品文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>设计文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>售后文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>服务文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>产品文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>全部分类设计产品文档产品文档产品文档产品文档文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>售后文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>服务文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>其他</span></el-menu-item>
                            <el-menu-item index="1-1"><span>全部分类</span></el-menu-item>
                            <el-menu-item index="1-2"><span>产品文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>设计文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>售后文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>服务文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>产品文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>全部分类设计产品文档产品文档产品文档产品文档文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>售后文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>服务文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>其他</span></el-menu-item>
                            <el-menu-item index="1-1"><span>全部分类</span></el-menu-item>
                            <el-menu-item index="1-2"><span>产品文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>设计文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>售后文档</span></el-menu-item>
                            <el-menu-item index="1-2"><span>服务文档</span></el-menu-item>
                        </div>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main class="main" id="mainCon">
                <LibraryDocuments ref="library-docs-list"/>
            </el-main>
        </el-container>
        <CreateOrEditFolderAndFile ref="createEditClassify" :curOperateFile="curOperateFile" @handdleSuccess="handdleSuccess"/>
    </div>
</template>
<script>
import{mapState} from 'vuex';
import LibraryDocuments from 'root/components/documentsLibrary/LibraryDocuments';
import CreateOrEditFolderAndFile from 'root/components/documents/CreateOrEditFolderAndFile';
import docLibraryApi from 'root/api/docLibraryApi';
export default {
    name:'DocumentsLibraryIndex',
    components:{LibraryDocuments,CreateOrEditFolderAndFile},
    data(){
        return {
           curOperateFile:{},//当前编辑的分类或者文档
           documentClassifyAry:[],
        }
    },
    methods:{
        //获取文档分类
        getDocumentClassify(){
            docLibraryApi.getDocumentClassifyRequest({}).then((data)=>{
                this.documentClassifyAry=[...data];
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //新建或编辑组件的触发
        emitCreateOrEdit(ifCreate,createType,docClassify){
            debugger;
            this.$refs['createEditClassify'].createEditVisible=true;
            this.$refs['createEditClassify'].isCreate=ifCreate;
            if(createType) this.$refs['createEditClassify'].newTypeName=createType;
            if(docClassify) this.curOperateFile=docClassify;
        },
        //新建或编辑，模板分类成功 、、{msg:this.$t('message.renameSuccess'),ifReload:false}
        handdleSuccess(data){
            this.$message.success(data.msg);
            if(!data.ifReload) return;
            this.getDocumentClassify();
        },
        //删除文档分类
        deleteClassify(docClassify){
            this.$confirm(this.$t('message.sureToDelete'), this.$t('message.delete',{'deleteType':''}), {
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                confirmButtonClass: 'confirm-btn',
                cancelButtonClass: 'cancel-btn',
                type: 'warning'
            }).then(()=>{
                this.sureToDeleteClassify(docClassify);
            })
            
        },
        //确定删除文档分类
        sureToDeleteClassify(docClassify){
            docLibraryApi.deleteClassifyRequest({}).then((data)=>{
                this.$store.commit('deleteDocumentClassify',docClassify);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        }
    },
    mounted(){
        this.getDocumentClassify();
    }

}
</script>