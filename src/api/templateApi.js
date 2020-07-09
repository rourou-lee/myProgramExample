import request from './request.js';
const templateApi={
    //获取模板分类
    getTemplateCategoryRequest(param){
        return request({
            url:'/templateCategory/gets',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //添加模板分类
    addTemplateCategoryRequest(param){
        return request({
            url:'/templateCategory/add',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //删除模板分类
    deleteTemplateCategoryRequest(param){
        return request({
            url:'/templateCategory/delete',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //编辑模板分类
    updateTemplateCategoryRequest(param){
        return request({
            url:'/templateCategory/update',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //获取模板
    getTemplatesRequest(param){
        return request({
            url:'/contentTemplate/gets',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //添加模板
    addTemplateRequest(param){
        return request({
            url:'/contentTemplate/add',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },

    //word转为xml
    convertWordToXmlRequest(param){
        return request({
            url:'/contentTemplate/word2Xml',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //另存为 ppt excel模板
    savePPTExcelRequset(param){
        return request({
            url:'/contentTemplate/saveAsTemplate',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //阅读模板，获取模板详细信息
    getTemplateInfoRequest(param){
        return request({
            url:'/contentTemplate/detail',
            method:'get',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //删除模板
    deleteTemplateRequest(param){
        return request({
            url:'/contentTemplate/delete',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    },
    //编辑模板
    updateTemplateRequest(param){
        return request({
            url:'/contentTemplate/update',
            method:'post',
            data:param
        }).catch((error)=>{
            throw new Error();
        });
    }
   
}
export default templateApi;