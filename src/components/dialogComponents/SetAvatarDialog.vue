<template>
    <el-dialog title="头像设置" :visible="setAvatarVisible" class="avatar-dialog"
                :close-on-click-modal="false" :before-close="cancelSetAvatar">
        <div class="avatar-dialog-con">
            <el-upload class="upload-avatar"
                accept=".png,.jpg,.jpeg,.gif"
                :action="uploadImgUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :on-change="changeCoverImg">
                <el-button size="small" type="primary" class="upload-avatar-btn">
                    <i class="iconfont iconupload"></i>
                    上传本地图片
                </el-button>
            </el-upload>
            <div class="avatar-img-show">
                <img :src="avatarUrl" alt="" class="avatar-img" ref="avatar-img">
                <!-- <svg class="mask-cirle">
                    <circle cx="95" cy="95" r="115" style="fill:none;stroke-width:40px;stroke: black;"/>
                </svg> -->
            </div>
        </div>
        <div slot="footer" class="avatar-dialog-footer">
            <el-button type="primary" @click="submitSetAvatar">{{$t('message.sure')}}</el-button>
            <el-button @click="cancelSetAvatar">{{$t('message.cancel')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import Cropper from 'cropperjs';
import '../../../node_modules/cropperjs/dist/cropper.css'
//  <link href="../../../node_modules/cropperjs/src/css/cropper.css"></link>
import validateUploadImg from 'root/utils/validateUploadImg';
import userInfoApi from 'root/api/userInfoApi'
export default {
    name:'SetAvatarDialog',
     mixins: [validateUploadImg],
    data(){
        return {
            setAvatarVisible:false,
            uploadImgUrl:'/creation/fileOperation/upload',
            defaultAvatatrUrl:require('root/assets/images/default-avatar.png'),
            avatarUrl:window.currentUser.logo,// require('root/assets/images/login-left.png'),//上传的头像图片
            fileCodeImg:'',
            myCropper:null,//裁剪插件
        }
    },
    methods:{
        //关闭弹框，取消设置头像
        cancelSetAvatar(){
            this.fileCodeImg='';
            this.avatarUrl=currentUser.logo||this.defaultAvatatrUrl;
            this.setAvatarVisible=false;
        },
        //确定设置头像
        submitSetAvatar(){
            // this.myCropper.getCroppedCanvas({
            //     imageSmoothingQuality: 'high'
            // }).toDataURL('image/jpeg')
            // this.myCropper.getCroppedCanvas().toBlob((blob) => {
            //     formData.append('croppedImage', blob,'example.png');
            //     $.ajax('/path/to/upload', {
            //         method: 'POST',
            //         data: formData,
            //         processData: false,
            //         contentType: false,
            //         success() {
            //             console.log('Upload success');
            //         },
            //         error() {
            //             console.log('Upload error');
            //         },
            //     });
            // }/*, 'image/png' */);
            userInfoApi.submitUploadAvatarRequest({param}).then(()=>{

            })
        },
        //图片上传成功
        handleAvatarSuccess(response, file) {
            if (response.success) {
                this.fileCodeImg = response.content;
                this.avatarUrl = URL.createObjectURL(file.raw);
            }
        },
        //删除封面图片
        handleRemoveCover(file, fileList){
            this.fileCodeImg='';
            this.avatarUrl=window.currentUser.logo;
        },
        //初始化上传插件
        initUploadPlugin(){
            this.myCropper = new Cropper(this.$refs['avatar-img'], {
                viewMode: 1, //限制裁剪框不能超出图片的范围
                dragMode: 'none',  //- crop 形成新的裁剪框- move 图片可移动- none 什么也没有
                initialAspectRatio: 1,  //裁剪框宽高比的初始值 默认与图片宽高比相同 只有在aspectRatio没有设置的情况下可用
                aspectRatio: 1,  //设置裁剪框为固定的宽高比
                //preview: '.before',  //预览 设置一个区域容器预览裁剪后的结果
                background: false,  //是否在容器内显示网格状的背景 默认true
                autoCropArea: 0.5,  //设置裁剪区域占图片的大小 值为 0-1 默认 0.8 表示 80%的区域
                zoomOnWheel: false,  //是否可以通过鼠标滚轮缩放图片 默认true
                autoCrop:true,
                ready() {
                    $('.cropper-view-box').css({'border-radius':'50%'});
                },
            });
        }
    },
    watch:{
        setAvatarVisible:{
            handler(val){
                if(val){
                    this.$nextTick(()=>{
                        this.initUploadPlugin();
                    })
                }
            },
            immediate:true
        }
    }
}
</script>

