<template>
    <div>
        <el-dialog :title="$t('message.edit',{typeName:$t('message.knowledge')})" :visible="editFileVisible" 
                :close-on-click-modal="false" @close="cancelEditFile('editFileForm')">
            <div class="dialog-con">
                <el-form label-width="80px" ref="editFileForm" :model="editFileForm" :rules="rules" class="passwordForm editFileForm">
                    <el-form-item label="知识名称:" required prop="fileName">
                        <el-input v-model.trim="editFileForm.fileName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item :label="`${$t('message.knowledgeClassify')}:`" required prop="fileClassify">
                        <div class="el-select classify">
                             <div class="el-select__tags">
                                <span>
                                    <span class="el-tag el-tag--info el-tag--small" v-for="(classify,index) in editFileForm.fileClassify" :key="index">
                                        <span>{{classify}}</span>
                                        <i class="iconfont icondelete1" @click="deleteSelectedClassify(classify)"></i>
                                    </span>
                                </span>
                            </div> 
                            <el-input :readonly="true">
                                <i slot="suffix" class="iconfont iconchoice"  @click="selectClassify"></i>
                            </el-input>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditFile">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelEditFile('editFileForm')">{{$t('message.cancel')}}</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="$t('message.knowledgeClassify')" :close-on-click-modal="false" 
            :visible="chooseClassifyVisible" class="classify-dialog" @close="chooseClassifyVisible=false">
            <div class="dialog-con">
                <el-checkbox-group v-model="selectedClassify">
                    <el-checkbox label="双皮奶" v-for="(knowledgeClassify,index) in knowledgeClassifyAry" :key="index"></el-checkbox>
                    <el-checkbox label="炒酸奶"></el-checkbox>
                    <el-checkbox label="炸酸奶"></el-checkbox>
                    <el-checkbox label="冻酸奶" disabled></el-checkbox>
                    <el-checkbox label="就是酸奶" disabled></el-checkbox>
                </el-checkbox-group>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSelectClassify">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelSelectClassify">{{$t('message.cancel')}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapState} from 'vuex';
import knowledgeLibraryApi from 'root/api/knowledgeLibraryApi.js';
import validateFormRule from 'root/utils/validateFormRule';
export default {
    name:'EditKnowledgeDocument',
    props:['curOperateFile'],
    mixins: [validateFormRule],
    data(){
        return {
            editFileVisible:false,
            editFileForm:{
                fileName:'',
                fileClassify:['双皮奶','炒酸奶'],
            },
            chooseClassifyVisible:false,
            options:[{label:'分类1',value:'分类1'},{label:'分类2',value:'分类2'},{label:'分类3',value:'分类3'},{label:'分类4',value:'分类4'},],
            selectedClassify:[],
            rules: {
                fileName: [
                    { validator: this.invalidCharacter, trigger: 'change' }
                ]
            },
        }
    },
    computed:{
        ...mapState(['knowledgeClassifyAry']),
    },
    methods:{
        //编辑文件确认
        submitEditFile(){
            knowledgeLibraryApi.editKnowledgeRequest({
                projectId: this.curOperateFile.id,
                name: this.editFileForm.fileName
            }).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.renameSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.editFileVisible=false;});
        },
         //取消编辑文件
        cancelEditFile(formName){
            this.$refs[formName].resetFields();
            this.$refs[formName].clearValidate();
            this.$nextTick(()=>{
                this.editFileVisible=false;
            });
        },
        //取消选择分类
        cancelSelectClassify(){
            this.selectedClassify=[];
            this.chooseClassifyVisible=false
        },
        //确定选择分类
        submitSelectClassify(){
            this.editFileForm.fileClassify=this.selectedClassify;
            this.cancelSelectClassify();
        },
        //编辑文件，设置表单默认值
        setFormDefaultVal(){
            this.editFileForm.fileName=this.curOperateFile.name;
            //this.editFileForm.fileClassify=this.curOperateFile.fileClassify;
        },
        //选择文档分类
        selectClassify(){
            this.chooseClassifyVisible=true;
            this.selectedClassify=this.editFileForm.fileClassify;

        },
        //删除文档分类
        deleteSelectedClassify(classify){
            this.editFileForm.fileClassify=this.editFileForm.fileClassify.filter((item)=>{
                return classify!==item;
            })
        }
    },
    watch:{
        curOperateFile:{ 
            handler(val){
                if(!val) return;
                this.setFormDefaultVal();
            },
            immediate: true
        }
    }
}
</script>

