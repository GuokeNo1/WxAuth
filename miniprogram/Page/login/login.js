const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: "",
        password: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var password = wx.getStorageSync('Password')
        this.setData({password: password})
        if(app.globalData.user_info){
            this.setData({avatarUrl: app.globalData.user_info.avatarUrl})
        }
    },
    input: function(e){
        this.setData({password: e.detail.value})
        wx.setStorageSync('Password', this.data.password)
        app.globalData.password = this.data.password
        console.log("Login","保存密码成功")
    }
})