<template>
    <el-dialog :title="dialogTitle"
                :visible="editOrCreateVisible"
                :close-on-click-modal="false" @close='cancelAddOrEditTemplate'
                width="800px">
        <div class="main-panel main-panel05">
            <el-form label-width="auto" ref="newTemplateForm" :model="newTemplateForm" :rules="rules">
                <el-form-item :label="$t('message.templateName')+'：'" class="form-list-normal form-list-required mlno-requ" prop="name">
                    <el-input :placeholder="$t('message.characterLenTip')" v-model="newTemplateForm.name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('message.temAttribute')+'：'" prop="templateAttribute" v-if="showTemplateAttr">
                    <el-radio-group v-model="newTemplateForm.templateAttribute"  @change="selectTemplateAttribute">
                        <el-radio label="1">{{$t('message.public')}}</el-radio>
                        <el-radio label="0">{{$t('message.private')}}</el-radio>
                    </el-radio-group>
                    <el-tooltip placement="right">
                        <div slot="content" class="tip-content">
                            <p>{{$t('message.publicTip')}}</p>
                            <p>{{$t('message.privateTip')}}</p>
                        </div>
                        <i class="iconfont icon-iconfonticonfonticon4"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item :label="$t('message.selectClassification')+'：'" class="form-list-select" prop="templateClassify" v-if="classifyShow">
                    <el-select :clearable="true" :placeholder="$t('message.selectTemClassify')" v-model="newTemplateForm.templateClassify"  popper-class="maxw-sel68">
                        <el-option v-for="category in templateCategory" :key="category.id" 
                                    :label="category.name"  
                                    :value="category.id" :title="category.name">
                        </el-option>   <!-- 名称长度限制 -->
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.cover')+'：'" class="form-list-normal " prop="cover">
                    <el-upload list-type="picture" :action='uploadImgUrl' :show-file-list="true" ref="uploadCoverImg"
                                name="file"
                                accept=".png,.jpg,.jpeg,.gif"
                                :file-list="coverImgList" 
                                :on-change="changeCoverImg"
                                :on-remove="handleRemoveCover"
                                :on-success="handleUploadImageSuccess">
                        <el-button type="primary" class="el-button02"><i class="iconfont icon-shangchuan vam mr10"></i>{{$t('message.upload')}}</el-button>
                        <el-tooltip placement="right">
                            <div slot="content" class="tip-content">
                                <p>{{$t('message.uploadPictureFormatTip')}}</p>
                                <p>{{$t('message.uploadPictureSizeTip')}}</p>
                            </div>
                            <i class="iconfont icon-iconfonticonfonticon4"></i>
                        </el-tooltip>
                    </el-upload>
                </el-form-item>
                <el-form-item class="btn-group form-list-mb0" v-if="showOrigin" prop="originCover">
                    <p tabindex="0" class="el-upload-list__item is-success">
                        <img :src="computeCoverSrc(curTemplate.fileCodeCover)" alt="" class="el-upload-list__item-thumbnail">
                        <a class="el-upload-list__item-name"></a>
                        <i class="el-icon-close" @click="removeOriginCover"></i>
                    </p>
                </el-form-item>
                <el-form-item :label="$t('message.content')+'：'" class="form-list-normal form-list-required mlno-requ" 
                    prop="contentFile" v-show="isCreate">
                    <el-upload :action="acceptType=='.docx,.doc'?uploadFileUrl:uploadImgUrl" 
                                :show-file-list="false"  
                                :before-upload="beforeContentFileUpload" 
                                :on-success="handleUploadFileSuccess" 
                                :on-error="handleUploadFileError" 
                                :on-progress="handleUploadFileProgress"
                                :accept="acceptType">
                        <el-button type="primary" class="el-button02">
                        <i class="iconfont icon-shangchuan vam mr10"></i>{{$t('message.upload')}}</el-button>
                        <el-tooltip placement="right">
                            <div slot="content" class="tip-content">
                                <h3>{{$t('message.upLoadDocTip')}}</h3>
                                <div class="tip-list" v-if="curTemplate?curTemplate.type===1:willCreateFileOrTemplateType==1">
                                <p>1.{{$t('message.uploadDocFormatTip')}}</p> 
                                <p>2.{{$t('message.uploadDocGenerateTip')}}</p>
                                <p>3.{{$t('message.uploadDocSizeTip')}}</p>
                                <p>4.{{$t('message.uploadDocStructureTip')}}</p>
                                </div>
                                <div class="tip-list" v-if="curTemplate?curTemplate.type===2:willCreateFileOrTemplateType==2">
                                <p>1.{{$t('message.uploadMindFormatTip')}}</p>
                                <p>2.{{$t('message.uploadDocSizeTip')}}</p>
                                </div>
                                <div class="tip-list" v-if="curTemplate?curTemplate.type===3:willCreateFileOrTemplateType==3">
                                <p>1.{{$t('message.uploadPPTFormatTip')}}</p>
                                <p>2.{{$t('message.uploadDocSizeTip')}}</p>
                                </div>
                                <div class="tip-list" v-if="curTemplate?curTemplate.type===4:willCreateFileOrTemplateType==4">
                                <p>1.{{$t('message.uploadExcelFormatTip')}}</p>
                                <p>2.{{$t('message.uploadDocSizeTip')}}</p>
                                </div>
                            </div>
                            <i class="iconfont icon-iconfonticonfonticon4"></i>
                        </el-tooltip>
                    </el-upload>
                </el-form-item>
                <el-form-item class="btn-group btn-group-mt" v-if="isCreate&&isImportContent" prop="contentFileLoadState">
                    <p class="text-left">
                        <span class="mr30 color-9 font-s12">
                            <svg class="icon icon-m" aria-hidden="true">
                                <!-- #icon-ppt-m -->
                                <use :xlink:href="docTypeClass"></use>
                            </svg>
                            {{uploadedContentfileName}}
                            </span>
                        <span class="upload-img upload-suc mr30" v-if="checkFileState">{{$t('message.uploadSuccess')}}</span>
                        <span class="upload-img upload-wrg mr30" v-else>{{$t('message.uploadFail')}}</span>
                    </p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitAddOrEditTemplate('newTemplateForm')">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelAddOrEditTemplate">{{$t('message.cancel')}}</el-button>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { mapState} from "vuex";
