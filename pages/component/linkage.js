// pages/component/linkage.js
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
    city:[
      {type:"A",
        value:["安徽省"]
      },
      {type:"B",
        value:["北京"]
      },
      {type:"C",
        value:["重庆市"]
      },
      {type:"F",
        value:["福建省"]
      },
      {type:"G",
        value:["甘肃省","广东省","广西壮族","贵州省"]
      },
      {type:"H",
        value:["海南省","河北省","河南省","黑龙江省","湖北省"]
      },
      {type:"J",
        value:["江西省","吉林省","江苏省"]
      },
      {type:"L",
        value:["辽宁省"]
      },
      {type:"N",
        value:["内蒙古","宁夏回族自治区"]
      },
      {type:"S",
        value:["陕西省","四川省","山东省","山西省"]
      },
    ],
    currentType:"",
    nodes:[],
    timer:null,
    scroll:false,
    scroll_info:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(e){
      let type=e.currentTarget.dataset.type;
      this.setData({
        currentType:type,
      })
    },
    queryMultipleNodes (){
      let query = wx.createSelectorQuery().in(this)
      let that=this;
      query.selectAll('.scrollitem').boundingClientRect(function(res){
        that.data.nodes=res;
      }).exec()
    },
    scroll(e){
      // 节流
      this.data.scroll_info=e //获取当前（停止滚动时）滚动事件
      if(this.data.scroll) return;//如果为真 跳出滚动事件
      this.data.scroll=true;
      setTimeout(()=>{
        // 首次执行scroll为false 进入setTimeout执行
        this.data.scroll=false;
        for(let i=0; i<this.data.nodes.length-2; i++){
          let scrolltop=this.data.scroll_info.detail.scrollTop+this.data.scroll_info.target.offsetTop;
            if(this.data.nodes[i].top<=scrolltop&&this.data.nodes[i+1].top>scrolltop){
              this.setData({
              currentType:this.data.city[i].type,
            })
          }
        }
      },2000)

      // 防抖
      // 如果之前有定时器就清除
      // if(this.data.timer){
      //   clearTimeout(this.data.timer);
      // }
      // this.data.timer=setTimeout(()=>{
      //   let scrolltop=e.detail.scrollTop+e.target.offsetTop;
      //   // this.data.timer=null;
      //   for(let i=0; i<this.data.nodes.length-2; i++){
      //     if(this.data.nodes[i].top<=scrolltop&&this.data.nodes[i+1].top>scrolltop){
      //       this.setData({
      //         currentType:this.data.city[i].type,
      //       })
      //     }
      //   }
      // },300)
    }
  },
  lifetimes:{
    ready(){
      this.queryMultipleNodes();//获取节点信息
    },
    attached(){
      this.setData({
        currentType:this.data.city[0].type
      })
    }
  }
})
