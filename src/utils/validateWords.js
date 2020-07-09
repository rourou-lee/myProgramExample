export default {
    methods: {
        //验证检索词
        validateSearchKey(text){
            let reg = /['|"|<|>|#|%|\\|\/|:|\*|\?|\|]/g;
            let length = text.length;
            if (length > 200) {
                this.$message({
                    message: this.$t('message.characterLenTip'),
                    type: 'warning',
                    duration: 1500
                });
                return false;
            }
            if (text.length && reg.test(text)) {
                this.$message({
                    message: this.$t('message.searchKeyTip'),
                    type: 'warning',
                    duration: 1500
                });
                return false;
            }
            return true;
        },
        //获取文件后做排序和文件文件夹分离处理
        haddleData(data){
            if(!data.data.length) {
                this.fileList=[];
                this.emptyData=this.$t('message.noData');
                return;
            }
            let hightLightFile={};
            let files=data.data.filter((item)=>{
                return !item.folder;
            }).sort((a, b)=>{
                return a[data.orderBy]< b[data.orderBy]? 1 : -1;
            });
            let folders=data.data.filter((item)=>{
                return item.folder;
            }).sort( (a, b)=>{
                return a[data.orderBy] < b[data.orderBy] ? 1 : -1;
            });
            switch(this.highlightFirst){
                case 'file':
                    hightLightFile=files.length?files[0]:(folders.length?folders[0]:{});
                    break;
                case 'folder':
                    hightLightFile=folders.length?folders[0]:(files.length?files[0]:{});
                    break;
            }
            this.fileList=folders.concat(files);
            this.$refs.fileTable?this.$refs.fileTable.setCurrentRow(hightLightFile):null;
        },
    }
}