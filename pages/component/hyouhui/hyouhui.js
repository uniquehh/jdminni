import { axios } from "../../../utils/util"
Component({
  properties: {

  },
  data: {
    isYouYh:true,
    isClose:true,
    youHuiList:[],
  },
  methods:{
    checkYh(e){
      console.log(e);
    },
    useYouHui(e){
      this.triggerEvent("useYouHui",this.data.isClose)
    },
    closeCont(){
      this.triggerEvent("closeCont",this.data.isClose)
    },
  },
  async attached(){
    let res = await axios({
      url:"http://api_devs.wanxikeji.cn/api/userCouponList",
      data:{
        token:wx.getStorageSync('token'),
      },
    })
    console.log(res);
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