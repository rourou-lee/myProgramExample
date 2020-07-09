<template>
    <div>
        <!-- 协作 -->
        <el-dialog :title="$t('message.collaborate')" width="600px" :close-on-click-modal="false" :visible="collaborateVisible" @close="collaborateVisible=false" class="dialog1">
            <div class="dialog-con">
              <el-scrollbar class="member-scroll">
                  <div class="dc-con">
                <p class="font-s16">{{curOperateFile.name}}</p>
                <p class="cr-tit">{{$t('message.director')}}</p>
                <p>
                    <img :src="curOperateFile.chargeMan.icon" class="head-img"/>
                    <span class="mem-width">{{curOperateFile.chargeMan.realName}}</span>
                </p>
                <p class="cr-tit2">{{$t('message.participant')}}
                    <svg class="icon icon-addT ml10" aria-hidden="true" @click="addMember"
                    v-if="currentUser.id==curOperateFile.chargeMan.userId"><use xlink:href="#icon-addT"></use></svg>
                </p>
                <ul v-if="currentUser.id==curOperateFile.chargeMan.userId">
                    <li class="clearfix cr-item group-li" v-for="(member,index) in curOperateFile.partMan" :key="index">
                        <p class="float-l">
                            <span class="per-list mr05">
                                <span class="inline-block posr vam">
                                    <img :src="member.icon" class="head-img"/>
                                    <a class="del-red" @click="delSelectedMember(member.id||member.userId)">
                                        <svg aria-hidden="true" class="icon icon-error"><use xlink:href="#icon-error"></use></svg>
                                    </a>
                                </span>
                                <span class="mem-width">{{member.realName}}</span>
                            </span>
                        </p>
                    </li>
                </ul>
                <ul v-else>
                    <li class="clearfix cr-item" v-for="(member,index) in curOperateFile.partMan" :key="index">
                        <p class="float-l">
                            <img :src="member.icon" class="head-img" />
                            <span class="mem-width">{{member.realName}}</span>
                        </p>
                        <div class="float-r" v-if="currentUser.id==member.userId">
                            <a href="javascript:;" class="btn-gray1" @click="sureToQuitCreationFlag=true">{{$t('message.quitCollaborate')}}</a>
                        </div>
                    </li>
                </ul>
                  </div>
              </el-scrollbar>
            </div>
            <span slot="footer" class="dialog-footer" v-if="currentUser.id==curOperateFile.chargeMan.userId">
                <el-button type="primary" @click="sureAddMember">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelChangeMember">{{$t('message.cancel')}}</el-button>
            </span>
        </el-dialog>
        <!--负责人权限转交 -->
        <el-dialog width="650px" :title="$t('message.leaderTransfer')"
                    :visible="changeLeaderVisible"
                    :close-on-click-modal="false"
                    @close="cancelChangeChargeMan">
            <el-scrollbar class="member-scroll">
                <div class="dialog-con">
                    <el-form label-width="auto">
                        <el-form-item  :label="$t('message.transferToMember')+'：'">
                            <div>
                                <span class="mr05 people-group cp"
                                        :class="{'news-span':member.id===changedChargeMan.id}"
                                        v-for="(member,index) in curOperateFile.partMan"
                                        :key="index" @click="changedChargeMan=member">
                                    <img :src="member.icon" class="headS-img vam">
                                    <span class="mem-width">{{member.realName}}</span>
                                    <i class="iconfont icon-newsYes" v-show="member.id===changedChargeMan.id"></i>
                                </span>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-scrollbar>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureChangeChargeMan">{{$t('message.sure')}}</el-button>
                <el-button @click="cancelChangeChargeMan">{{$t('message.cancel')}}</el-button>
            </span>
        </el-dialog> 
         <!--确定退出-->
        <el-dialog :title="$t('message.quit')" width="500px" :visible="sureToQuitCreationFlag" @close="sureToQuitCreationFlag=false">
            <p class="font-s16 text-center">{{$t('message.sureToQuit')}}</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureToQuitCreation">{{$t('message.sure')}}</el-button>
                <el-button @click="sureToQuitCreationFlag=false">{{$t('message.cancel')}}</el-button>
            </span>
        </el-dialog>
        <CheckMembers ref="members"
                :props="defaultProps"
                :empty-text="emptyText"
                :radio="radio"
                :expanded="expanded"
                :title="title"
                @confirm="confirm"
                :disabled-list="disabledList"
                :max-length="100"
                :forward="forward"
                @overflow="overflow"
                :append-to-body='true'
                :madal='false'
                :language='language'
                :is-multi-level="isMultiLevel"/> 
    </div>
