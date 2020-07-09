import request from './request.js';
const docLibraryApi={
    //获取文档分类
    getDocumentClassifyRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //编辑文档分类
    editDocumentClassifyRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //删除文档分类
    deleteClassifyRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //新建文档分类
    addDocClassifyRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取文档库文档
    getLibraryDocumentsRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //删除文档库文档
    DeleteLibraryDocRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //编辑文档库文档
    editLibraryDocRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    }

}
export default docLibraryApi;