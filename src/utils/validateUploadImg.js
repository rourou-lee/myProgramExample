export default {
    methods: {
        //新建模板，或编辑模板，上传封面，验证图片
        changeCoverImg(file, fileList){
            if (!/image\/(png|jpg|jpeg|gif)$/gi.test(file.raw.type)) {
                this.$message({
                    message: self.$t('message.picTypeErroe'),
                    type: 'warning'
                });
                this.handleRemoveCover();
                return false;
            }
            let size = file.size / 1024;
            if (size > 1024 * 4) {
                this.$message({
                    message: self.$t('message.picSizeLarge'),
                    type: 'warning'
                });
                this.handleRemoveCover();
                return false;
            }
            if (size == 0) {
                this.$message({
                    message: self.$root.$t('message.picSizeSmall'),
                    type: 'warning'
                });
                this.handleRemoveCover();
                return false;
            }
            if(!this.coverImgList) return true;
            this.coverImgList[0]=file;
            this.showOrigin=false;
            return true;
        }
    }
}