// Component/card/card.js
Component({
  /**
   * 组件的属性列表
   * type   0:demo |  1:Steam
   */
  properties: {
    name: {
      type: String,
      value: "Demo"
    },
    secretKey: {
      type: String,
      value: ""
    },
    rtype: {
      type: Number,
      value: 0
    },
    iscloud: {
      type: Boolean,
      value: false
    },
    enc:{
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    code: "-----",
    stype: "demo",
    thread: -1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  },
  ready: function(){
    // wx.cloud.database().collection().count
    switch(this.data.rtype){
      case 1:
        this.setData({stype: "steam"})
        if(this.data.iscloud && this.data.enc){
          this.setData({name: this.data.name+"-密钥解密失败"})
          break
        }
        this.data.thread = setInterval(()=>{
          var steam = require("../../tools/steam.js")
          var code = steam.calculateCode(this.data.secretKey)
          this.setData({code: code})
        },1000)
        break
      default:
        this.setData({code: "-----"})
        break
    }
  },
  detached: function(){
    if(thread!=-1){
      clearInterval(this.data.thread)
    }
  }
})
