// pages/m_login/m_login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  wxlogin(){
    let nickName="";
    let icon="";
    let code="";
    wx.getUserProfile({
      desc: '微信授权登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        nickName=res.userInfo.nickName;
        icon=res.userInfo.avatarUrl;
        wx.login({
          success(res){
            code=res.code;
            console.log(code);
            wx.request({
              url: 'http://api_devs.wanxikeji.cn/api/codeExchangeOpenid',
              data:{
                code:code,
              },
              success(res){
                console.log(res,74);
              },
              fail(res){
                wx.showToast({
                  title: res.data.msg,
                })
              }
            })
          }
        })
      }
    })
    
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