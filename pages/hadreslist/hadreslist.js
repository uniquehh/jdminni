// pages/hadreslist/hadreslist.js
import { axios } from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addresList:[],
    sAdress:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },
  // 编辑地址--存数据
  editAdress(e){
    wx.setStorageSync('editAdres', e.currentTarget.dataset.item);
  },
  // 选择收货地址
  selectAdress(e){
    console.log(e);
    wx.setStorageSync('sAdress', e.currentTarget.dataset.item)
    wx.navigateBack()
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
    // 获取地址列表
    let res1 = await axios({
      url:'http://api_devs.wanxikeji.cn/api/userAddressList',
      data:{
        token: wx.getStorageSync('token'),
      },
    })
    // 如果地址列表只有一条数据，则设为默认地址
    if(res1.data.data.length == 1){
      await axios({
        url:'http://api_devs.wanxikeji.cn/api/userAddressDfault',
        data:{
          token: wx.getStorageSync('token'),
          id:res1.data.data[0].address_id,
        },
      })
      wx.setStorageSync('sAdress',res1.data.data[0])
      this.setData({
        sAdress: wx.getStorageSync('sAdress'),
      })
    }else{
      this.setData({
        sAdress: wx.getStorageSync('sAdress'),
      })
    }
    this.setData({
      addresList:res1.data.data,
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