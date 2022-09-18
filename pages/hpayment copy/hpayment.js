// pages/hpayment/hpayment.js
import { axios } from "../../utils/util"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shAdress:{},
    orderList:[],
    sumPrice:0,
    isShowYouHui:false,
    youhui:0,
    tempprice:0
  },
  // 优惠卷
  showYHPC(){
    this.setData({
      isShowYouHui:true,
    })
  },
  // 支付功能
  async wechatpay(){
    let idarr=wx.getStorageSync('checkList');
    let ids=[];
    idarr.forEach(item=>{
      ids.push(item.shopping_car_id);
    })
    if(this.data.youhui){
      console.log(1);
      let res=await axios({
        url:"http://api_devs.wanxikeji.cn/api/generateOrder",
        method:"POST",
        data:{
          token:wx.getStorageSync('token'),
          address_id:wx.getStorageSync('sAdress').address_id,
          coupon_money:this.data.youhui,
          money:this.data.sumPrice,
          shopping_car_ids:ids,
        }
      })
      console.log(res,123);
    }else{
      console.log(2);
      let res=await axios({
        url:"http://api_devs.wanxikeji.cn/api/generateOrder",
        method:"POST",
        data:{
          token:wx.getStorageSync('token'),
          address_id:wx.getStorageSync('sAdress').address_id,
          money:this.data.sumPrice,
          shopping_car_ids:ids,
        }
      })
      let needscode={};
      console.log(res,123);
      if(res.data.code==2000){
        needscode=res.data.data;
        console.log('进来了');
        wx.requestPayment({
          nonceStr: needscode.nonce_str,
          package: `prepay_id=${needscode.prepay_id}`,
          paySign: needscode.paySign,
          timeStamp: needscode.timeStamp,
          signType:"MD5",
          success(res){
            console.log(res,'pay');
          },
          fail(res){
            console.log(res,'fail');
          }
        })
      }
    }
  },
  // 退换无忧功能
  exchange(e){
    if(e.detail.value){
      this.data.sumPrice = ((this.data.sumPrice-0)+3).toFixed(2);
    }else{
      this.data.sumPrice = (this.data.sumPrice-3).toFixed(2);
    }
    this.setData({
      sumPrice:this.data.sumPrice
    })
  },
   // 接收子组件传递来的值
   closeCont(e){
    if(e.detail){
      this.setData({
        isShowYouHui:false
      })
    }
  },
  useYouHui(e){
    if(e.detail){
      this.setData({
        isShowYouHui:false
      })
    }
  },
  getYouHui(e){
    this.data.youhui = e.detail.reduce;
    this.data.sumPrice=this.data.tempprice-(this.data.youhui-0);
    this.setData({
      youhui:this.data.youhui,
      sumPrice:this.data.sumPrice
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
 onLoad(options) {
    // 设置收货地址
  },
  toGoodInfo(e){
    let obj = e.currentTarget.dataset.item
    wx.setStorageSync('information', JSON.stringify(obj))
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    // 设置收货地址
    let sAdress = wx.getStorageSync('sAdress');
    if(sAdress){
      this.data.shAdress = {}
      this.data.shAdress = sAdress
      this.setData({
        shAdress:this.data.shAdress,
      })
    }else{
      let res = await axios({
        url:'http://api_devs.wanxikeji.cn/api/userAddressList',
        data:{
          token: wx.getStorageSync('token'),
        },
      })
      let temp = res.data.data.filter((item)=>item.default == 1)
      wx.setStorageSync('sAdress', temp[0])
      console.log(wx.getStorageSync('sAdress'));
      this.data.shAdress = {}
      this.data.shAdress = temp[0]
      this.setData({
        shAdress:this.data.shAdress,
      })
    }
    // 根据购物车订单数据--进行结算页渲染
    let checkGood = wx.getStorageSync('checkList')
    checkGood.forEach((item)=>{
      item.guiGe = item.sku.sku.join(" ")
      this.data.sumPrice += (item.price-0)*item.num
      this.data.tempprice+=(item.price-0)*item.num
    })
    this.data.orderList = checkGood
    this.setData({
      orderList:this.data.orderList,
      sumPrice:(this.data.sumPrice-0).toFixed(2),
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})