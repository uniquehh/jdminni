// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aside:[],
    asideChild:[],
    scrollTop:"",
    parentName:'',
    currentType:"",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 滚动事件
  asideGunDong(e){
    this.data.scrollTop = e.detail.scrollTop
  },
  // 抬起事件
  mouseup(){
    if(this.data.scrollTop<40){
      this.setData({
        scrollTop:'40',
      })
    }else if(this.data.scrollTop>737){
      this.setData({
        scrollTop:'737',
      })
    }
  },
  onLoad(options) {
    this.setData({
      scrollTop:'20',
    })
    let that = this
    // 请求商品分类数据
    function getGoodType(){
      wx.request({
        url: "http://api_devs.wanxikeji.cn/api/goodType",
        data:{
          groupid:1,
        },
        success(res){
          if(res.data.code==2000){
            // 一级分类
            let temp = res.data.data.filter(item=>{
              if(item.parent_id===0){
                item.child = []
                item.id="m"+item.good_type_id;
                return item
              }
            });
            // 二级分类
            temp.forEach((item)=>{
              res.data.data.forEach((items)=>{
                if(item.good_type_id === items.parent_id){
                  items.child = []
                  item.child.push(items)
                }
              })
            });
            // 三级分类
            temp.forEach((item)=>{
              item.child.forEach((items)=>{
                res.data.data.forEach((itemss)=>{
                  if(items.good_type_id === itemss.parent_id){
                    itemss.child = []
                    items.child.push(itemss)
                  }
                })
              })
            });
            that.setData({
              aside:temp,
              currentType:temp[0].id,
              parentName:temp[0].type_name,
              asideChild:temp[0].child
            })
          }else{
            console.log("接口请求错误");
          }
        }
      })
    }
    getGoodType();
  },
  // 侧边栏点击函数
  goodTypeClick(e){
    if(this.data.scrollTop>737){
      this.setData({
        scrollTop:737,
      })
    }else{
      this.setData({
        scrollTop:e.currentTarget.offsetTop,
      })
    }
    console.log(e.currentTarget);
    let gpId=e.currentTarget.dataset.parent.id;
    let gpItem=e.currentTarget.dataset.parent.good_type_id;
    this.data.currentType=gpId;
    this.data.aside.forEach((item)=>{
      if(gpItem==item.good_type_id){
        this.data.asideChild=item.child;
        this.data.parentName=item.type_name;
      }
      this.setData({
          asideChild:this.data.asideChild,
          parentName:this.data.parentName,
          currentType:this.data.currentType
        })
      })
  },
  // 跳转至商品详情页
  toCategory(e){
    let typeId=e.currentTarget.dataset.goodtype;
    wx.setStorageSync('typeId', typeId);
    wx.navigateTo({
      url: `../m_category/m_category`,
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
  onPullDownRefresh(e) {
    
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