import validateFormRule from 'root/utils/validateFormRule';
import validateUploadImg from 'root/utils/validateUploadImg';
import templateApi from 'root/api/templateApi';
import documentsApi from 'root/api/documentsApi';
export default { 
    name:'CreateOrEditTemplate',
    mixins: [validateFormRule,validateUploadImg],
    props:['editType','willCreateFileOrTemplateType'],
    data(){
        return{
            editOrCreateVisible:false,
            newTypeName:'',//新建模板的类型
            newType:'',//新建模板的类型
            uploadImgUrl:'/creation/fileOperation/upload',
            uploadFileUrl: '/creation/fileOperation/uploadAddTask',
            newTemplateForm:{
                name: '',
                templateAttribute: '0',
                templateClassify: ''
            },
            isCreate:true,//表示新建或者编辑模板
            classifyShow:false,  //显示模板分类
            fileCodeImg:'',  //新建上传图片返回的值，编辑时原有的封面
            fileCodeXML:'',//新建上传的内容文档的数据，编辑时原有的内容数据
            coverImgList:[],//上传的封面数据
            cloudModel:window.cloudModel,
            //新建表单验证规则
            rules: {
                name: [
                    {validator: this.invalidCharacter, trigger: 'change'}
                ]
            },
            showOrigin:false,//编辑模板，展示圆模板的封面图片
            uploadedContentfileName:'',    //上传的内容文档名称
            docTypeClass:'',   //上传文档类型的图标
            checkFileState:true,//上传内容文档成功
            isImportContent:false,//是否上传了文档
            checkPercentage:4,
        }
    },
    computed: {
        ...mapState('templatesModule',['templateCategory','curTemplate']),
        //新建的时候有管理权限的展示模板属性
        showTemplateAttr(){
            return true;// window.manageContentTemplate;
        },
        isAdmin () {
            return window.isAdmin === "True";
        },
        dialogTitle(){
            if(!this.isCreate) return this.$t('message.edit',{'typeName':this.$t('message.template').toLowerCase()});;
            return this.$t('message.create',{'typeName':this.newTypeName.toLowerCase()});
        },
        //根据新建模板的类型获取可上传文档的类型
        acceptType(){
            let type=!this.isCreate?this.curTemplate.type:this.newType;
            switch(type){
                case 1:
                    this.docTypeClass='#icon-word-m';
                    this.newTypeName=this.$t('message.docTemplate');
                    return '.docx,.doc';
                case 2:
                    this.docTypeClass='#icon-mind-m';
                    this.newTypeName=this.$t('message.mindmapTemplate');
                    return '.xmind,.km,.md,.mm,.mmap';
                case 3:
                    this.docTypeClass='#icon-ppt-m';
                    this.newTypeName=this.$t('message.pptTemplate');
                    return '.ppt,.pptx';
                case 4:
                    this.docTypeClass='#icon-xls-m';
                    this.newTypeName=this.$t('message.excelTemplete');
                    return '.xls,.xlsx';
            }
        },
    },
    methods:{
        //模板封面
        computeCoverSrc(fileCodeCover) {
            if (fileCodeCover) {
                return (`${window.applicationPath}/fileOperation/download?fileCode=${fileCodeCover}&fileName=${this.curTemplate.templateName}`);
            } 
        },
        //选择模板属性
        selectTemplateAttribute(value){
            this.newTemplateForm.templateClassify = "";
            this.classifyShow =value == 1? true:false;
        },
        //上传内容文档
        beforeContentFileUpload (file) {
            let regAry=this.acceptType.split(',');
            let suffixName=file.name.split('.')[file.name.split('.').length-1];
            if (regAry.indexOf(('.'+suffixName))===-1) {
                this.$message({
                    message: this.$t('message.notSupport'),
                    type: 'warning'
                });
                return false;
            }
            if (file.size == 0) {
                this.$message({
                    message: self.$t('message.emptyDoc'),
                    type: 'warning'
                });
                return false;
            }
            if (file.size > 100 * 1024 * 1024) {
                this.$message({
                    message: self.$t('message.uploadDocSizeTip'),
                    type: 'warning'
                });
                return false;
            }
            let suffixLength = file.name.split('.')[file.name.split('.').length - 1].length;
            let docName = file.name.substr(0, (file.name.length - suffixLength - 1));
            let length = docName.length;
            if (length > 100) {
                this.$message({
                    message: self.$root.$t('message.docNameLen'),
                    type: 'warning'
                });
                return false;
            }
            return true;
        },
        //文档上传成功后转换文档
        handleUploadFileSuccess(response, file, fileList){
            if (response.success) {
                if(!/(\.|\/)(docx|doc)$/ig.test(file.name)){
                    this.fileCodeXML = response.content;
                    this.isImportContent = true;
                    this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.uploading') + " 100%"});
                    return;
                }
                this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.uploading') + " 2%"});
                this.fileCodeXML = response.content.fileCodeWord;
                this.checkFile({convertTaskId: response.content.taskId});
            }
        },
        checkFile(param){
            documentsApi.checkConvertStateRequest(param).then((data)=>{
                if(data==4){
                    this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.uploading') + " 100%"});
                    this.isImportContent=true;
                    this.$store.commit('changeLoading',{loading:false,loadingTxt:''});
                }else if(data<0){
                    this.$message.error(this.$t('message.TransferFail'));
                    this.checkFileState = false;
                }else{
                    if(this.checkPercentage < 94) this.checkPercentage += 4;
                    this.$store.commit('changeLoading',{loading:true,loadingTxt:`${this.$t('message.uploading')} ${this.checkPercentage}%`});
                    setTimeout(()=>{
                        this.checkFile(param);
                    }, 3000);
                }
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
                this.checkFileState=false;
            });
        },
        //文档上传失败
        handleUploadFileError(){
            this.$store.commit('changeLoading',{loading:false,loadingTxt:''});
        },
        //文档上传中
        handleUploadFileProgress(file, fileList){
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.uploading')});
            this.uploadedContentfileName = fileList.raw.name;
        },
         //上传图片成功
        handleUploadImageSuccess(response){
            if (response.success) {
                this.fileCodeImg = response.content;
            }
        },
        //删除封面图片
        handleRemoveCover(file, fileList){
            $("[name='fileCover']").val('');
            this.coverImgList =fileList;
            this.$refs.uploadCoverImg.clearFiles();
            this.fileCodeImg=this.curTemplate.fileCodeCover;
            this.fileCodeImg?this.showOrigin=true:null;
        },
        //编辑的时候移除原有的封面
        removeOriginCover(){
            this.fileCodeImg='';
            this.showOrigin=false;
        },
        //新建文档内容模板确认事件
        submitAddOrEditTemplate(formName){
            this.$refs[formName].validate( (valid)=>{
                if (valid) {
                    if (this.isCreate&&!this.isImportContent) {
                        this.$message({
                            showClose: true,
                            message: this.$t('message.afterImport'),
                            type: 'warning'
                        });
                        return;
                    }
                    this.$store.commit('changeLoading',{loading:true,loadingTxt:''});
                    let file={
                        id:this.isCreate?'':this.curTemplate.id,
                        templateName:this.newTemplateForm.name.trim(),
                        ifPublic:this.cloudModel?0:this.newTemplateForm.templateAttribute,
                        fileCode:!this.isCreate?this.curTemplate.fileCode:this.fileCodeXML,
                        fileCodeCover:this.fileCodeImg,
                        categoryId:this.newTemplateForm.templateClassify,
                        type:!this.isCreate?this.curTemplate.type:this.newType
                    };
                    this.isCreate?this.addTemplate(file):this.updateTemplate(file);
                } else {
                    return false;
                }
            }); 
        },
        //确认新建模板
        addTemplate(param){
            templateApi['addTemplateRequest'](param).then((data)=>{
                this.cancelAddOrEditTemplate();
                this.$emit('handdleSuccess',{msg:this.$t('message.newSuccess'),ifReload:false});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //确认编辑模板
        updateTemplate(param){
            templateApi['updateTemplateRequest'](param).then((data)=>{
                this.cancelAddOrEditTemplate();
                this.$emit('handdleSuccess',{msg:this.$t('message.editSuccess'),ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //重置表单
        initForm(formName){
            this.$refs['newTemplateForm'].clearValidate();
            this.$refs['newTemplateForm'].resetFields();
            this.isCreate=true;
            this.coverImgList=[];
            this.showOrigin=false;
        },
        //取消新建或编辑
        cancelAddOrEditTemplate(){
            this.initForm();
            this.editOrCreateVisible = false;
            this.uploadedContentfileName='';
        },
        //编辑模板绑定默认数据
        setEditFormData(){
            this.fileCodeImg=this.curTemplate.fileCodeCover;
            this.fileCodeXML = this.curTemplate.fileCodeXml;
            this.newTemplateForm.name=this.curTemplate.templateName;
            this.newTemplateForm.templateAttribute = this.curTemplate.ifPublic.toString();
            this.selectTemplateAttribute(this.curTemplate.ifPublic);
            this.newTemplateForm.templateClassify=this.curTemplate.categoryId;
            this.coverImgList[0]=this.curTemplate.fileCodeCover;
            this.fileCodeImg?this.showOrigin=true:null;
        }
    },
    watch:{
        isCreate:{
            handler(val){
                if(!val){
                    this.setEditFormData();
                }
            },
            immediate:true
        }
    }
}
</script>
<style>
.el-upload-list__item{text-align: left;height:unset!important;}
.el-upload-list__item .el-upload-list__item-thumbnail{width:15vh;height:15vh}
</style>

