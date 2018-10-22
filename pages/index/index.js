const config = require("../../config/config.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userListInfo: [{
      icon: config.img+'bd1.png',
      text1: '136堂自我管理课：培养孩子收益……',
      btcon: '善用工具，帮助孩子管理好自己！'
    }, {
        icon: config.img +'bd1.png',
      text1: '236堂自我管理课：培养孩子收益……',
      btcon: '善用工具，帮助孩子管理好自己！'
    }, {
        icon: config.img +'bd1.png',
      text1: '336堂自我管理课：培养孩子收益……',
      btcon: '善用工具，帮助孩子管理好自己！'
    }],
    rmary: [{
      rmimg: config.img +'rm1.png',
      rmtit: '方法比努力更重要:21堂x小学生……',
      rmcon: '帮助孩子练出最强记忆力'
    }, {
        rmimg: config.img +'rm2.png',
      rmtit: '方法比努力更重要:21堂x小学生……',
      rmcon: '帮助孩子练出最强记忆力'
    }, {
        rmimg: config.img +'rm3.png',
      rmtit: '方法比努力更重要:21堂x小学生……',
      rmcon: '帮助孩子练出最强记忆力'
    }, {
        rmimg: config.img +'rm4.png',
      rmtit: '方法比努力更重要:21堂x小学生……',
      rmcon: '帮助孩子练出最强记忆力'
    }],
    mjary: [{
      mjimg: config.img +'zj1.png',
      mjtit: '曹文轩',
      mjcon: '著名儿童文学家，北京大学教授、博士生导师'
    }, {
        mjimg: config.img +'zj2.png',
      mjtit: '刘心武',
      mjcon: '著名儿童文学家，北京大学教授、博士生导师'
    }, {
        mjimg: config.img +'zj3.png',
      mjtit: '胡萍',
      mjcon: '著名儿童文学家，北京大学教授、博士生导师'
    }]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: config.log
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})