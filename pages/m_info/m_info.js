// pages/m_info/m_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop:false,
    list:[
      {name:"【大1匹】风酷一级 清凉速享",value:1,checked:true},
      {name:"【1.5匹】风酷一级 清凉速享",value:2,checked:false},
      {name:"【大1匹】风酷三级 性价比优选",value:3,checked:false},
      {name:"【1.5匹】风酷三级 性价比优选",value:4,checked:false},
      {name:"【1.5匹】风酷三级 性价比优选",value:5,checked:false},
    ],
    countTime:'',
    num:1,
    shopcar:false,
    information:{},
    price:[],
  },
  goBack(){
    wx.navigateBack({
      delta: 0,
    })
  },
  radiochange(e){
    let tempList=this.data.list;
    let checkItem=e.detail;
    tempList.forEach(item=>{
      if(item.value==checkItem.value){
        item.checked=true;
      }else{
        item.checked=false;
      }
    })
    this.setData({
      list:tempList,
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
    console.log(e);
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
  closePop(){
    this.setData({
      showPop:false,
    })
  },
  addselfpro(){
    if(!wx.getStorageSync('info')){
      wx.navigateTo({
        url: '../m_login/m_login',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let proinfo=JSON.parse(wx.getStorageSync('information'));
    let tempPri=proinfo.price;
    let priArr=tempPri.split(".");
    this.setData({
      information:proinfo,
      price:priArr
    })
    setInterval(()=>{
      this.data.countTime=this.countDown('2022-09-13 12:30:00')
      this.setData({
        countTime:this.data.countTime,
      })
    },1000)
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