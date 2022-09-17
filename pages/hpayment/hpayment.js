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
    finallPrice:0,
    isShowYouHui:false,
    youhui:0,
  },
  // 点击支付
  async goPayment(){
    console.log(this.data.orderList,"hh");
    let obj = {
      token: wx.getStorageSync('token'),
      address_id: this.data.shAdress.address_id,
      coupon_money: this.data.youhui,
      money: this.data.finallPrice,
      shopping_car_ids:[],
    }
    this.data.orderList.forEach((item)=>{
      obj.shopping_car_ids.push(item.shopping_car_id)
    })
    obj.shopping_car_ids = JSON.stringify(obj.shopping_car_ids)
    console.log(obj);
    let res = await axios({
      url:"http://api_devs.wanxikeji.cn/api/generateOrder",
      data:obj,
      method:"POST",
    })
    console.log(res);
  },
  // 优惠卷
  showYHPC(){
    this.setData({
      isShowYouHui:true,
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
    console.log(e);
    if(!e.detail){
      this.setData({
        youhui:0,
      })
    }else{
      this.setData({
        youhui:e.detail.reduce-0,
        finallPrice:(this.data.sumPrice-(e.detail.reduce-0)).toFixed(2)
      })
    }
    // 存上一次选中的优惠卷，便于优惠卷列表选中
    wx.setStorageSync('checkedYH', e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    })
    this.data.orderList = checkGood
    this.setData({
      orderList:this.data.orderList,
      sumPrice:this.data.sumPrice-0,
      finallPrice:this.data.sumPrice-0,
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