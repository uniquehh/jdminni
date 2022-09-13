// pages/haddadres/haddadres.js
import { axios } from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdd:true,
    basicInfo:{
      name:"",
      tel:"",
      diqu:[],
      dizhi:"",
    },
  },
  pickerChange(e){
    console.log(e)
    this.data.basicInfo.diqu = e.detail.value
    this.setData({
      basicInfo:this.data.basicInfo,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.adres == "add"){
      this.setData({
        isAdd:true,
      })
    }else if(options.adres == "edit"){
      this.setData({
        isAdd:false,
      })
    }
  },
  // 测试的点击事件
  test(){
    console.log(this.data.basicInfo)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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