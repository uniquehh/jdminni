import { axios } from "../../../utils/util"
Component({
  properties: {

  },
  data: {
    isYouYh:true,
    isClose:true,
    youHuiList:[],
    youhui:0,
    currentId:"",
  },
  methods:{
    clickLabel(e){
      let cid = 'h' + e.currentTarget.dataset.item.coupon_id
      e.currentTarget.dataset.item.id = cid
      this.data.youhui =  e.currentTarget.dataset.item
    },
    useYouHui(e){
      this.triggerEvent("useYouHui",this.data.isClose)
      this.triggerEvent("youhui",this.data.youhui)
      this.triggerEvent("getYouHui",this.data.youhui)
    },
    closeCont(){
      this.triggerEvent("closeCont",this.data.isClose)
    },
  },
  // 退出子组件得钩子
  // detached(){
  //   console.log("tuichu");
  // },
  async attached(){
    // 设置选中得优惠卷
    let oldYH = wx.getStorageSync('checkedYH')
    if(oldYH){
      this.data.currentId = oldYH.id
      this.setData({
        currentId:this.data.currentId,
      })
    }else{
      this.setData({
        currentId:this.data.youhui.id || "h",
      })
    }
    let res = await axios({
      url:"http://api_devs.wanxikeji.cn/api/userCouponList",
      data:{
        token:wx.getStorageSync('token'),
      },
    })
    this.setData({
      youHuiList:res.data.data,
    })
    console.log(this.data.youHuiList);
    if(this.data.youHuiList.length){
      this.setData({
        isYouYh: true,
      })
    }else{
      this.setData({
        isYouYh: false,
      })
    }
  },
})