</template>
<script>
const CheckMembers=require('../outerComponents/checkMembers');
import documentsApi from 'root/api/documentsApi.js';
import {mapState,mapMutations,mapActions} from 'vuex';
export default {
    name:'CollaborateOrChangeLeader',
    components:{CheckMembers},
    props:['isCollaborate','curOperateFile'],
    data(){
        return {
            language:window.localLanguage,
            currentUser:window.currentUser,  //当前登录用户
            memberLoad:false,//成员是否请求完
            organization: [{ name: this.$t('message.orgMember'), data: [], expanded: false , isTree: true, },
                 { name:this.$t('message.group'), expanded: false, isTree: false, data: [] }
                   ],
            //选人
            emptyText: this.$t('message.noData'),
            defaultProps: {
                realName: 'realName',// key固定value为传入数据的用户名字段
                userId: 'id',// key固定value为传入数据的用户id字段
                pId: 'pid',// key固定value为传入数据的用户父id字段
                logo: 'icon',// key固定value为传入数据的图标字段
                department: 'department',// key固定value为传入数据的部门字段
                type: 'type',// key固定value为传入数据的类型字段
                userType: 0// key固定value为用户类型
            },
            isMultiLevel:true,
            forward: true,
            title: '', //弹窗标题
            radio: false, // 是否单选
            expanded: false, // 是否默认展开
            disabledList: [],
            originalMemberIdAry: [], //用来比较成员变化，
            collaborateVisible:false,//协作弹框
            changeLeaderVisible:false,   //负责人权限转交显示flag
            changedChargeMan:'',
            sureToQuitCreationFlag:false,//确定退出
            ifPostFlag:false,//判断创作成员是否发生了变化
        }
    },
    methods:{
        //成员选择确定
        confirm(list){
            if(this.curOperateFile.partMan.length===0&&list.length===0){
                this.ifPostFlag=false;
            } else if (list.length < this.originalMemberIdAry.length) {
                this.ifPostFlag = true;
            }else{
                list.forEach((item)=>{
                    if(!this.originalMemberIdAry.includes(item.id)){
                        this.ifPostFlag=true;
                    }
                })
            }
            this.curOperateFile.partMan = $.extend(true, [], list);
        },
        overflow () {
            this.$message({
                message: this.$t('message.memberOverFlow'),
                type: 'warning'
            });
        },
        //成员头像删除
        delSelectedMember(id){
            this.curOperateFile.partMan=this.curOperateFile.partMan.filter((item)=>{
                return item.id!==id;
            })
        },
        //选择成员
        addMember () {
            this.originalMemberIdAry=[];
            if (!this.memberLoad) {
                return this.$message({
                    message: this.$t('message.dataloading'),
                    type: 'warning'
                });
            }
            this.title =  this.$t('message.selectMember');
            this.curOperateFile.partMan.forEach((item)=>{
                this.originalMemberIdAry.push(item.userId||item.id);
            })
            this.radio = false;
            let selectedMember = $.extend(true, [], this.curOperateFile.partMan);
            this.$refs.members.show({ list: this.organization, members: selectedMember });
        },
        //成员变化请求
        sureAddMember(){
            if(!this.ifPostFlag) return this.cancelChangeMember();
            let userIdAry=this.curOperateFile.partMan.map((item)=>{
                return item.id||item.userId
            });
            this.$store.commit('changeLoading',{loading:true,loadingTxt:this.$t('message.loading')});
            documentsApi['changePartManRequest']({projectId:this.curOperateFile.id,userIds: userIdAry}).then((data)=>{
                this.curOperateFile.partManCount=userIdAry.length;
                this.collaborateVisible=false;
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            }).finally(()=>{
                this.$store.commit('changeLoading',{loading:false,loadingTxt:''});
            });
        },
        //取消修改成员
        cancelChangeMember(){
             this.curOperateFile.partMan=this.originalMembers;
             this.collaborateVisible=false;
        },
        //确定负责人权限转交
        sureChangeChargeMan(){
            if (!this.changedChargeMan.id) {
                return this.$message({
                    message: this.$t('message.afterSelctMember'),
                    type: 'warning'
                });
            }
            documentsApi['changeChargeManRequest']({projectId:this.curOperateFile.id,userId: this.changedChargeMan.id}).then((data)=>{
                this.changeLeaderVisible=false;
                this.$emit('handdleSuccess',{msg:this.$t('message.changeLeaderSuc'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //取消负责人权限转交
        cancelChangeChargeMan(){
            this.changedChargeMan = {};
            this.changeLeaderVisible=false;
        },
        //确认退出协作
        sureToQuitCreation(){
            documentsApi['quitCreationRequest']({projectId:this.curOperateFile.id}).then((data)=>{
                this.sureToQuitCreationFlag=false;
                this.$emit('handdleSuccess',{msg:this.$t('message.quited'),highlightType:'file',ifReload:true});
            }).catch(error=>{
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //获取机构成员
        getOrganizationalMembers(){
            documentsApi['getOrganizationalMembersRequest']().then((data)=>{
                this.organization[0].data=data.filter( (item)=>{
                    return item.id !== window.currentUser.id;
                });
                this.getGroupMembers();
            }).catch(error=>{
                this.memberLoad=true;
                this.$message.error(this.$t('message.requestError'));
            });
        },
        //获取群组成员
        getGroupMembers(){
            documentsApi['getGroupMembersRequest']().then((data)=>{
                this.organization[1].data = data.filter( (item)=>{
                    return item.id !==window.currentUser.id;
                });
                this.memberLoad=true;
            }).catch(error=>{
                this.memberLoad=true;
                this.$message.error(this.$t('message.requestError'));
            });
        }

    },
    mounted(){
        //获取成员\
        if(this.organization[0].data.length&&this.organization[1].data.length) return;
        this.getOrganizationalMembers();
    },
    watch:{
        showSelectMemberFlag(val){
            if(this.isCollaborate){
                this.showSelectMemberFlagLast=val;
            }else{
                this.showChangeChargeManFlag=val;
            }
        }
    }
}
</script>

