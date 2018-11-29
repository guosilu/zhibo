const config = require('../../config/config.js');
const commonFun = require("../../js/commonFun.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    history_list: {},
    allList: {},
    loadingComplate: 0,
    currentData: 0,
  },
  //列表
  getList: function () {
    let dataObjList = [
      {
        name: 'collectList',
        url: config.collectUrl,
        data: {
          action: 'list',
          post: {
            openId: app.globalData.openId
          }
        }
      },
      {
        name: 'historyList',
        url: config.collectUrl,
        data: {
          action: 'history',
          post: {
            openId: app.globalData.openId
          }
        }
      }
    ]
    let that = this;
    commonFun.getList(dataObjList).then(function (res) {
      that.setData({
        allList: res
      });
      that.stopRefresh();
      console.log(res);
    });
  },

  stopRefresh: function () {
    this.setData({
      loadingComplate: 1,
    })
    wx.hideLoading();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载...',
    })
    this.getList();
  },
  
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getList();
  },

  onShow: function (options) {
    
  },

  player:function(){
    wx.navigateTo({
      url: config.player,
    })
  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },

  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  }
})
