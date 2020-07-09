<template>
    <div class="wrap-container">
        <Header/>
        <el-container class="wrap" >
            <router-view></router-view> 
        </el-container>
    </div>
</template>
<script>
import Header from 'root/components/Header.vue'
//import Footer from 'root/components/Footer.vue'
export default {
    name:'App',
    components:{Header},
    mounted(){
        if(this.$route.meta=='myDocuments') this.$store.commit('initEditor');
    }
}
</script>