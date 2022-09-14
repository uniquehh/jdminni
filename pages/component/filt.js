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
    // 
    city:[
      {type:"A",
        value:["a","b","c","d"]
      },
      {type:"B",
        value:["a","b","c","d"]
      },
      {type:"C",
        value:["a","b","c","d"]
      },
      {type:"D",
        value:["a","b","c","d"]
      },
      {type:"E",
        value:["a","b","c","d"]
      },
      {type:"F",
        value:["a","b","c","d"]
      },
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseCity(){
      this.setData({
        showCity:true
      })
    }
  }
})
