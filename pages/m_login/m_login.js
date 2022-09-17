// pages/m_login/m_login.js
import {getUserProFile,getUserCode,axios} from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async wxlogin(){
    let nickName_icon = await getUserProFile();
    let nickName=nickName_icon.userInfo.nickName;
    let icon=nickName_icon.userInfo.avatarUrl;
    let codes = await getUserCode();
    let userInfo=await axios({
      url:"http://api_devs.wanxikeji.cn/api/codeExchangeOpenid",
      data:{
        code:codes.code
      }
    })
    let sessionkey=userInfo.data.data.session_key;
    let openid=userInfo.data.data.openid;
    console.log(userInfo,"hh");
    wx.setStorageSync('session_key', userInfo.data.data.session_key);
    wx.setStorageSync('openid', userInfo.data.data.openid);
    if(!userInfo.data.data.info){
      console.log(1);
      let ress=await axios({
        url:"http://api_devs.wanxikeji.cn/api/register",
        data:{
          openid:openid,
          nick_name:nickName,
          icon:icon
        }
      })
      let info=ress.data.data;
      console.log(info);
      wx.setStorageSync('info', JSON.stringify(info));
      wx.setStorageSync('token', ress.data.token);
      wx.navigateBack()
    }else{
      wx.setStorageSync('info', JSON.stringify(userInfo.data.data.info));
      wx.setStorageSync('token', userInfo.data.data.info.token);
      wx.navigateBack()
    }
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