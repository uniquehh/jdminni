// pages/spcar/spcar.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
  },
  // 购物车商品复选框选项组
  spcarItemCheck(e){
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 判断是否登录
    if(!wx.getStorageSync('token')){
      this.setData({
        isLogin:false,
      })
    }else{
      this.setData({
        isLogin:true,
      })
    }
  },
  // 点击函数--返回上一个页面
  goBack(){
    console.log("原生得tabbar页面无法返回上一页，我也很无奈")
  },
  // 点击函数--登录
  clickLogin(){
    let openid = "";
    let nick_name = "";
    let icon = "";
    wx.getUserProfile({
      desc: 'login',
      success(res){
        console.log(res);
        nick_name = res.userInfo.nickName
        icon = res.userInfo.avatarUrl
        wx.login({
          success(res){
            console.log("login",res);
            if (res.code) {
              //发起网络请求换取openid
              wx.request({
                url: 'http://api_devs.wanxikeji.cn/api/codeExchangeOpenid',
                data: {
                  code: res.code
                },
                success(res){
                  console.log("id",res);
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
      },
    })
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