import request from './request.js';
const knowledgeLibraryApi={
    //获取知识分类
    getKnowledgeClassifyRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //编辑知识分类
    editKnowledgeClassifyRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //删除知识分类
    deleteKnowledgeClassifyRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //新建知识分类
    addKnowledgeClassifyRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取知识库文档
    getKnowledgeDocumentsRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //删除知识库文档
    deleteKnowledgeFileRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //编辑知识库文档
    editKnowledgeRequest(param){
        return request({
            url:'/project/getCooperations',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    }

}
export default knowledgeLibraryApi;