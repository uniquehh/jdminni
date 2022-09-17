// pages/m_info/m_info.js
import { axios } from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop:false,
    countTime:'',
    num:1,
    shopcar:false,
    information:{},
    price:[],
    conponList:[],
    sku:{},
    skuinfo:{},
    choosedSku:[],
    tapSKu:false,
    currentCp:[]
  },
  goBack(){
    wx.navigateBack({
      delta: 0,
    })
  },
  chooseSku(e){
    let index=e.currentTarget.dataset.index;
    let indexs=e.currentTarget.dataset.indexs;
    this.data.sku.sku_column[index].checked=indexs;
    let tempSku=[];
    this.data.sku.sku_column.forEach(item=>{
     tempSku.push(item.value[item.checked]);
    });
    this.data.sku.sku_list.forEach(item=>{
      if(item.sku.join()==tempSku.join()){
        this.data.skuinfo=item;
      }
    })
    this.data.tapSKu=true;
    this.setData({
      sku:this.data.sku,
      skuinfo:this.data.skuinfo,
      tapSKu:this.data.tapSKu
    })
  },
  reduceNum(){
    this.data.num--;
    this.setData({
      num:this.data.num,
    })
  },
  addNum(){
    this.data.num++;
    this.setData({
      num:this.data.num,
    })
  },
  countDown(time) {
    var nowTime = +new Date(); // 返回的是当前时间总的毫秒数
    var inputTime = +new Date(time); // 返回的是用户输入时间总的毫秒数
    var times = (inputTime - nowTime) / 1000; // times是剩余时间总的秒数
    var d = parseInt(times / 60 / 60 / 24); // 把秒数转换成天数  （parselnt把得到的数转换为整数）
    d = d < 10 ? '0' + d : d;//这里为了让时间数好看一点，比如把4天改成04天，所以加了三元判定，下面也是如此；
    var h = parseInt(times / 60 / 60 % 24); //时
    h = h < 10 ? '0' + h : h;
    var m = parseInt(times / 60 % 60); //分
    m = m < 10 ? '0' + m : m;
    var s = parseInt(times % 60); // 秒
    s = s < 10 ? '0' + s : s;
    return d + '天' + h + '时' + m + '分' + s + '秒'; //返回函数计算出的值
},
  addpro(e){
    if(e.currentTarget.dataset.modle=="shopcar"){
      this.data.shopcar=true;
    }else{
      this.data.shopcar=false;
    }
    this.setData({
      showPop:true,
      shopcar:this.data.shopcar
    })
  },
  // 关闭弹窗
  closePop(){
    this.setData({
      showPop:false,
    })
  },
  // 获取优惠券
  async getDiscont(e){
    let conponId=e.currentTarget.dataset.conpon.coupon_id;
    this.data.currentCp.push(conponId);
    console.log(this.data.currentCp.includes(conponId),123);
    console.log(this.data.currentCp,152);
    let res=await axios({
      url:'http://api_devs.wanxikeji.cn/api/userCouponAdd',
      data:{
        token:wx.getStorageSync('token'),
        coupon_id:conponId
      }
    })
    let icon="success";
    if(res.data.code!=2000){
      icon="warn";
    }
    wx.showToast({
      title: res.data.msg,
      icon:icon
    })
    this.setData({
      currentCp:this.data.currentCp
    })
  },
  // 添加到购物车
  addselfpro(){
    if(!wx.getStorageSync('token')){
      wx.navigateTo({
        url: '../m_login/m_login',
      })
    }else{
      let info=wx.getStorageSync('info');
      let price=0;
      let money=0;
      let sku='';
      let that=this;
      if(this.data.tapSKu){
        price=this.data.skuinfo.price;
        sku=JSON.stringify(this.data.skuinfo);
      }else{
        price=this.data.information.price
        sku=JSON.stringify(this.data.choosedSku);
      }
      money=price*this.data.num;
      wx.request({
        url: 'http://api_devs.wanxikeji.cn/api/shoppingCarAddModify',
        data:{
          token:wx.getStorageSync('token'),
          good_id:this.data.information.good_id,
          num:this.data.num,
          price,
          money,
          sku,
        },
        success(res){
            wx.showToast({
              title: res.data.msg,
            })
            if(res.data.code==2000){
              that.setData({
                showPop:false
              })
            }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let good_id=0;
    if(JSON.stringify(options)!="{}"){
      good_id=options.goodid;
    }else{
      let proinfo=JSON.parse(wx.getStorageSync('information'));
      good_id=proinfo.good_id;
      let tempPri=proinfo.price;
      this.data.price=tempPri.split(".");
    }
    let tempCont=[];
    let that=this;
    this.setData({
      price:this.data.price
    })
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/goodInfo',
      data:{
        good_id,
      },
      success(res){
        if(res.data.code==2000){
          that.data.information=res.data.data;
          let tempsku=JSON.parse(res.data.data.info[0].edition);
          tempsku.sku_column.forEach(item=>{
              item.checked=0;
          })
          that.data.sku=tempsku;
          that.data.choosedSku=tempsku.sku_list[0];
        }
        that.setData({
          information:that.data.information,
          sku:that.data.sku,
          choosedSku:that.data.choosedSku
        })
        
      }
    })
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/couponList',
      success(res){
        if(res.data.code==2000){
          tempCont=res.data.data;
        }
        tempCont.forEach(item=>{
          item.achieve=item.achieve.split(".")[0]
          item.reduce=item.reduce.split(".")[0]
        })
        that.setData({
          conponList:tempCont,
        })
      }
    })
    setInterval(()=>{
      this.data.countTime=this.countDown('2022-09-22 24:00:00')
      this.setData({
        countTime:this.data.countTime,
      })
    },1000);
  },
  // 购物车点击函数--跳转到购物车
  toSpcar(){
    wx.switchTab({
      url: '/pages/spcar/spcar',
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