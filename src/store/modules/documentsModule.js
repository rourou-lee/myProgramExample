/*jshint esversion: 6*/ 

const documentsModule={
    namespaced:true,
    state:{
        highlightFirst:'folder',//file表示高亮文件第一个，folder表示高亮文件夹第一个
        folderNames:[],//面包屑文件夹
    },
    mutations:{
        //改变面包屑缓存
        changeFolderName(state,data){
            if(data.ifAdd){
                state.folderNames.push(data.folder);
            }else{
                state.folderNames=state.folderNames.filter((item,index1)=>{
                    return index1<=data.index;
                });
            }
            sessionStorage.setItem('folderNames', JSON.stringify(state.folderNames));
        },
        setFolderName(state,data){
            state.folderNames=data;
            sessionStorage.setItem('folderNames', JSON.stringify(state.folderNames));
        },
        //改变高亮展示的类型
        setHighlightFirst(state,val){
            state.highlightFirst=val;
        },
        
    },
    actions:{}
};
export default documentsModule;