// pages/component/filt.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showCity:false,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    chooseCity(){
      this.setData({
        showCity:true
      })
    },
  },
  
})
