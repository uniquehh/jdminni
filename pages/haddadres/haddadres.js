// pages/haddadres/haddadres.js
import { axios } from "../../utils/util"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAdd:true,
    basicInfo:{
      name:"",
      tel:"",
      diqu:[],
      diquCode:[],
      dizhi:"",
    },
    tags:[
      {val:"学校",idx:"",},
      {val:"家",idx:"",},
      {val:"公司",idx:"",},
    ],
    shiBieVal:"",
    defautAdrs:false,

  },
  // 清空智能识别内容
  clearShiBie(){
    console.log(wx.getStorageSync('token'))
    this.setData({
      shiBieVal:"",
    })
  },
  // 智能识别--取值
  shiBieInput(e){
    this.data.shiBieVal = e.detail.value
  },
  // 智能识别--处理文本域内容，进行地址数据填充
  shiBieResult(){
    if(this.data.shiBieVal){
      let temp = this.data.shiBieVal.split("，")
      let telRlue = /(1[3|4|5|7|8][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
      if(!telRlue.test(temp[2])){
        wx.showToast({
          title: '电话号码格式错误',
          icon:"error",
        })
      }else{
        let rdiqu = temp[0].split("区")
        rdiqu[0] = rdiqu[0] + "区"
        rdiqu[2] = temp[1]
        rdiqu[3] = temp[2]
        console.log(rdiqu);
        this.data.basicInfo.name = rdiqu[2]
        this.data.basicInfo.tel = rdiqu[3]
        this.data.basicInfo.dizhi = rdiqu[1]
        rdiqu[0] = rdiqu[0].replace("省","省-")
        rdiqu[0] = rdiqu[0].replace("市","市-")
        rdiqu[0] = rdiqu[0].replace("区","区")
        this.data.basicInfo.diqu = []
        this.data.basicInfo.diqu.push(rdiqu[0])
        console.log(this.data.basicInfo.diqu);
        this.setData({
          basicInfo:this.data.basicInfo,
        })
      }
    }
  },
  // 收货人的取值渲染
  inputName(e){
    this.data.basicInfo.name = e.detail.value
    this.setData({
      basicInfo:this.data.basicInfo,
    })
  },
  // 联系方式的取值渲染
  inputTel(e){
    this.data.basicInfo.tel = e.detail.value
    this.setData({
      basicInfo:this.data.basicInfo,
    })
  },
  // 详细地址的取值渲染
  inputDiZhi(e){
    this.data.basicInfo.dizhi = e.detail.value
    this.setData({
      basicInfo:this.data.basicInfo,
    })
  },
  // 所在地区的选择和渲染
  pickerChange(e){
    console.log(e);
    this.data.basicInfo.diquCode = []
    this.data.basicInfo.diquCode = e.detail.code
    this.data.basicInfo.diqu=[]
    this.data.basicInfo.diqu.push(e.detail.value.join("-"))
    this.setData({
      basicInfo:this.data.basicInfo,
    })
  },
  // 获取是否设为默认地址
  isDefault(e){
    this.data.defautAdrs = e.detail.value
  },
  // 点击确定新增/修改地址
  async addAdress(e){
    let adrs = this.data.basicInfo
    if(adrs.name==""){
      wx.showToast({
        title: '请填写收货人',
      })
    }else if(adrs.tel==""){
      wx.showToast({
        title: '请填写联系方式',
      })
    }else if(adrs.diqu.length==0){
      wx.showToast({
        title: '请选择所在地区',
      })
    }else if(adrs.dizhi==""){
      wx.showToast({
        title: '请填写详细地址',
      })
    }else{
      if(this.data.isAdd){
        // 新增地址
        let res = await axios({
          url:'http://api_devs.wanxikeji.cn/api/userAddressAddModify',
          data:{
            token: wx.getStorageSync('token'),
            phone: this.data.basicInfo.tel,
            procince: this.data.basicInfo.diquCode[0],
            city:this.data.basicInfo.diquCode[1],
            area:this.data.basicInfo.diquCode[2],
            name:this.data.basicInfo.name,
            detailed:this.data.basicInfo.dizhi,
          },
        })
        if(res.statusCode == 200){
          if(res.data.code == 2000){
            wx.showToast({
              title: res.data.msg,
            })
            // 地址新增成功后判断新增时是否设为默认地址
            if(this.data.defautAdrs){
              // 请求地址列表
              let dres = await axios({
                url:'http://api_devs.wanxikeji.cn/api/userAddressList',
                data:{
                  token: wx.getStorageSync('token'),
                },
              })
              console.log("@",dres);
              let adresId = res.data.data[res.data.data.length-1].address_id;
              await axios({
                url:'http://api_devs.wanxikeji.cn/api/userAddressDfault',
                data:{
                  token: wx.getStorageSync('token'),
                  id:adresId,
                },
              })
              this.data.defautAdrs = false
            }
            let timer = setTimeout(()=>{
              wx.navigateBack()
              clearTimeout(timer)
            },1000)
          }else{
            console.log("参数错误");
          }
        }else{
          console.log("接口请求错误");
        }
      }else{
        // 编辑地址
        let res = await axios({
          url:'http://api_devs.wanxikeji.cn/api/userAddressAddModify',
          data:{
            token: wx.getStorageSync('token'),
            phone: this.data.basicInfo.tel,
            procince: this.data.basicInfo.diqu[0],
            city:this.data.basicInfo.diqu[1],
            area:this.data.basicInfo.diqu[2],
            name:this.data.basicInfo.name,
            detailed:this.data.basicInfo.dizhi,
            address_id:wx.getStorageSync('editAdres').address_id,
          },
        })
        if(this.data.defautAdrs){
          await axios({
            url:'http://api_devs.wanxikeji.cn/api/userAddressDfault',
            data:{
              token: wx.getStorageSync('token'),
              id:wx.getStorageSync('editAdres').address_id,
            },
          })
          this.data.defautAdrs = false
        }
        wx.showToast({
          title: res.data.msg,
        })
        let timer = setTimeout(()=>{
          wx.navigateBack()
          clearTimeout(timer)
        },1000)
      }
    }
  },
  // 删除地址
  deleteAdres(){
    let that = this
    wx.showModal({
      title: '删除地址',
      content:"提示：删除后不可恢复",
      async success(res){
        if(res.confirm){
          let res = await axios({
            url:'http://api_devs.wanxikeji.cn/api/userAddressDelete',
            data:{
              token: wx.getStorageSync('token'),
              id:wx.getStorageSync('editAdres').address_id,
            },
          })
          let nbasicInfo = {
            name:"",
            tel:"",
            diqu:[],
            diquCode:[],
            dizhi:"",
          }
          // 删除后重置数据
          that.setData({
            basicInfo:nbasicInfo,
          })
          wx.navigateBack()
        }else{
          console.log("取消删除");
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.adres == "add"){
      this.setData({
        isAdd:true,
      })
    }else if(options.adres == "edit"){
      let editAdres = wx.getStorageSync('editAdres')
      console.log(editAdres);
      // 编辑进入--渲染数据
      this.data.basicInfo.name = editAdres.name
      this.data.basicInfo.tel = editAdres.phone
      this.data.basicInfo.dizhi = editAdres.detailed
      this.data.basicInfo.diqu[0] = editAdres.procince
      this.data.basicInfo.diqu[1] = editAdres.city
      this.data.basicInfo.diqu[2] = editAdres.area
      if(editAdres.default==1){
        this.data.defautAdrs = true
      }
      this.setData({
        defautAdrs:this.data.defautAdrs,
        basicInfo:this.data.basicInfo,
        isAdd:false,
      })
    }
  },
  // 标签选择的点击事件
  selectTag(e){
    console.log(e);
    this.data.tags.forEach((item)=>{
      item.idx = ""
    })
    this.data.tags[e.currentTarget.dataset.index].idx = e.currentTarget.dataset.index;
    this.setData({
      tags:this.data.tags,
    })
  },
  // 添加标签
  addTag(){
    let that = this
    wx.showModal({
      title: '添加标签',
      editable: true,
      placeholderText: "标签内容在1-4字之间",
      success(res){
        if(res.confirm){
          console.log(res);
          if(res.content.length>=1&&res.content.length<=4){
            that.data.tags.push({val:res.content,idx:"",})
            that.setData({
              tags:that.data.tags,
            })
          }else{
            wx.showToast({
              title: '内容格式有误',
              icon:"error",
            })
          }
        }else{
          console.log("取消添加");
        }
      }
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