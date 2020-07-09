<template>
    <div>
        <el-container class="container doc-library-container">
            <el-aside class="left-sider" style="width:166px;">
                <el-button type="primary" @click="emitCreateOrEdit(true,$t('message.knowledgeClassify'))">{{$t('message.create',{'typeName':''})}}</el-button>
                <el-menu default-active="1-4-1" class="doc-library-left-menu">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="iconfont iconfile1"></i>
                            <span slot="title">{{$t('message.knowledgeClassify')}}</span>
                        </template>
                        <div>
                            <el-menu-item index="1-1" class="posr" v-for="(knowledgeClassify,index) in knowledgeClassifyAry" :key="index">
                                <span>全部分类</span>
                                <span class="tabcon-item-poper posa">
                                    <i class="iconfont icon-bianji color-9 mr05" :title="$t('message.edit',{'typeName':''})"  @click="emitCreateOrEdit(false,$t('message.knowledgeClassify'),knowledgeClassify)"></i>
                                    <i class="iconfont icon-huishouzhan color-9 mr05" :title="$t('message.delete',{'deleteType':''})" @click="deleteKnowledgeClassify(knowledgeClassify)"></i>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="1-2">
                                <span>产品文档</span>
                                <span class="tabcon-item-poper posa">
                                    <i class="iconfont icon-bianji color-9 mr05" :title="$t('message.edit',{'typeName':''})"></i>
                                    <i class="iconfont icon-huishouzhan color-9 mr05" :title="$t('message.delete',{'deleteType':''})"></i>
                                </span>
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
                <KnowledgeDocuments/>
            </el-main>
        </el-container>
        <CreateOrEditFolderAndFile ref="createEditClassify" :curOperateFile="curOperateFile" @handdleSuccess="handdleSuccess"/>
    </div>
</template>
<script>
import KnowledgeDocuments from 'root/components/knowledgeLibrary/KnowledgeDocuments';
import CreateOrEditFolderAndFile from 'root/components/documents/CreateOrEditFolderAndFile'
import knowledgeLibraryApi from 'root/api/knowledgeLibraryApi.js';
import { mapState } from 'vuex';
export default {
    name:'KnowledgeLibraryIndex',
    components:{KnowledgeDocuments,CreateOrEditFolderAndFile},
    data(){
        return {
            curOperateFile:{},//编辑知识分类时当前编辑的项
        }
    },
    computed:{
        ...mapState(['knowledgeClassifyAry']),
    },
    methods:{
        //获取知识分类
        getKnowledgeClassify(){
            knowledgeLibraryApi.getKnowledgeClassifyRequest({}).then((data)=>{
                this.$store.commit('setKnowledgeClassify',[...data]);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //新建或编辑组件的触发
        emitCreateOrEdit(ifCreate,createType,knowledgeClassify){
            this.$refs['createEditClassify'].createEditVisible=true;
            this.$refs['createEditClassify'].isCreate=ifCreate;
            if(createType) this.$refs['createEditClassify'].newTypeName=createType;
            if(knowledgeClassify) this.curOperateFile=knowledgeClassify;
        },
        //新建或编辑，模板分类成功 、、{msg:this.$t('message.renameSuccess'),ifReload:false}
        handdleSuccess(data){
            this.$message.success(data.msg);
            if(!data.ifReload) return;
            this.getKnowledgeClassify();
        },
        //删除只是分类
        deleteKnowledgeClassify(knowledgeClassify){
            this.$confirm(this.$t('message.sureToDelete'), this.$t('message.delete',{'deleteType':''}), {
                confirmButtonText: this.$t('message.sure'),
                cancelButtonText: this.$t('message.cancel'),
                confirmButtonClass: 'confirm-btn',
                cancelButtonClass: 'cancel-btn',
                type: 'warning'
            }).then(()=>{
                this.sureToDeleteClassify(knowledgeClassify);
            })
            
        },
        //确定删除知识分类
        sureToDeleteClassify(knowledgeClassify){
            knowledgeLibraryApi.deleteKnowledgeClassifyRequest({}).then((data)=>{
                this.$store.commit('deleteKnowledgeClassify',knowledgeClassify);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        }
    },
    mounted(){
        this.getKnowledgeClassify();
    }
}
</script>