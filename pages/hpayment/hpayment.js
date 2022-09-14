// pages/hpayment/hpayment.js
import { axios } from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shAdress:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    let sAdress = wx.getStorageSync('sAdress');
    console.log(sAdress,"@@");
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