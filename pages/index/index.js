// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aside:[],
    produce:[],
  },
  toCategory(e){
    let goodType = e.currentTarget.dataset.goodtype.good_type_id ;
    wx.navigateTo({
      url: `../m_category/m_category?goodtype=${goodType}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let thiss=this;
    let templist=[];
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/goodType',
      success(res){
        templist=res.data.data;
        // 一级
        templist.forEach(item=>{
          if(item.parent_id==0){
           thiss.data.aside.push(item); 
          }
        });
        // 二级
        thiss.data.aside.forEach(pitem=>{
          pitem.children=[];
          templist.forEach(citem=>{
            if(citem.parent_id==pitem.good_type_id){
              pitem.children.push(citem);
            }
          })
        });
        // 三级
        thiss.data.aside.forEach(gpitem=>{
          gpitem.children.forEach(pitem=>{
            pitem.children=[];
            templist.forEach(citem=>{
              if(citem.parent_id==pitem.good_type_id){
                pitem.children.push(citem);
              } 
            })
          })
        })
        console.log(thiss.data.aside,133);
        thiss.setData({
          aside:thiss.data.aside,
          // produce:thiss.data.produce,
        })
      }
    });
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