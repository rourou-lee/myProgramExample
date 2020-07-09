import request from './request.js';
const documentsApi={
    //获取我的文件
    getMyDocumentsRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //检索我的文件
    searchMyDocumentsRequest(param){
        return request({
            url:'/project/searchCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取最近打开
    getRecentlyOpenRequest(param){
        return request({
            url:'/project/getRecently',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取回收站
    getRecycleBinRequest(param){
        return request({
            url:'/project/getDeletes',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //删除空文件夹
    falseDelFolderRequest(param){
        return request({
            url:'/folder/falseDelete',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //删除文件
    falseDelFileRequest(param){
        return request({
            url:'/project/falseDelete',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //复制文档
    copyDocumentRequest(param){
        return request({
            url:'/project/addDocument',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //复制思维导图
    copyMindRequest(param){
        return request({
            url:'/project/addMind',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //复制ppt excel
    copyPPTExcelRequest(param){
        return request({
            url:'/project/addOnlineOffice',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //转换
    convertDocRequest(param){
        return request({
            url:'/project/fileConvert',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //导入word转换
    convertFileRequest(param){
        return request({
            url:'/fileOperation/convertFile',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    checkConvertStateRequest(param){
        return request({
            url:'/fileOperation/getConvertStatus',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //下载ppt eXcel获取filecode
    getOnlineEditorFileCode(param){
        return request({
            url:'/project/getOnlineEditorFilecode',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //新建文件夹
    createFolderRequest(param){
        return request({
            url:'/folder/add',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //重命名文件夹
    reNameFolderRequest(param){
        return request({
            url:'/folder/update',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //重命名文件
    reNameFileRequest(param){
        return request({
            url:'/project/rename',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取所有文件夹
    getFoldersRequest(param){
        return request({
            url:'/folder/gets',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //移动文件
    moveFileRequest(param){
        return request({
            url:'/project/moveProject',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //回收站删除文件夹
    completeDeleteFolderRequest(param){
        return request({
            url:'/folder/delete',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //回收站还原文件夹
    completeRestoreFolderRequest(param){
        return request({
            url:'/folder/revert',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //回收站删除文件
    completeDeleteFileRequest(param){
        return request({
            url:'/project/trueDelete',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //回收站还原文件
    completeRestoreFileRequest(param){
        return request({
            url:'/project/revert',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取文档成员信息
    getFilePersonRequest(param){
        return request({
            url:'/project/getProjectPerson',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取机构成员
    getOrganizationalMembersRequest(){
        return request({
            url:'/user/getMembersOfOrgination',
            method:'get'
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取群组成员
    getGroupMembersRequest(param){
        return request({
            url:'/user/getGroupsAndMembers',
            method:'get'
        }).catch((error)=>{
            throw new Error();
        });
    },
    //修改创作成员
    changePartManRequest(param){
        return request({
            url:'/project/changePartMen',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //退出创作
    quitCreationRequest(param){
        return request({
            url:'/project/quit',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //修改负责人
    changeChargeManRequest(param){
        return request({
            url:'/project/changeChargeMan',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //阅读模板快速新建
    useTemAddOnlineOfficeRequest(param){
        return request({
            url:'/project/addCooperation',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //下载思维导图
    downLoadMindRequest(param){
        return request({
            url:'/fileOperation/download',
            method:'get',
            data:param,
            responseType:'blob'
        }).catch((error)=>{
            throw new Error();
        });
    },
}
export default documentsApi;