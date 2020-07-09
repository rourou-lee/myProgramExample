<template>
    <el-dialog :title="$t('message.moveTo')" :visible="moveToVisible" 
                :close-on-click-modal="false" :before-close="cancelMoveFile">
            <div class="dialog-con">
                <ul class="ztree">
                    <el-tree id="eltree" ref="folderTree" node-key="id"
                            highlight-current
                            @node-click="selectMoveToFolder"
                            :default-expand-all="true"
                            :check-strictly="true"
                            :expand-on-click-node="false"
                            :data="folderData"
                            :props="folderdefaultProps"
                            :render-content="moveToRenderCon">
                    </el-tree>
                </ul>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitMoveFile">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelMoveFile">{{$t('message.cancel')}}</el-button>
            </div>
        </el-dialog>
</template>
<script>
import documentsApi from 'root/api/documentsApi.js';
import {formatDataToTree} from 'root/utils/utils.js';
export default {
    name:'MoveToDialog',
    props:['curOperateFile'],
    data(){
        return {
            moveToVisible:false,
            folderdefaultProps:{  //移动到的文件夹树状属性
                children: 'children', label: 'name'
            },
            folderData:[{ name: this.$t('message.root'), children: [],id:''}], 
        }
    },
    methods:{
        //获取所有文件夹
        getFolders(){
            documentsApi.getFoldersRequest({creationType:1}).then((data)=>{
                this.haddleFolder(data);
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //将文件夹数组整合成树形
        haddleFolder(data){
            this.folderData[0].children=[];
            data.sort( (a, b)=>{
                return a.createTime - b.createTime;
            });
            formatDataToTree(data, this.folderData[0], this.curOperateFile);
        },
        submitMoveFile(){
            if (!this.$refs['folderTree'].getCurrentNode()) {
                this.$message({
                    message: this.$t('message.selectFolder'),
                    type: 'warning'
                });
                return;
            }
            let folder;
            if (!this.$refs['folderTree'].getCheckedKeys().length && !this.$refs['folderTree'].getCurrentNode().id) {
                folder=this.$refs['folderTree'].getCurrentNode();
            }else if(this.$refs['folderTree'].getCheckedKeys().length){
                folder=this.$refs['folderTree'].getCurrentNode();
            }else if(!this.$refs['folderTree'].getCheckedKeys().length){
                folder=null;
            }
            if (!folder) {
                this.$message({
                    message: this.$t('message.selectFolder'),
                    type: 'warning'
                });
                return;
            }
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
            if (folder.name == 'root') folder = { id: '' };
            this.curOperateFile.parentId = folder.id;
            if(this.curOperateFile.folder){
                this.moveFolder();
            }else{
                this.moveFile();
            }
        },
        //移动文件夹
        moveFolder(){
            let param={
                id: this.curOperateFile.id,
                name:this.curOperateFile.name,
                parentId: this.curOperateFile.parentId
            }
            documentsApi.reNameFolderRequest(param).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.moveSuccess'),highlightType:'folder',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.moveToVisible=false;});
        },
        //移动文件
        moveFile(){
            let param={
                id: this.curOperateFile.id,
                folderId: this.curOperateFile.parentId
            }
            documentsApi.moveFileRequest(param).then((data)=>{
                if(data) this.$emit('handdleSuccess',{msg:this.$t('message.moveSuccess'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{this.moveToVisible=false;});
        },
         //取消移动文件
        cancelMoveFile(){
            this.moveToVisible=false;
        },
        //选择要移动到的文件夹
        selectMoveToFolder(folder,node){
            this.$refs['folderTree'].setChecked(folder.id, !node.checked, true);
        },
        moveToRenderCon(h, obj) {
            let self = this;
            return h('span', [
                h('i', {
                    'class': 'iconfont icon-wenjianjia1',
                }),
                h('span', {
                    'class': 'el-tree-node_label',
                    attrs: { 'title': obj.data.name, },
                    domProps: {
                        innerText: obj.data.name   //名称长度限制
                    }
                })
            ]);
        },
    },
    watch:{
        moveToVisible:{ 
            handler(val){
                if(!val) return;
                this.getFolders();
            },
            immediate: true
        }
    }
}
</script>

