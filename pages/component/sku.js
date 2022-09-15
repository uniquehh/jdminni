// pages/component/sku.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodid:{
      type:Number
    },
    pronum:{
      type:Number
    },
    spcarid:{
      type:Number
    },
    item:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    sku:{},
    skuinfo:{},
    choosedSku:[],
    information:{},
    close:false,
    tapSKu:false,
    price:[],
  },

  /**
   * 组件的方法列表
   */

  methods: {
    // 修改购物车
    addselfpro(){
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
      money=price*this.properties.pronum;
      wx.request({
        url: 'http://api_devs.wanxikeji.cn/api/shoppingCarAddModify',
        data:{
          token:wx.getStorageSync('token'),
          good_id:this.data.information.good_id,
          num:this.properties.pronum,
          price,
          money,
          sku,
          shopping_car_id:this.properties.spcarid
        },
        success(res){
            wx.showToast({
              title: res.data.msg,
            })
            if(res.data.code==2000){
              that.triggerEvent("close",that.data.close)
            }
        }
      })
    },
    // input框输入
    inputNum(e){
      console.log(e.detail.value);
      let obj={
        num:e.detail.value,
        spid:this.properties.spcarid
      }
      this.triggerEvent("inputchangeNum",obj)
    },
    // 计算个数
    modifyNum(e){
      let type=e.currentTarget.dataset.type;
      if(type=="add"){
        console.log(1);
        this.properties.pronum++;
        this.setData({
          pronum:this.properties.pronum,
        })
      }else{
        this.properties.num--;
        this.setData({
          pronum:this.properties.pronum,
        })
      }
      let obj={
        num:this.properties.pronum,
        spid:this.properties.spcarid
      }
      this.triggerEvent("modifyNum",obj)
    },
    // 关闭弹窗
    closePop(){
      this.triggerEvent("close",this.data.close)
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
      console.log(this.data.skuinfo);
      this.setData({
        sku:this.data.sku,
        skuinfo:this.data.skuinfo,
        tapSKu:this.data.tapSKu
      })
    },
  },
  attached(){
    let that=this;
    let defaultsku=that.properties.item;
    wx.request({
      url: 'http://api_devs.wanxikeji.cn/api/goodInfo',
      data:{
        good_id:that.properties.goodid,
      },
      success(res){
        if(res.data.code==2000){
          that.data.information=res.data.data;
          let proinfo=res.data.data;
          let tempPri=proinfo.price;
          let priArr=tempPri.split(".");
          let tempsku=JSON.parse(res.data.data.info[0].edition);
          tempsku.sku_column.forEach(item=>{
              item.checked=0;
          });
          tempsku.sku_list.forEach((items,index)=>{
            if(items.sku.join()==defaultsku.sku.sku.join()){
              that.data.choosedSku=items;
            }
          });
          that.data.choosedSku.sku.forEach(item=>{
            tempsku.sku_column.forEach(items=>{
              items.value.forEach((itemss,index)=>{
                if(itemss==item){
                  items.checked=index;
                }
              })
            })
          });
          that.data.sku=tempsku;
          that.setData({
            price:priArr,
            information:that.data.information,
            sku:that.data.sku,
            choosedSku:that.data.choosedSku
          });
        }
      }
    })
  }
})
