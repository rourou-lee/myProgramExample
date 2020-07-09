<template>
     <div id="readPdf">
        <div class="tanc"></div>
        <div class="tanc-content">
            <div class="tanc-contentl posa">
                <div class="contentl-top">
                    <iframe :src="templateInfo.url" style="width:100%;height:100%" name="readTemplate" id='templateIframe'></iframe>
                </div>
            </div>
            <div class="tanc-contentr posa">
                <h2 class="ml20" :title="curTemplate.templateName">{{curTemplate.templateName}}</h2>
                <p class="ft12 ml20">{{$t('message.contributor')}}：{{templateInfo.creator?templateInfo.creator.realName:''}}</p>
                <p class="ft12 ml20">{{$t('message.releaseTime')}}：{{computeUpdateTime(curTemplate.updateTime)}}</p>
                <p class="ft12 ml20">{{$t('message.usageCount')}}：{{curTemplate.usageCount ? curTemplate.usageCount : 0 }}</p>
                <div class="tanc-btn" >
                    <button @click='useTemplate'>{{$t('message.useTemplate')}}</button>
                </div>
            </div>
            <button class="clear-btn" @click="changeReadFlag({closeFlag:false,createdFlag:false})">×</button>
        </div>
        <!-- 选择编辑器弹窗 -->
        <el-dialog :title="$t('message.createDoc')" width="750px" :visible="choseEditorVisible"
                :close-on-click-modal="false" @close="cancelChoseEditor">
            <div class="dialog-con">
                <el-form label-width="100px" :rules="rules" ref="createForm" :model="createForm" @submit="stopSubmit">
                    <el-form-item :label="$t('message.name')+'：'" prop="formName" class="el-item-mb0 form-list-required">
                        <el-input :placeholder="$t('message.enterNameTip')"
                                    v-model="createForm.formName"
                                    name="formName"
                                    v-focus="showFocus"></el-input>
                        <input type="text" style="display:none" />
                    </el-form-item>
                    <el-form-item :label="$t('message.editor')+':'" class="tip-item form-list-required">
                        <el-radio-group v-model="createForm.editor" @change="selectEditor">
                            <el-radio label="1">{{$t('message.xmlEditor')}}</el-radio>
                            <el-radio label="5">{{$t('message.formatDocEditor')}}</el-radio>
                        </el-radio-group>
                        <p class="color-f0" v-show="createForm.editor==='5'">{{$t('message.layoutEditorApplyFor1')}}</p>
                        <p class="color-f0" v-show="createForm.editor==='1'">{{$t('message.xmlEditorApplyFor1')}}</p>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureToChoseEditor">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelChoseEditor">{{$t('message.cancel')}}</el-button>
            </span>
        </el-dialog> 
    </div>
</template>
<script>
import { mapState,mapGetters, mapActions} from "vuex";
import documentsApi from 'root/api/documentsApi.js';
import {importAsync} from 'root/utils/utils';
import validateFormRule from 'root/utils/validateFormRule';
export default {
    name:'ReadTemplateCon',
    mixins: [validateFormRule],
    props:['createDocuments','documentName','documentType'],
    data(){
        return {
            choseEditorVisible:false,
            createForm:{
                formName:'',
                editor:'5'
            },
            rules: {
                formName: [
                    { validator: this.invalidCharacter, trigger: 'change' }
                ]
            },
            showFocus: false,   //表单聚焦指令
        }

    },
    directives: {
        focus: {
            update(el,{value}) {
                if(value) $(el).find('input').focus();
            }
        }
    },
    computed:{
        ...mapState('templatesModule',['templateInfo','curTemplate']),
        ...mapGetters('templatesModule',['mindType'])
    },
    methods:{
        ...mapActions('templatesModule',['uesMindAddCreation']),
        stopSubmit (e) {
            if (e.keyCode === 13 || !e) return false;
        },
        //新建模板
        useTemplate(){
            if(this.curTemplate.type===1&&!this.createDocuments){
                this.choseEditorVisible=true;
                this.createForm.formName=this.curTemplate.templateName;
                this.showFocus=true;
                return;
            }
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.creating')});
            if(this.curTemplate&&this.curTemplate.type===2){
                this.uesMindAddCreation().then((data)=>{
                    this.uesMindAddCreationFun(data);
                });
            }else{
                this.useOtherAddCreation();
            }
        },
        //关闭阅读状态
        changeReadFlag(flag){
            this.$emit('changeReadFlag',flag);
        },
        computeUpdateTime(time){
            return `${time.split(' ')[0]} ${time.split(' ')[1].split(':')[0]}:${time.split(' ')[1].split(':')[1]}`;
        },
        uesMindAddCreationFun(data){
            this.$emit('createUseTemplate',{
                sourceType:1,
                sourceId:this.curTemplate.id,
                folderId:this.createDocuments?(this.$router.currentRoute.query.id||''):'',
                fileCode:this.curTemplate.fileCode,
                creationType: 1,
                projectType:this.curTemplate.type,
                currentUserId:window.currentUser.id,
                chargeManId:window.currentUser.id,
                name: this.createDocuments?this.documentName:this.curTemplate.templateName,
                content:data,
                templateId:this.curTemplate.id,
            });
        },
        //使用doc ppt excel
        useOtherAddCreation(){
            let param={
                sourceType:1,
                sourceId:this.curTemplate?this.curTemplate.id:'',
                folderId:this.createDocuments?(this.$router.currentRoute.query.id||''):'',
                fileCode:this.curTemplate.fileCode,
                creationType: 1,
                projectType:(this.curTemplate.type==1&&this.createDocuments)?this.documentType:this.curTemplate.type,
                currentUserId:window.currentUser.id,
                chargeManId:window.currentUser.id,
                name: this.createDocuments?this.documentName:this.curTemplate.templateName,
                templateId:this.curTemplate?this.curTemplate.id:''
            } 
            this.$emit('createUseTemplate',param);
        },
       
        //取消选择编辑器
        cancelChoseEditor(){
            this.createForm.editor='5';
            this.choseEditorVisible=false;
        },
        //文档选择编辑器
        selectEditor(value){
            this.createForm.editor=value;
        },
        sureToChoseEditor(){
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.creating')});
            let param={
                creationType: 1,
                fileExt:"docx",
                folderId: "",
                name:this.createForm.formName,
                sourceType:1,
                sourceId:this.curTemplate.id,
                projectType:Number(this.createForm.editor),
                currentUserId:window.currentUser.id,
                chargeManId:window.currentUser.id,
                fileCode:this.curTemplate.fileCode,
                templateId:this.curTemplate.id
            }
            this.$emit('createUseTemplate',param);
            this.cancelChoseEditor();
        }
    },
    watch:{
        'templateInfo.url':(val)=>{
            if(val){
                $('#templateIframe')[0].contentWindow.location.href=val;
            }
        }
    }
}
</script>
<style scoped>
.el-dialog__wrapper{z-index: 3031!important;}
</style>

