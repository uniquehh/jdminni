// pages/spcar/spcar.js
import { getUserProFile,getUserCode,axios,showModalFn } from "../../utils/util"
function sumSpcarData(arr){
  let checkList = arr.filter((item)=>item.isCheck == true);
  // console.log(checkList,123);
  let obj = {price:0,num:0,}
  checkList.forEach(item=>{
    obj.num+=item.num;
  })
  checkList.forEach(item=>{
    item.money = (item.price-0)*item.num;
    obj.price+=item.money;
  })
  wx.setStorageSync('checkList', checkList)
  wx.setStorageSync('sumResult', obj)
  return obj
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    spcarList:[],
    checkLader:true,
    sumPrice:0,
    checkGoods:0,
    showpop:false,
    popid:0,
    pronum:0,
    spcarid:0,
    item:{},
    request:{
      pageIdx:1,
      pageNum:10
    },
    ifLoadMore:null,
    hidden:false,
    prolist:[]
  },
  // 子组件传函数
  close(e){
    this.setData({
      showpop:e.detail
    })
  },
  inputchangeNum(e){
    this.data.spcarList.forEach(item=>{
      if(item.shopping_car_id==e.detail.spid){
        item.num=e.detail.num;
      }
    })
    this.setData({
      spcarList:this.data.spcarList
    })
  },
  modifyNum(e){
    this.data.spcarList.forEach(item=>{
      if(item.shopping_car_id==e.detail.spid){
        item.num=e.detail.num;
      }
    })
    this.setData({
      spcarList:this.data.spcarList
    })
  },
  //输入框输入值修改
  inputNum(e){
    let id=e.currentTarget.dataset.spid;
    this.data.spcarList.forEach(item=>{
      if(item.shopping_car_id==id){
        item.num=e.detail.value-0;
      }
    })
    this.setData({
      spcarList:this.data.spcarList,
    })
    let sumResult = sumSpcarData(this.data.spcarList)
    this.data.sumPrice = sumResult.price
    this.data.checkGoods = sumResult.num
    this.setData({
      sumPrice:this.data.sumPrice,
      checkGoods:this.data.checkGoods,
    })
  },
  // 展示sku
  showPop(e){
    this.setData({
      showpop:true,
      popid:e.currentTarget.dataset.goodid,
      pronum:e.currentTarget.dataset.num,
      spcarid:e.currentTarget.dataset.spcarid,
      item:e.currentTarget.dataset.item,
    })
  },
  // 去商品详情页
  toInfo(e){
    wx.navigateTo({
      url: `../m_info/m_info?goodid=${e.currentTarget.dataset.item.good_id}`,
    })
  },
   // 加减数量
   modifynum(e){
    let spId=e.currentTarget.dataset.item;
    this.data.spcarList.forEach(item=>{
      if(item.shopping_car_id==spId){
        if(e.currentTarget.dataset.type=="add"){
          console.log("+");
          item.num++;
        }else{
          if(item.num == 1){
            return
          }
          item.num--;
        }
      }
    })
    this.setData({
      spcarList:this.data.spcarList
    })
    let sumResult = sumSpcarData(this.data.spcarList)
    this.data.sumPrice = sumResult.price
    this.data.checkGoods = sumResult.num
    this.setData({
      sumPrice:this.data.sumPrice,
      checkGoods:this.data.checkGoods,
    })
  },
  // 购物车商品复选框选项组
  spcarItemCheck(e){
    // 点击店铺或者商品得复选框时切换选中状态
    let temp = ""
    e.detail.value.forEach((item)=>{
      temp = this.data.spcarList[item.split("+")[0]-0].isCheck
    })
    if(temp){
      e.detail.value.forEach((item)=>{
        this.data.spcarList[item.split("+")[0]-0].isCheck = false
      })
    }else{
      e.detail.value.forEach((item)=>{
        this.data.spcarList[item.split("+")[0]-0].isCheck = true
      })
    }
    this.setData({
      spcarList:this.data.spcarList,
    })
    let sumResult = sumSpcarData(this.data.spcarList)
    this.data.sumPrice = sumResult.price
    this.data.checkGoods = sumResult.num
    this.setData({
      sumPrice:this.data.sumPrice,
      checkGoods:this.data.checkGoods,
    })
    // 校验全选复选框状态
    let arr = this.data.spcarList.filter((item)=>item.isCheck == false)
    if(arr.length){
      this.data.checkLader = false
    }else{
      this.data.checkLader = true
    }
    this.setData({
      checkLader:this.data.checkLader,
    })
  },
  // 设置全选复选框得状态和全选功能
  checkAll(e){
    console.log(e);
    // 全选复选框点击控制商品和店铺的选中状态
    if(!e.detail.value.length){
      this.data.spcarList.forEach((item)=>{
        item.isCheck = false
      })
    }else{
      this.data.spcarList.forEach((item)=>{
        item.isCheck = true
      })
    }
    this.setData({
      spcarList:this.data.spcarList,
    })
    let sumResult = sumSpcarData(this.data.spcarList)
    this.data.sumPrice = sumResult.price
    this.data.checkGoods = sumResult.num
    this.setData({
      sumPrice:this.data.sumPrice,
      checkGoods:this.data.checkGoods,
    })
  },
  // 删除购物车
  async deleteSpcar(e){
    let carItem = e.currentTarget.dataset.item;
    let cref = await showModalFn()
    if(cref.confirm){
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
          item.isCheck=true
        })
        this.setData({
          spcarList:temp,
        })
        let sumResult = sumSpcarData(this.data.spcarList)
        this.data.sumPrice = sumResult.price
        this.data.checkGoods = sumResult.num
        this.setData({
          sumPrice:this.data.sumPrice,
          checkGoods:this.data.checkGoods,
        })
      }
    }else{
      console.log("取消删除商品操作");
    }
  },
  scrollToBottom(){
    if(this.data.ifLoadMore!=null){
      console.log(11111);
      this.getProList();
    }
  }, 
  getProList(){
    let sl=this;
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/goodList',
      data:{
        page:sl.data.request.pageIdx,
        size:sl.data.request.pageNum
      },
      success(res ){
        let temp = res.data.data.data;
        sl.data.request.pageNum+=10;
        if (sl.data.ifLoadMore) {
          //加载更多
          if (sl.data.request.pageNum>res.data.data.count){
              sl.data.ifLoadMore = false;
              this.setData({
                hidden:true
              })
              wx.showToast({
                title: '暂无更多内容！',
                icon: 'loading',
                duration: 2000
              })
          }else{
            sl.setData({
              hidden:false
            })
          }
        }else{
          if (sl.data.ifLoadMore == null){
            sl.data.ifLoadMore = true;
          }
        }
        sl.setData({
          prolist:temp,
        });
        wx.stopPullDownRefresh();//结束动画
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 判断是否登录
    console.log(wx.getStorageSync('token'),"load");
    if(!wx.getStorageSync('token')){
      console.log(this.data.isLogin);
      this.setData({
        isLogin:false,
        hidden:true
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
        item.isCheck=true
      })
      this.setData({
        spcarList:temp,
      })
      // 计算购物车选中商品
      let sumResult = sumSpcarData(this.data.spcarList)
      this.data.sumPrice = sumResult.price
      this.data.checkGoods = sumResult.num
      this.setData({
        sumPrice:this.data.sumPrice,
        checkGoods:this.data.checkGoods,
      })
      
    }
    // 获取商品信息
    this.getProList();
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
      wx.setStorageSync('token', res3.data.data.info.token);
      wx.setStorageSync('info', res3.data.data.info);
      // 获取购物车数据
      let spcarData = await axios({
        url:'http://api_devs.wanxikeji.cn/api/shoppingCarList',
        data:{
          token: wx.getStorageSync('token'),
        }
      })
      spcarData.data.data.data.forEach((item)=>{
        item.isCheck = true
        item.sku = JSON.parse(item.sku)
      })
      this.setData({
        spcarList:spcarData.data.data.data,
      })
      console.log(this.data.spcarList,"11");
      let sumResult = sumSpcarData(this.data.spcarList)
      this.data.sumPrice = sumResult.price
      this.data.checkGoods = sumResult.num
      this.setData({
        sumPrice:this.data.sumPrice,
        checkGoods:this.data.checkGoods,
        isLogin:true,
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
      // 获取购物车数据
      let spcarData = await axios({
        url:'http://api_devs.wanxikeji.cn/api/shoppingCarList',
        data:{
          token: wx.getStorageSync('token'),
        }
      })
      spcarData.data.data.data.forEach((item)=>item.isCheck = true)
      this.setData({
        spcarList:spcarData.data.data.data,
      })
      console.log(this.data.spcarList,"22");
      let sumResult = sumSpcarData(this.data.spcarList)
      this.data.sumPrice = sumResult.price
      this.data.checkGoods = sumResult.num
      this.setData({
        sumPrice:this.data.sumPrice,
        checkGoods:this.data.checkGoods,
      })
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
        hidden:true
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
        item.isCheck=true
      })
      temp.forEach(item=>{
        let flag=1;
        this.data.spcarList.forEach(items=>{
          if(item.shopping_car_id==items.shopping_car_id){
            flag=0;
          }
        })
        if(flag){
          this.data.spcarList.push(item)
        }
      })
      console.log(this.data.spcarList,456);
      this.setData({
        spcarList:this.data.spcarList,
      })
      // 计算购物车选中商品
      let sumResult = sumSpcarData(this.data.spcarList)
      this.data.sumPrice = sumResult.price
      this.data.checkGoods = sumResult.num
      this.setData({
        sumPrice:this.data.sumPrice,
        checkGoods:this.data.checkGoods,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  async onHide() {
    this.setData({
      spcarList:this.data.spcarList
    })
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