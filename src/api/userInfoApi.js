import request from './request.js';
const userInfoApi={
    //确定上传头像
    submitUploadAvatarRequest(param){
        return request({
            url:'/contentTemplate/update',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //修改密码
    changePasswordRequest(){
        return request({
            url:'/contentTemplate/update',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    }

}
export default userInfoApi;