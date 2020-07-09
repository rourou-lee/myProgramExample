<template>
     <!--保存为模板-->
        <el-dialog  width='750px' :title="$t('message.saveAs')" :visible="saveAsTemplateVisible" 
                :close-on-click-modal="false" :before-close="cancelSaveAsTemplate">
            <div class="dialog-con">
                <el-form  label-width="auto" ref="saveAsTemplateform" :model="saveAsTemplateForm" :rules="rules">
                    <el-form-item :label="$t('message.templateName')+'：'" prop="name" class="form-list-required">
                        <el-input :placeholder="$t('message.other')" v-model.trim="saveAsTemplateForm.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('message.selectTemplateAttr')+'：'" prop="templateAttribute" v-if="showTemplateAttr">
                        <el-radio-group v-model="saveAsTemplateForm.templateAttribute"  @change="selectTemplateAttribute">
                            <el-radio label="1">{{$t('message.public')}}</el-radio>
                            <el-radio label="0">{{$t('message.private')}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('message.selectTemClassify')+'：'" prop="templateClassify" class="form-list-select" v-if="classifyShow&&showTemplateAttr">
                        <el-select :clearable="true" :placeholder="$t('message.selectClassification')" v-model="saveAsTemplateForm.templateClassify" @change="selectTemplateClassify" popper-class="maxw-sel68">
                           <el-option v-for="category in templateCategory" :key="category.id" 
                                        :label="category.name"  
                                        :value="category.id" :title="category.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureToSaveAsTemplate('saveAsTemplateform')">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelSaveAsTemplate('saveAsTemplateform')">{{$t('message.cancel')}}</el-button>
            </span>
        </el-dialog>
</template>
<script>
import {mapState} from 'vuex';
import templateApi from 'root/api/templateApi';
import documentsApi from 'root/api/documentsApi';
import validateFormRule from 'root/utils/validateFormRule';
export default {
    name:'SaveAsTemplate',
    mixins: [validateFormRule],
    props:['curOperateFile'],
    data(){
        return {
            saveAsTemplateVisible:false,
            saveAsTemplateForm:{
                name:'',
                templateAttribute:window.manageContentTemplate?'1':'0',
                templateClassify:''
            },
            showTemplateAttr:window.manageContentTemplate,
            classifyShow:true,  //显示模板分类
            selectTemplateClassifyId:'',  //选择的模板分类
            cloudModel: window.cloudModel,
            rules: {
                name: [
                    { validator: this.invalidCharacter, trigger: 'change' }
                ]
            },
            convertFileCode:'',//转换码
            
        }
    },
    computed:{
        ...mapState('templatesModule',['templateCategory']),
    },
    methods:{
        //选择模板属性
        selectTemplateAttribute(value){
            this.saveAsTemplateForm.templateClassify = "";
            this.classifyShow = value == '1'?true:false;
        },
        //选择模板分类
        selectTemplateClassify(){
            this.selectTemplateClassifyId = this.saveAsTemplateForm.templateClassify;
        },
        //确定保存为模板
        sureToSaveAsTemplate(formName){
            this.$refs[formName].validate((valid)=>{
                debugger;
                if (valid) {
                    this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.saving')});
                    switch(this.curOperateFile.projectType){
                        case 1:
                            this.saveDoc();
                            break;
                        case 5:
                            this.convertWordToXml();
                            break;
                        default: 
                            this.savePPTExcel();
                            break;
                    }
                } else {
                    return false;
                }
            });
        },
        //另存为type==1的文档
        saveDoc(){
            documentsApi.convertDocRequest({projectId:this.curOperateFile.id,xmlNullEnable:0}).then((data)=>{
                this.convertFileCode=data.fileCode;
                this.checkConvertState({convertTaskId: data.taskId});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //查询转换状态
        checkConvertState(param){
            documentsApi.checkConvertStateRequest(param).then((data)=>{
                if(data==4){
                    this.saveAsTemplateSubmit();
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
        //转换完成另存为模板
        saveAsTemplateSubmit(){
            let param={
                templateName:this.saveAsTemplateForm.name,
                ifPublic:this.cloudModel?0:this.saveAsTemplateForm.templateAttribute,
                fileCode:this.convertFileCode,
                categoryId:this.saveAsTemplateForm.templateClassify,
                type:1
            }
            templateApi.addTemplateRequest(param).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.saveSuccess'),highlightType:'file',ifReload:false});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.cancelSaveAsTemplate();});
        },
        //type为5的文档先转换为xml
        convertWordToXml(){
            templateApi.convertWordToXmlRequest({projectId:this.curOperateFile.id}).then((data)=>{
                this.convertFileCode=data.fileCode;
                this.checkConvertState({convertTaskId: data.taskId});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //另存为模板ppt excel
        savePPTExcel(){
            let param={
                templateName:this.saveAsTemplateForm.name,
                ifPublic:this.cloudModel?0:this.saveAsTemplateForm.templateAttribute,
                fileCode:this.convertFileCode,
                categoryId:this.saveAsTemplateForm.templateClassify,
                type:this.curOperateFile.projectType,
                projectId:this.curOperateFile.id,
            }
            templateApi.savePPTExcelRequset(param).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.saveSuccess'),highlightType:'file',ifReload:false});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.cancelSaveAsTemplate();});;
        },
        //取消保存为模板
        cancelSaveAsTemplate(){
            this.$refs.saveAsTemplateform.resetFields();
            this.$refs.saveAsTemplateform.clearValidate();
            this.$nextTick(()=>{
                this.classifyShow=true;
                this.saveAsTemplateVisible=false;
            });
            this.$store.commit('changeLoading',{loading:false,loadingTxt:''});
        },
        //获取模板分类
        getTemplateCategory(){
            let param={belongType:window.cloudModel?1:0,templateType:this.curOperateFile.projectType||1,searchKey:''};
            templateApi.getTemplateCategoryRequest(param).then((data)=>{
                this.$store.commit('templatesModule/setTemplateCategory',[...data]);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
    },
    mounted(){
        this.getTemplateCategory();
    },
    watch:{
        saveAsTemplateVisible(val){
            if(val){
                this.saveAsTemplateForm.name=this.curOperateFile.name.trim();
            }
        }
    }
}
</script>