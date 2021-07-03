const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        password: "",
        rtype: 1,
        sercet_key: "",
        name: "",
        cloud_checked: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({password: app.globalData.password})
    },
    change_type: function(e){
        this.setData({rtype: parseInt(e.detail.value)})
    },
    input: function(e){
        this.setData({sercet_key: e.detail.value})
    },
    input_name: function(e){
        this.setData({name: e.detail.value})
    },
    cloud_check: function(e){
        this.setData({cloud_checked: !this.data.cloud_checked})
    },
    add_btn: function(e){
        if(!this.data.sercet_key || !this.data.name){
            wx.showToast({
              title: '信息不完善',
              duration: 1000,
              icon: "error",
              complete: ()=>{
                  return
              }
            })
            return
        }
        var message = {rtype: this.data.rtype,name: this.data.name,key: this.data.sercet_key}
        if(this.data.cloud_checked){
            var upload_data = {rtype: this.data.rtype,name: this.data.name,key: this.data.sercet_key}
            var crypto = require("../../tools/crypto.js")
            var hash = crypto.MD5(this.data.sercet_key).toString()
            var p = crypto.MD5(this.data.password)
            message["hash"] = hash
            upload_data["hash"] = hash
            upload_data["key"] = crypto.Guoke.encrypt(message.key,this.data.password)
            console.log(upload_data)
            wx.cloud.callFunction({
                name: "upload_secret_key",
                data: upload_data,
                complete: console.log
            })
            message['enc'] = true
            var remote = wx.getStorageSync('remote')
            if(!remote){
                remote = []
            }else{
                for(var i in remote){
                    if (remote[i].name == message.name && remote[i].hash == message.hash){
                        return
                    }
                }
            }
            var local = wx.getStorageSync('local')
            if(local){
                for(var i in local){
                    if (local[i].name == message.name && local[i].key == message.key){
                        local.splic(i,1)
                    }
                }
                wx.setStorageSync('local', local)
            }
            remote.push(message)
            wx.setStorageSync('remote', remote)
        }
        else{
            var local = wx.getStorageSync('local')
            if(!local){
                local = []
            }else{
                for(var i in local){
                    if (local[i].name == message.name && local[i].key == message.key){
                        return
                    }
                }
            }
            local.push(message)
            wx.setStorageSync('local', local)
        }
        wx.navigateBack({
          delta: 0,
          success: (res) => {
              wx.showToast({
                title: 'OK',
                duration: 1000,
              })
          }
        })
    }
})