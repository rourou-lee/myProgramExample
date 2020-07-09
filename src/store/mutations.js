const mutations={
    //修改loading状态
    changeLoading(state,data){
        state.loading=data.loading;
        state.loadingTxt=data.loadingTxt;
    },
    //导入导图内容，初始化编辑器
    initEditor(state){
        zip.inflateJSPath = `${window.applicationPath}/static/plugins/inflate.js`;
        seajs.config({
            charset: 'utf-8',
            preload: [
                Function.prototype.bind ? '' : 'es5-safe',
                'json'
            ]
        });
        seajs.use(`${window.applicationPath}/static/plugins/editor/editor.js`, (Editor)=>{
            state.editor = new Editor(document.getElementById('minder-view'));
        });
    },
    //获取到知识分类后保存
    setKnowledgeClassify(state,data){
        state.knowledgeClassifyAry=data;
    },
    //获取到文档分类后保存
    setKnowledgeClassify(state,data){
        state.documentClassifyAry=data;
    },
    //删除知识分类的某一个
    deleteKnowledgeClassify(state,classify){
        state.knowledgeClassifyAry=state.knowledgeClassifyAry.filter((item)=>{
            return item.id!==classify.id;
        });
    },
    //删除文档分类的某一个
    deleteDocumentClassify(state,classify){
        state.documentClassifyAry=state.documentClassifyAry.filter((item)=>{
            return item.id!==classify.id;
        });
    },
    
}
export default mutations;