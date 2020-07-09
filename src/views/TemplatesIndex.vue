<template>
    <el-container class="container">
        <el-aside class="left-sider" style="width:166px;">
            <el-dropdown trigger="click" @command="selectNewType">
                <el-button type="primary">{{$t('message.create',{'typeName':''})}}</el-button>
                <el-dropdown-menu slot="dropdown" class="select01">
                    <el-dropdown-item command="docContentTemplate">
                        <i class="iconfont icon-word-s "></i>{{$t('message.docTemplate')}}
                    </el-dropdown-item>
                    <el-dropdown-item command="mindTemplate">
                        <i class="iconM">M</i>{{$t('message.mindmapTemplate')}}
                    </el-dropdown-item>
                    <el-dropdown-item command="pptTemplate">
                        <i class="iconfont icon-ppt1"></i>{{$t('message.pptTemplate')}}
                    </el-dropdown-item>
                    <el-dropdown-item command="excelTemplate">
                        <i class="iconfont icon-excel1"></i>{{$t('message.excelTemplete')}}
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-menu class="tem-sider left-sider-menu" :default-active="$route.meta" router>
                <el-menu-item index='docContentTemplates'>
                    <i class="iconfont icon-word-s"></i>{{$t('message.docTemplate')}}
                </el-menu-item>
                <el-menu-item index='mindMapTemplates'>
                    <i class="iconM">M</i>{{$t('message.mindmapTemplate')}}
                </el-menu-item>
                <el-menu-item index='pptTemplates'>
                    <i class="iconfont icon-ppt1"></i>{{$t('message.pptTemplate')}}
                </el-menu-item>
                <el-menu-item index='excelTemplates'>
                    <i class="iconfont icon-excel1"></i>{{$t('message.excelTemplete')}}
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view ref="templates-router-view"></router-view>
        </el-main>
    </el-container>
</template>
<script>

export default {
    name:'TemplatesIndex',
    methods:{
        //新建类型选择
        selectNewType(command){
            let createType=''
            switch (command) {
                case 'docContentTemplate': 
                    createType = 1;
                    break;
                case 'mindTemplate':
                    createType = 2;
                    break;
                case 'pptTemplate':
                    createType = 3;
                    break;
                case 'excelTemplate':
                    createType= 4;
                    break;
            }
            this.$refs['templates-router-view'].emitCreateOrEdit(true,createType);
        },
    }

    
}
</script>