// pages/spcar/spcar.js
import { getUserProFile,getUserCode,axios } from "../../utils/util"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    spcarList:[],
  },
  // 购物车商品复选框选项组
  spcarItemCheck(e){
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 判断是否登录
    if(!wx.getStorageSync('token')){
      this.setData({
        isLogin:false,
      })
    }else{
      this.setData({
        isLogin:true,
      })
      // 获取购物车数据
      let spcarData = await axios({
        url:'http://api_devs.wanxikeji.cn/api/shoppingCarList',
        data:{
          token: wx.getStorageSync('token'),
        }
      })
      this.setData({
        spcarList:spcarData.data.data,
      })
    }
  },
  // 点击函数--返回上一个页面
  goBack(){
    console.log("原生tabbar页面无法返回上一页，我也很无奈")
  },
  // 点击函数--登录
  async clickLogin(){
    let openid = "";
    let nick_name = "";
    let icon = "";
    let code = "";
    let res1 = await getUserProFile();
    nick_name = res1.userInfo.nickName
    icon = res1.userInfo.avatarUrl
    let res2 = await getUserCode();
    code = res2.code
    let res3 = await axios({
      url: 'http://api_devs.wanxikeji.cn/api/codeExchangeOpenid',
      data: {
        code,
      },
    })
    console.log(res3);
    // 判断换取openid接口是否成功
    if(res3.statusCode == 200){
      if(res3.data.code ==2000){
        openid = res3.data.data.openid
      }else{
        console.log(res3.data.msg);
      }
    }else{
      console.log("换取openid接口请求错误");
    }
    // 如果token有效，即调用换取openid接口时返回数据内有info字段
    // 则说明token依然可用，否则再调用注册接口获取token
    if(res3.data.data.info){
      wx.setStorageSync('token', res3.data.data.info.token)
      // 获取购物车数据
      let spcarData = await axios({
        url:'http://api_devs.wanxikeji.cn/api/shoppingCarList',
        data:{
          token: wx.getStorageSync('token'),
        }
      })
      this.setData({
        spcarList:spcarData.data.data,
      })
    }else{
      let res4 = await axios({
        url: 'http://api_devs.wanxikeji.cn/api/register',
        data: {
          nick_name,
          icon,
          openid,
        },
      })
      wx.setStorageSync('token', res4.data.token)
    }
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