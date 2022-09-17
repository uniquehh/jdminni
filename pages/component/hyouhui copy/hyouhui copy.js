import { axios } from "../../../utils/util"
Component({
  properties: {

  },
  data: {
    isYouYh:true,
    isClose:true,
    youHuiList:[],
    youhui:{},
    currentId:"",
  },
  methods:{
    clickLabel(e){
      let cid = 'h' + e.currentTarget.dataset.item.coupon_id
      e.currentTarget.dataset.item.id = cid
      this.data.youhui =  e.currentTarget.dataset.item
      console.log(this.data.youhui,123);
    },
    useYouHui(e){
      wx.setStorageSync('checkedYH', this.data.youhui)
      this.triggerEvent("useYouHui",this.data.isClose)//关闭弹窗
      this.triggerEvent("getYouHui",this.data.youhui)
    },
    closeCont(){
      this.triggerEvent("closeCont",this.data.isClose)
    },
  },
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