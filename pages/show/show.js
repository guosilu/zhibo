const app = getApp();
const config = require('../../config/config.js');
const commonFun = require("../../js/commonFun.js");
const payFile = require("../../js/pay.js");
const collectFile = require("../../js/collect.js");
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  data: {
    detail: {},
    src: '',
    watchPower: null,//试看,完整权限
    collect_status: null, //关注
    duration: 5,//视频长度
    danmuList: []//弹幕
  },

  //生命周期函数onReady
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo');
  },

  //生命周期函数onLoad
  onLoad: function (options) {
    this.showLoading('正在加载...');
    let itemid = options.itemid
    this.getDetail(itemid);
  },

  //详情
  getDetail: function (itemid) {
    let that = this;
    let watchPower;
    let dataObj = {
      url: config.videoUrl,
      data: {
        action: 'detail',
        post: {
          itemid: itemid,
          openId: app.globalData.openId
        },
      }
    }
    commonFun.request(dataObj).then(res => {
      wx.hideLoading();
      watchPower = (res.openId == app.globalData.openId) === true ? true : (res.is_charge == 1 && res.power == 0 ? false : true);
      res.is_charge = (res.openId == app.globalData.openId) === true ? 0 : res.is_charge;
      console.log(res);
      that.setData({
        detail: res,
        watchPower: watchPower,
        danmuList: res.danmu,
        collect_status: res.collect_status
      })
    });
  }, 

  //监听播放时间
  timeupdate: function (e) {
    let currentTime = parseFloat(e.detail.currentTime);
    let watchPower = this.data.watchPower;
    let duration = parseFloat(this.data.duration);
    this.setData({
      currentTime: currentTime
    })
    if (watchPower === false && currentTime >= duration) this.payTip();
  },

  //提示支付
  payTip: function () {
    let that = this;
    let money = this.data.detail.charge;
    this.videoContext.stop();//终止视频播放
    // console.log(currentTime)
    wx.showModal({
      title: '提示',
      content: '试看还满意吗？' + money + '元支持一下把！',
      confirmText: "好的",
      cancelText: "不了",
      success(res) {
        if (res.confirm) {
          that.wxPay();//调起支付
        } else if (res.cancel) {}
      }
    });
  },

  //调起支付
  wxPay: function () {
    let that = this;
    let total_fee = parseFloat(this.data.detail.charge) * 100;
    payFile.pay({
      body: "山东正大视频消费",
      total_fee: total_fee,
      openId: app.globalData.openId,
      onExec: (res) => {
        if (res.errMsg == "requestPayment:ok") {
          console.log("存储数据")
          that.showLoading('正在处理数据...');
          that.addData();
        }
      }
    });
  },

  //支付成功后添加数据
  addData: function () {
    let that = this;
    let itemid = that.data.detail.itemid;
    let openId = app.globalData.openId;
    let money = this.data.detail.charge;
    let dataObj = {
      url: config.videoUrl,
      data: {
        action: "pay",
        post: {
          itemid: itemid,
          openId: openId,
          money: money
        }
      }
    }
    commonFun.request(dataObj).then(function (res) {
      wx.showToast({
        icon: "none",
        title: res,
      })
      that.setData({
        watchPower: true,
        'detail.power': 1
      })
    });
  },

  //关注
  collect: function () {
    let that = this;
    let id = this.data.detail.itemid;
    let cur_collect = parseInt(this.data.detail.collect);
    let collect_status = this.data.collect_status;
    let act = collect_status == 1 ? "minus" : "add";
    if (this.data.detail.openId == app.globalData.openId) {
      wx.showToast({
        icon: 'none',
        title: '您不能关注自己！'
      });
      return false;
    }
    collectFile.collect({
      id: id,
      act: act,
      itemType: "video",
      onExec: (res) => {
        if (res == 1) {
          let collect_status = act == "add" ? 1 : 0;
          let collect = act == "add" ? cur_collect + 1 : cur_collect - 1;
          that.setData({
            collect_status: collect_status,
            'detail.collect': collect
          });
        }
      }
    })
  },

  //获取输入弹幕
  getInput: function (e) {
    this.setData({
      danmu: e.detail.value
    });
  },

  //发送弹幕
  sendDanmu: function () {
    let that = this;
    let itemid = that.data.detail.itemid;
    let danmuList = this.data.danmuList;
    let content = this.data.danmu;
    //let content = Math.random().toString(36).substr(2);
    let color = getRandomColor();
    let currentTime = Math.ceil(this.data.currentTime);
    let danmuListAdd = {
      text: content,
      color: color,
      time: currentTime
    }
    this.data.danmuList.push(danmuListAdd)
    console.log(this.data.danmuList)
    this.videoContext.sendDanmu({
      text: content,
      color: color
    })
    this.setData({
      danmu: ""
    });
    console.log(this.data.danmuList)
    commonFun.request({
      url: config.videoUrl,
      data: {
        action: 'danmu',
        post: {
          itemid: itemid,
          openId: app.globalData.openId,
          playtime: currentTime,
          content: content,
          color: color
        },
      }
    }).then(res => {
      console.log(res);
    });
  },
  
  //提示方法
  showTip: function (msg) {
    wx.showToast({
      icon: 'none',
      title: msg,
    })
  },

  //加载方法
  showLoading: function (msg, mask) {
    var mask = mask || false;
    wx.showLoading({
      mask: mask,
      title: msg,
    })
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

  },

  //获取随机色
  /*getRandomColor: function () {
    let rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length == 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  },

  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  // bindButtonTap: function () {
  //   var that = this
  //   wx.chooseVideo({
  //     sourceType: ['album', 'camera'],
  //     maxDuration: 60,
  //     camera: ['front', 'back'],
  //     success: function (res) {
  //       that.setData({
  //         src: res.tempFilePath
  //       })
  //     }
  //   })
  // },
  bindSendDanmu: function () {
    console.log();
    this.videoContext.play();
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  }*/
})