<template>
    <div class="float-r">
        <p>
            <el-button type="warning" @click="showCategoryAddOrEdit">
                <i class="iconfont icon-process mr05"></i>{{$t('message.templateClassify')}}
            </el-button>
        </p>
        <el-dialog :visible="categoryAddOrEditVisible" 
                   :close-on-click-modal="false" @close="closeCategoryDialog"
                   :title="$t('message.templateClassify')" width="750px">
            <div class="tem-gl-bot">
                <el-input v-focus='editFlag' :placeholder="$t('message.createCategoryTip')" 
                v-model.trim="categoryName" @keypress.native.enter="addCategory"></el-input>
            </div>
            <div class="dialog-con tem-con">
                <ul class="tem-gl">
                    <li class="clearfix" v-for="(category,index) in templateCategory" :key='index'>
                        <p v-show="!category.edited">
                            <span class="float-l categoryName" :id="category.id" @mouseenter="computeTitle">{{category.name}}</span>   <!-- 名称长度限制 -->
                            <i class="iconfont icon-huishouzhan float-r mr30 cp" @click="deleteCategory(category)"></i>
                            <i class="iconfont icon-bianji float-r mr10 cp" @click="editCategory(category)"></i>
                        </p>
                        <el-input :placeholder="$t('message.createCategoryTip')"
                                  v-model.trim="editedCategoryName" v-if="category.edited"
                                  v-focus='editFlag1'
                                  @keypress.native.enter="submitEditCategory(category)"
                                  @blur="cancelEditCategory(category)"></el-input> 
                     </li>
                </ul>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapState,mapMutations,mapActions} from 'vuex';
import templateApi from 'root/api/templateApi';
export default {
    name:'CategoryEdit',
    props:['templateType'],
    data(){
        return {
            categoryAddOrEditVisible:false,
            categoryName:'',    //天机模板分类的名称
            editFlag:false,  //改变input聚焦
            editFlag1:false,
            editedCategoryName:'',   //编辑的模板分类的名称
        }
    },
    computed:{
        ...mapState('templatesModule',['templateCategory']),
       
    },
    directives: {
        focus: {
            update(el,{value}) {
                if(value) $(el).find('input').focus();
            }
        }
  },
    methods:{
        computeTitle(row){
            if ($('#' + row.id).width() >= $('#' + row.id).parent().width() - 20) {
                $('#' + row.id).attr('title', row.name);
            }
        },
        //编辑模板分类
        showCategoryAddOrEdit(){
            this.categoryAddOrEditVisible=true;
            this.$nextTick(()=>{
                this.editFlag=true;
            });
        },
        //关闭模板分类弹框，初始化模板分类数据
        closeCategoryDialog(){
            this.categoryAddOrEditVisible=false;
            this.$store.commit('templatesModule/setTemplateCategory',this.templateCategory);
            this.categoryName = '';
            this.editedCategoryName='';
            this.editFlag=false;  
            this.editFlag1=false;  
        },
        validate (str, id) {
            let pattern = /['|"|<|>|#|%|\\|\/|:|\*|\?|\|]/g;
            let length = str.length;
            let ary = [];
            this.templateCategory.forEach((item)=>{
                if (id && id == item.id && item.name == str) {
                    return;
                } else if (ary.indexOf(item.name) == -1) {
                    ary.push(item.name);
                }
            })
            if (ary.indexOf(str) >= 0) {
                this.$message({
                    message: this.$t('message.nameAlreadyExists'),
                    type: 'warning'
                });
                return false;
            }
            if (length && pattern.test(str)) {
                this.$message({
                    message: this.$t('message.invalidCharacter'),
                    type: 'warning'
                });
                return false;
            }
            if (/^\s+$/g.test(str)) {
                this.$message({
                    message: this.$t('message.invalidCharacter'),
                    type: 'warning'
                });
                return false;
            }
            if (length > 200) {
                this.$message({
                    message: this.$t('message.characterLenTip'),
                    type: 'warning'
                });
                return false;
            }
            if (!length) {
                this.$message({
                    message: this.$t('message.enterNameTip'),
                    type: 'warning'
                });
                return false;
            }
            return true;
        },
        //添加模板分类
        addCategory(){
            if (!this.validate(this.categoryName)) return;
            templateApi.addTemplateCategoryRequest({
                name: this.categoryName,
                belongType: window.cloudModel?1:0,   //机构模板0，系统模板1
                templateType:this.templateType  //文档内容模板0
            }).then((data)=>{
                this.$emit('operateTemplateCategorySuccess',{msg:this.$t('message.addSuccess'),ifReload:true});
            }).catch((error)=>{
                this.$message.error(this.$t('message.requestError'));
            })
        },
        //删除分类
        deleteCategory(category){
            this.$confirm(this.$t('message.sureToDelete'), '', {
                confirmButtonText: this.$t('message.sure'),
                confirmButtonClass: 'confirm-btn',
                cancelButtonText: this.$t('message.cancel'),
                cancelButtonClass: 'cancel-btn',
                type: 'warning'
            }).then(()=>{
                this.deleteCategoryAction({id: category.id});
            })
        },
        //删除模板分类
        deleteCategoryAction(param){
            templateApi.deleteTemplateCategoryRequest(param).then((data)=>{
                this.$emit('operateTemplateCategorySuccess',{msg:this.$t('message.delSuccess'),ifReload:true});
            }).catch((error)=>{
                this.$message.error(this.$t('message.requestError'));
            })
        },
        //编辑
        editCategory(category){
            category.edited = true;
            this.editFlag1=false;
            this.editedCategoryName = category.name;
            this.$nextTick(()=>{
                this.editFlag=false;
                this.editFlag1=true;
            });
        },
        //回车确认编辑模板分类
        submitEditCategory(category){
            if(!this.validate(this.editedCategoryName,category.id)) return;
            templateApi.updateTemplateCategoryRequest({
                name:this.editedCategoryName,
                id:category.id
            }).then((data)=>{
                this.$emit('operateTemplateCategorySuccess',{msg:this.$t('message.editSuccess'),ifReload:true});
            }).catch((error)=>{
                this.$message.error(this.$t('message.requestError'));
            })
        },
        //去下编辑模板分类
        cancelEditCategory(category){
            this.$set(category, 'edited', false);
        }
    }
}
</script>
<style>
.categoryName{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;max-width: 600px;}
</style>

