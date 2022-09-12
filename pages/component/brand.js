// pages/component/brand.js
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
    arr:[
      {name:"海尔（Haier）",checked:false,value:'hr'},
      {name:"奥克斯（AUX）",checked:false,value:'aks'},
      {name:"小米（MI）",checked:false,value:'xm'},
      {name:"TCL",checked:false,value:'tcl'},
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    check(e){
        this.data.arr.forEach(item=>{
          let flag=0;
          e.detail.value.forEach(items=>{
            if(item.value==items){
              flag=1;
            }
          })
          if(flag==0){
              item.checked=false;
          }else{
            item.checked=true;
          }
        })
      this.setData({
        arr:this.data.arr,
      })
    }
  }
})
