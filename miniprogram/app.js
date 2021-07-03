//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    //获取用户信息
    wx.getUserInfo({
      success: res=>{
        this.globalData.user_info = res.userInfo
        console.log("APP","获取用户数据成功")
        console.log("APP",`调用${this.globalData.getInfoEvents.length}个getInfoEvents`)
        while(this.globalData.getInfoEvents.length>0){
          this.globalData.getInfoEvents[this.globalData.getInfoEvents.length-1]()
          this.globalData.getInfoEvents.pop()
        }
      }
    })
    //登陆获取token
    wx.cloud.callFunction({
      name: "login",
      success: (res)=>{
        this.globalData.user_token = res.result.openid
        console.log("APP","登陆成功")
        console.log("APP",`调用${this.globalData.loginEvents.length}个loginEvents`)
        while(this.globalData.loginEvents.length>0){
          this.globalData.loginEvents[this.globalData.loginEvents.length-1]()
          this.globalData.loginEvents.pop()
        }
      },
      fail: (res)=>{
        wx.showToast({
          title: '无法登陆',
          duration: 1,
          icon: fail,
          mask: true,
          success: (res) => {},
          fail: (res) => {},
          complete: (res) => {},
        })
      }
    })
    //获取Password本地存储的
    var password = wx.getStorageSync('Password')
    console.log("APP","Password",password)
    this.globalData = {
      loginEvents: [],
      getInfoEvents: [],
      password: password
    }
  }
})
