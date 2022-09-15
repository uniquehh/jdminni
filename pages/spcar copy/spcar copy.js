// pages/spcar/spcar.js
import { getUserProFile,getUserCode,axios } from "../../utils/util"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    spcarList:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  // 购物车商品复选框选项组
  spcarItemCheck(e){
    e.detail.value.forEach(item=>{
      if(item.length>4){
        this.data.spcarList.forEach(items=>{
          if(items.shopping_car_id==item){
            if(items.checked==false){
              items.checked=true
            }else{
              items.checked=false
            }
          }
        })
      }else{
        this.data.spcarList.forEach(itemss=>{
          if(itemss.good_id==item){
            if(itemss.checked==false){
              itemss.checked=true
            }else{
              itemss.checked=false
            }
          }
        })
      }
    })
    this.setData({
      spcarList:this.data.spcarList
    })
    this.ifAllChecked();
    this.totalprice();
  },
  // 加减数量
  modifynum(e){
    let spId=e.currentTarget.dataset.item;
    this.data.spcarList.forEach(item=>{
      if(item.shopping_car_id==spId){
        if(e.currentTarget.dataset.type=="add"){
          item.num++;
        }else{
          item.num--;
        }
      }
    })

    this.setData({
      spcarList:this.data.spcarList,
    })
    this.totalprice();
  },
  // 全选校验
  ifAllChecked(){
    this.setData({
      allChecked:this.data.spcarList.every(item=>item.checked==true)
    })
    console.log(this.data.allChecked); 
  },
  // 计算总价和总数
  totalprice(){
    let flag=true;
    this.data.spcarList.forEach(item=>{
      if(item.checked==false){
        flag=false
      }
    })
    this.data.totalPrice=0;
    this.data.totalNum=0;
    if(flag){
      this.data.spcarList.forEach(item=>{
        item.money=item.price*item.num;
        this.data.totalPrice+=item.money;
        this.data.totalNum+=item.num;
      })
    }else{
      this.data.spcarList.forEach(item=>{
        if(item.checked==true){
          item.money=item.price*item.num;
          this.data.totalPrice+=item.money;
          this.data.totalNum+=item.num;
        }
      })
    }
    this.setData({
      totalPrice:this.data.totalPrice,
      totalNum:this.data.totalNum
    })
  },
  // 删除购物车
  async deleteSpcar(e){
    console.log(e.currentTarget.dataset.item,1522);
    let carItem = e.currentTarget.dataset.item;
    let delcar= await axios({
      url:"http://api_devs.wanxikeji.cn/api/shoppingCarDelete",
      data:{
        token:wx.getStorageSync('token'),
        shopping_car_id:carItem.shopping_car_id
      }
    })
    if(delcar.data.code==2000){
      // 获取购物车数据
      let spcarData = await axios({
        url:'http://api_devs.wanxikeji.cn/api/shoppingCarList',
        data:{
          token: wx.getStorageSync('token'),
        }
      })
      let temp=spcarData.data.data.data;
      temp.forEach(item=>{
        item.sku=JSON.parse(item.sku);
        item.pirce=item.price.split(".")[0]
      })
      this.setData({
        spcarList:temp,
      })
    }
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
      let temp=spcarData.data.data.data;
      temp.forEach(item=>{
        item.sku=JSON.parse(item.sku);
        item.price=item.price.split(".")[0]
        item.checked=false
      })
      this.setData({
        spcarList:temp,
      })
      // 获取用户优惠券
      let res=await axios({
        url:"http://api_devs.wanxikeji.cn/api/userCouponList",
        data:{
          token:wx.getStorageSync('token')
        }
      })
      console.log(res,123540);
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
        spcarList:spcarData.data.data.data,
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
  async onShow() {
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
      let temp=spcarData.data.data.data;
      temp.forEach(item=>{
        item.sku=JSON.parse(item.sku);
        item.price=item.price.split(".")[0]
        item.checked=false
      })
      this.setData({
        spcarList:temp,
      })
    }
  },
  toInfo(e){
    wx.navigateTo({
      url: `../m_info/m_info?goodid=${e.currentTarget.dataset.item.good_id}`,
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