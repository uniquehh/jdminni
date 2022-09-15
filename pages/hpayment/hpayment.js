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
      this.data.sumPrice += item.pirce*item.num
    })
    console.log(checkGood);
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