
const { axios } = require("../../utils/util");

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
    layoutStyle:"",
    prolist:[],
    duration:300,
    request:{
      pageIdx:1,
      pageNum:10
    },
    hidden:false,
    ifLoadMore:null,
    top:{},
    fiex:false
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
      if(this.data.fiex){
        this.data.customStyle="margin-top:50px";
        this.data.layoutStyle="margin-top:50px"
      }else{
        this.data.customStyle="margin-top:230px";
        this.data.layoutStyle="margin-top:230px"
      }
      this.data.showBrand=true;
    }else{
      this.data.showBrand=false;
      this.data.customStyle="margin-left:10%";
      this.data.layoutStyle=""
    }
    this.setData({ 
       showBrand:this.data.showBrand,
       showPop:true,
       popPosition:e.currentTarget.dataset.position,
       customStyle:this.data.customStyle,
       layoutStyle:this.data.layoutStyle
        // [`catData[${e.currentTarget.dataset.index}].showOut`]:e.currentTarget.dataset.showoff
    })
  },
  // 事件处理函数
  toInfo(e) {
    console.log(e.currentTarget.dataset,122);
    let information=JSON.stringify(e.currentTarget.dataset.proinfo);
    wx.setStorageSync('information', information)
    wx.navigateTo({
      url: `../m_info/m_info`
    })
  },
  getProList(){
    let sl=this;
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/goodList',
      data:{
        page:sl.data.request.pageIdx,
        size:sl.data.request.pageNum
      },
      success(res ){
        let temp = res.data.data.data;
        sl.data.request.pageNum+=10;
        if (sl.data.ifLoadMore) {
          console.log("应该加载更多");
          console.log(sl.data.hidden,123);
          //加载更多
          if (sl.data.request.pageNum>res.data.data.count){
            console.log("已经加载完啦");
              sl.data.ifLoadMore = false;
              sl.setData({
                hidden:true
              })
              wx.showToast({
                title: '暂无更多内容！',
                icon: 'loading',
                duration: 2000
              })
          }else{
            sl.setData({
              hidden:false
            })
          }
        }else{
          if (sl.data.ifLoadMore == null){
            sl.data.ifLoadMore = true;
          }
        }
        sl.setData({
          prolist:temp,
        });
        wx.stopPullDownRefresh();//结束动画
      }
    })
  },
  scrollToBottom(){
    if(this.data.ifLoadMore!=null){
      this.getProList();
    }
  }, 
  closePop(){
    this.setData({
      customStyle:"",
      duration:0,
      showPop:false,
    })
  },
  onLoad(option) {
    this.getProList();
  },
  // 获取节点
  queryMultipleNodes (){
    let query = wx.createSelectorQuery().in(this)
    let that=this;
    query.select('.fixnum').boundingClientRect(function(res){
      that.data.top=res;
    }).exec()
  },
  onReady(){
    this.queryMultipleNodes();//获取节点信息
  },
  scrollToTop(e){
    if(e.detail.scrollTop>=this.data.top.top){
      this.setData({
        fiex:true,
      })
    }else{
      this.setData({
        fiex:false,
      })
    }
  },
})
