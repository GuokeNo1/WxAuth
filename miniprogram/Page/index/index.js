const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_token: "",
    avatarUrl: "/Image/nologin.png",
    cards: [],
    remote: [],
    local: [],
  },
  onLoad: function (options) {
    if(app.globalData.user_token){
      this.setData({user_token: app.globalData.user_token})
    }else{
      app.globalData.loginEvents.push(()=>{
        this.setData({user_token: app.globalData.user_token})
      })
    }
    if(app.globalData.user_info){
      this.setData({avatarUrl: app.globalData.user_info.avatarUrl})
    }else{
      app.globalData.getInfoEvents.push(()=>{
        this.setData({avatarUrl: app.globalData.user_info.avatarUrl})
      })
    }
    
    this.load_cards()
  },
  load_cards: function(){
    this.data.cards = []
    var local = wx.getStorageSync('local')
    var remote = wx.getStorageSync('remote')
    if(local){
      for(var i in local){
        this.data.cards.push(local[i])
      }
    }
    if(remote){
      for(var i=0;i<remote.length;i++){
        this.data.cards.push(remote[i])
      }
    }else{
      this.update_remote()
    }
    if(!local && !remote){
      this.data.cards = [{rtype:0,name:"这是个栗子"}]
    }else{
      var no_max = 0
      for(var i=0;i<this.data.cards.length;i++){
        if(this.data.cards[i].no){
          no_max > this.data.cards[i].no? no_max:this.data.cards[i].no
        }
      }
      for(var i=0;i<this.data.cards.length;i++){
        if(!this.data.cards[i].no){
          no_max += 1
          this.data.cards[i].no = no_max
        }
      }
      this.data.cards.sort((a,b)=>{return a.no-b.no})
      for(var i=0;i<this.data.cards.length;i++){
        this.data.cards[i].no = i+1
      }
    }
    this.data.local = local
    this.data.remote = remote
    if(this.data.remote){
      wx.setStorageSync('remote', this.data.remote)
    }
    if(this.data.local){
      wx.setStorageSync('local', this.data.local)
    }
    this.setData({cards: this.data.cards})
  },
  update_remote: function(){
    wx.cloud.callFunction({
      name: "download_tokens",
      complete: res=>{
        var remote = this.data.remote
        if(!remote){
          remote = []
        }
        var hashs = []
        for(var i in remote){
          hashs.push(remote[i].hash)
        }
        for(var i in res.result){
          if(hashs.indexOf(res.result[i].hash)>-1){
            continue
          }
          remote.push(res.result[i])
        }
        for(var i in remote){
          remote[i].enc = true
          var crypto = require('../../tools/crypto.js')
          var key = crypto.Guoke.decrypt(remote[i].key,app.globalData.password)
          if(crypto.MD5(key).toString() == remote[i].hash){
            remote[i].key = key
            remote[i].enc = false
          }
        }
        this.data.remote = remote
        wx.setStorageSync('remote', remote)
        if(remote.length>0)
          this.load_cards()
      }
    })
  },
  login: function(e){
    wx.navigateTo({
      url: '/Page/login/login',
      events: {},
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  add_card: function(e){
    wx.navigateTo({
      url: '/Page/addCard/addCard',
      events: {},
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  }

})