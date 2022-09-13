const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
// async await 解决授权登录的回调地狱
function getUserProFile(){
  return new Promise((reslove,reject)=>{
    wx.getUserProfile({
      desc: 'login',
      success(res){
        reslove(res)
      }})
  })
}
function getUserCode(){
  return new Promise((reslove,reject)=>{
    wx.login({
      success(res){
        reslove(res)
      }
    })
  })
}
function axios(options){
  return new Promise((reslove,reject)=>{
    wx.request({
      ...options,
      success(res){
        reslove(res)
      }
    })
  })
}
module.exports = {
  formatTime,getUserProFile,getUserCode,axios,
}
