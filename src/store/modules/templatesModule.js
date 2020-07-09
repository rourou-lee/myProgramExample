/*jshint esversion: 6*/ 

import documentsApi from 'root/api/documentsApi';
import templateApi from 'root/api/templateApi';
import i18n from 'root/i18n/index';
const templatesModule={
    namespaced:true,
    state:{
        templateCategory:[],//模板分类
        templates:[],//
        templatesCount:0,//模板总数
        templateInfo:{},//阅读模板的详细信息
        curTemplate:{},//当前阅读模板
    },
    getters:{
        //下载完成导入思维导图内容
        mindType:(state)=>{
            let filetype = state.curTemplate.fileCode.split('.')[state.curTemplate.fileCode.split('.').length - 1];
            let type='';
            switch (filetype) {
                case 'km':
                    type= "json";
                    break;
                case 'md':
                    type = "markdown";
                    break;
                case 'mm':
                    type = "freemind";
                    break;
                case 'xmind':
                    type = "xmind";
                    break;
                case 'mmap':
                    type = "mindmanager";
                    break;
            }
            return type;
        }
    },
    mutations:{
        //模板分类
        setTemplateCategory(state,data){
            data.forEach((item)=>{
                item.edited=false;
            });
            state.templateCategory=[...data];
        },
        //模板
        setTemplates(state,data){
            state.templates=state.templates.concat(data.list);
            state.templatesCount=data.total;
        },
        //清空模板
        clearTemplates(state,data){
            state.templates=data.list;
            state.templatesCount=data.total;
        },
        //删除模板
        deleteTemplates(state,id){
            state.templates=state.templates.filter((item)=>{
                return item.id!==id;
            });
            state.templatesCount--;
        },
        //阅读模板详细信息
        setTemplateInfo(state,data){
            state.templateInfo=data;
        },
        //当前模板
        setCurTemplate(state,template){
            state.curTemplate=template;
        }
    },
    actions:{
        //获取模板信息
        getTemplateInfo({commit},param){
            return new Promise((resolve,reject)=>{
                templateApi.getTemplateInfoRequest(param).then((data)=>{
                    commit('setTemplateInfo',data);
                    resolve(true);
                }).catch(error=>{
                    reject(error);
                });
            });
        },
        //使用思维导图模板
        uesMindAddCreation({state,dispatch}){
            return new Promise((resolve,reject)=>{
                documentsApi.downLoadMindRequest({
                    fileCode:state.curTemplate.fileCode,
                    fileName:state.curTemplate.templateName
                }).then((data)=>{
                    dispatch('haddleDowloadedMindFile',data).then((data)=>{
                        resolve(data);
                    })
                }).catch(error=>{
                    throw new Error();
                });
            });
        },
        //处理下载的思维导图
        haddleDowloadedMindFile({state,dispatch,getters},file){
            return new Promise((resolve,reject)=>{
                switch (getters.mindType) {
                    case 'json':
                    case 'markdown':
                    case 'freemind':
                        dispatch('importAsync',{file,type:getters.mindType}).then((data)=>{
                            resolve(data);
                        }).catch(error=>{
                            reject(error);
                        });
                        break;
                    case 'xmind':
                    case 'mmap':
                        dispatch('importSync',{
                            content:file,
                            type:getters.mindType
                        }).then((data)=>{resolve(data);}).catch(error=>{
                            reject(error);
                        });
                        break;
                }
            });
        },
        //思维导图类 一步导入{file:file,name:name, type:type}
        importAsync({dispatch,getters},param){
            return new Promise((resolve,reject)=>{
                let reader = new FileReader();
                reader.onload =(data)=>{
                    dispatch('importSync',{
                        content:data.target.result== ""?i18n.t('message.mindTheme'):data.target.result,
                        type:param.type
                    }).then((data)=>{
                        resolve(data);
                    }).catch(error=>{
                        reject(error);
                    });
                };
                reader.readAsText(param.file, 'utf-8');
            });
        },
        importSync({state},param){
            return new Promise((resolve,reject)=>{
                this.state.editor.minder.importData(param.type, param.content).then((data)=>{
                    resolve(JSON.stringify(data));
                }, (error)=>{
                    reject(error);
                });
            });
        },
    }
};
export default templatesModule;