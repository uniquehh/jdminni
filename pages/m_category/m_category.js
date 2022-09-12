// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    scrData:[1,2,3,4,5,6,7,8],
    catData:[
        {name:"京东物流",path:""},
        {name:"新品"},
        {name:"品牌",showTr:true,path:"",showOut:false},
        {name:"匹数",showTr:true,path:"",showOut:false},
        {name:"能效等级"},
        {name:"类型"},
        {name:"变频/定频"},
    ],
    showPop:false,
    showBrand:false,
    showfilt:false,
    popPosition:'',
    customStyle:"",
    prolist:[],
  },
  showSec(e){
    // if(e.currentTarget.dataset.showoff==false){
    //     e.currentTarget.dataset.showoff=true;
    // }else{
    //      e.currentTarget.dataset.showoff=false;
    // }
    // if(this.data.showBrand==false){
    //   this.data.showBrand=true;
    // }else{
    //   this.data.showBrand=false;
    // }
    if(e.currentTarget.dataset.position=="top"){
      this.data.showBrand=true;
      this.data.customStyle="margin-top:250px";
    }else{
      this.data.showBrand=false;
      this.data.customStyle="margin-left:10%";
    }
    this.setData({ 
       showBrand:this.data.showBrand,
       showPop:true,
       popPosition:e.currentTarget.dataset.position,
       customStyle:this.data.customStyle
        // [`catData[${e.currentTarget.dataset.index}].showOut`]:e.currentTarget.dataset.showoff
    })
  },
  // 事件处理函数
  toInfo() {
    wx.navigateTo({
      url: '../m_info/m_info'
    })
  },
  closePop(){
    this.setData({
      showPop:false,
      customStyle:"display:none"
    })
  },
  onLoad(option) {
    console.log(option);
    let sl=this;
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/goodList',
      // data:{
      //   good_type:option.goodtype,
      // },
      success(res){
        if(res.data.code==2000){
          sl.data.prolist=res.data.data.data;
          console.log(sl.data.prolist,123);
          sl.setData({
            prolist:sl.data.prolist,
          })
        }
      }
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
      }
    })
  },
})
