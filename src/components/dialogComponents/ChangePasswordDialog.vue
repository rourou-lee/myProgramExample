<template>
    <el-dialog title="修改密码" :visible="changePasswordVisible" class="avatar-dialog password-dialog"
                :close-on-click-modal="false" @close="cancelChangePassword('passwordForm')">
        <div class="avatar-dialog-con">
            <el-form label-width="95px" ref="passwordForm" :rules="passwordRules" :model="passwordForm" class="passwordForm">
                <el-form-item label="原密码:" required >
                    <el-input v-model.trim="passwordForm.originPassword" show-password autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码:" required>
                    <el-input v-model.trim="passwordForm.newPassword" show-password autocomplete="off" placeholder="6-16位，包含字母和数字"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码:" required>
                    <el-input v-model.trim="passwordForm.sureNewPassword" show-password autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div slot="footer" class="avatar-dialog-footer">
            <el-button type="primary" @click="submitChangePassword('passwordForm')">{{$t('message.sure')}}</el-button>
            <el-button @click="cancelChangePassword('passwordForm')">{{$t('message.cancel')}}</el-button>
        </div>
    </el-dialog>
</template>
<script>
import userInfoApi from 'root/api/userInfoApi';
import {encryptStr} from 'root/utils/utils.js';
export default {
    name:'ChangePasswordDialog',
    data(){
        return {
            changePasswordVisible:false,
            passwordForm:{
                originPassword:'',
                newPassword:'',
                sureNewPassword:''
            },
            passwordRules:{
                originPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],//{ validator: validateOriginPassword, trigger: 'change' },
                newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: this.validateNewPassword, trigger: 'blur' }],
                sureNewPassword: [{ required: true, message: '再次确认密码', trigger: 'blur' },
                    { validator: this.validateSureNewPassword, trigger: 'blur' }],
            }
        }
    },
    methods:{
        validateOriginPassword(rule, value, callback){
            if (!value) {
                callback(new Error('请输入原始密码'));
                return;
            } 
            userInfoApi.vertifyOldPassword(value).then((data) => {
                if (!data) {
                    callback(new Error('原始密码不正确'));  
                    return
                } 
                callback();
            })
        },
        validateNewPassword(rule, value, callback){
            if (!value) {
                callback(new Error('请输入新密码'));
            } else if (/^(?=.*[a-zA-Z])(?=.*\d)[\S]{6,16}$/.test(value)) {
                callback();
            } else {
                callback(new Error('密码为6-16位非空字符，必须包含字母和数字'));
            }
        },
        validateSureNewPassword(rule, value, callback){
            if (!value ) {
                callback(new Error('请确认新密码'));
            } else if (value !== this.password.newPassword) {
                callback(new Error('两次输入密码不一样'));
            } else {
                callback();
            }
        },
        //关闭弹框，取消修改密码
        cancelChangePassword(formName){
            this.$refs[formName].resetFields();
            this.$refs[formName].clearValidate();
            this.$nextTick(()=>{
                this.changePasswordVisible=false;
            })
        },
        //确定修改密码
        submitChangePassword(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.sureToChangePasswordSubmit(formName);
                } else {
                    return false;
                }
            });
        },
        sureToChangePasswordSubmit(){
            let param={
                userName:window.currentUser.userName,
                oldPassword:encryptStr(this.passwordForm.originPassword),
                newPassword:encryptStr(this.passwordForm.newPassword)
            }
            userInfoApi.changePasswordRequest(param).then(data=>{
                if(data) this.$message.success('密码修改成功！');
                this.cancelChangePassword('passwordForm');
            }).catch(error=>{
                this.$message.error(error.message);
            });
        }
    }
}
</script>