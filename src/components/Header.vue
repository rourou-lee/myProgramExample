<template>
    <div>
        <el-header class='first-header'>
            <el-row type="flex" class="row-bg" justify="space-between">
                <el-col :span="9">
                    <div class="header-left el-menu--horizontal el-menu">
                        <span>CETC</span>
                        <span class="title-txt">竞标文档智能合作服务平台</span>
                    </div>
                </el-col>
                <el-col :span="6">
                    <el-menu class="header-menu" mode="horizontal" v-on:select="handleSelectTopType" v-bind:default-active="activeTopType" router v-cloak>
                        <el-menu-item index="/documentsIndex" >首页</el-menu-item>
                        <el-menu-item index="/templatesIndex">模板</el-menu-item>
                        <el-menu-item index="/documentsLibraray" >文档库</el-menu-item>
                        <el-menu-item index="/knowledgeLibraray">知识库</el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="9" class="header-right-col">
                    <div class="header-right el-menu--horizontal el-menu">
                        <span class="chat-txt">
                            <i class="iconfont iconchat"></i>
                            im聊天
                        </span>
                        <span>
                            <el-dropdown trigger="click" @command="setUserInfo">
                                <span>
                                    <img :src="currentUser.logo" alt="" class="head-img"><i class="iconfont icondown"></i> <!-- iconup -->
                                </span>
                                <el-dropdown-menu slot="dropdown" class="set-user-Info-menu">
                                    <el-dropdown-item command="setAvatar"><i class="iconfont iconpersonal"></i>头像设置</el-dropdown-item>
                                    <el-dropdown-item command="changePassword"><i class="iconfont iconpassword"></i>修改密码</el-dropdown-item>
                                    <el-dropdown-item command="manageBack"><i class="iconfont iconbackstage"></i>管理后台</el-dropdown-item>
                                    <el-dropdown-item command="quitLogin"><i class="iconfont iconsignout"></i>退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </span>
                    </div>
                </el-col>
            </el-row>
        </el-header>
        <SetAvatarDialog ref="setAvatar"/>
        <ChangePasswordDialog ref="changePassword"/>
    </div>
    
</template>
<script>
import{mapState} from 'vuex';
import SetAvatarDialog from 'root/components/dialogComponents/SetAvatarDialog';
import ChangePasswordDialog from 'root/components/dialogComponents/ChangePasswordDialog';
export default {
    name:'Header',
    components:{SetAvatarDialog,ChangePasswordDialog},
    data(){
        return {
            activeTopType:'documentsIndex',
            currentUser:window.currentUser,
        }
    },
    computed:{
        ...mapState(['loadingHome'])
    },
    methods:{
        //点击顶部导航
        handleSelectTopType(index, indexPath){
            if (this.loadingHome||this.activeTopType == index) return;
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
            this.$store.commit('documentsModule/setFolderName',[]);
            this.activeTopType = index;
        },
        //点击头像设置个人信息
        setUserInfo(command){
            switch(command){
                case 'setAvatar':
                    this.$refs['setAvatar'].setAvatarVisible=true;
                    break;
                case 'changePassword':
                    this.$refs['changePassword'].changePasswordVisible=true;
                    break;
                case 'manageBack':
                    break;
                case 'quitLogin':
                    break;
            }
        }
    },
    mounted(){
        this.activeTopType=`/${this.$route.fullPath.split('/')[1]}`
    },
    watch:{
        $route(to,from){
            this.activeTopType=`/${to.fullPath.split('/')[1]}`;
            //刷新页面时从缓存中拿出文件夹关系
            var folders= sessionStorage.getItem('folderNames')!=='undefined' ? JSON.parse(sessionStorage.getItem('folderNames')) : [];
            this.$store.commit('documentsModule/setFolderName',folders);
        }
    }
}
</script>