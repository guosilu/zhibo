const app = getApp();
const config = require('../../config/config.js');
const commonFun = require("../../js/commonFun.js");
const fileHandleObjFile = require("../../js/fileHandleObj.js");
const fileHandleObj = new fileHandleObjFile.upload();  //实例化
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catList: [
      { 'name': '请选择', 'catid': 0 },
      { 'name': '教育', 'catid': 4},
      { 'name': '新闻', 'catid': 5},
      { 'name': 'MV' , 'catid': 6},
    ],
    thumbPath: [],
    thumbSize: '',
    videoPath: [],
    videoSize: '',
    catIndex: 0,
    uploadProgress: {},//上传进度
    showUploadProgress: false,
    submitDisabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //表单提交
  formSubmit: function (e) {
    this.setData({
      submitDisabled: true,
    })
    var that = this;
    var submitVal = e.detail.value;
    var post = submitVal;
    fileHandleObj.ele = this;
    fileHandleObj.fileObjList = this.fileParamConfig();
    //表单验证
    if (!this.submitCheck(submitVal)) {
      this.setData({
        submitDisabled: false,
      })
      return false;
    }
    post['openId'] = app.globalData.openId;
    this.showLoading('正在上传文件...');
    fileHandleObj.uploadFileNameList().then(res => {
      that.setData({
        uploadProgress: {},
        showUploadProgress: false,
      })
      var uploadStatus = 0;
      for (let i = 0; i < res.length; i++) {
        if (res[i].columnName && res[i].fileUrl) {
          post[res[i].columnName] = res[i].fileUrl;
          uploadStatus += 1;
        }
      }
      console.log(uploadStatus);
      console.log(res.length);
      if (uploadStatus == res.length) {
        var dataObj = {
          url: config.videoUrl,
          data: {
            action: 'add',
            post: post,
          }
        }
        wx.hideLoading();
        that.showLoading('正在提交数据...', true)
        commonFun.request(dataObj).then(res => {
          if (res > 0) {
            wx.hideLoading();
            //that.showTip('提交完成!');
            that.showLoading('提交完成...', true)
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/my/my'
              })
            }, 1000)
          }
        });

      } else if (uploadStatus > 0 && uploadStatus < res.length) {
        that.setData({
          submitDisabled: false,
        })
        that.showTip("文件上传不完整!");

      } else if (uploadStatus == 0) {
        that.setData({
          submitDisabled: false,
        })
        that.showTip("文件上传失败!");

      }
    })
  },

  //上传文件参数配置
  fileParamConfig: function () {
    var fileObjList = [];
    fileObjList.push({
      filePath: this.data.thumbPath[0],
      columnName: 'thumb',
    });
    fileObjList.push({
      filePath: this.data.videoPath[0],
      columnName: 'video',
    });
    return fileObjList;
  },

  //验证表单
  submitCheck: function (submitVal) {
    if (submitVal.catid < 1) {
      this.showTip('请选择分类');
      return false;
    }
    if (submitVal.title == '') {
      this.showTip('请填写标题');
      return false;
    }
    if (this.data.thumbPath == '') {
      this.showTip('至少传一个图');
      return false;
    }
    if (this.data.videoPath == '') {
      this.showTip('请录制或选择一个小视频');
      return false;
    }
    if (parseFloat(this.data.videoSize) > 100) {
      this.showTip('很抱歉，视频最大允许20M，当前为' + this.data.videoSize + 'M');
      return false;
    }
    return true;
  },

  //选择图片
  chooseImage: function () {
    var that = this;
    var thumbPath = [];
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        that.setData({
          thumbPath: thumbPath.concat(res.tempFiles[0].path),
          thumbSize: res.tempFiles[0].size,
        });
      }
    })
  },

  //选择视频
  chooseVideo: function () {
    var that = this;
    var thumbPath = [];
    var videoPath = [];
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        console.log(res)
        that.setData({
          //thumbPath: thumbPath.concat(res.thumbTempFilePath),
          videoPath: videoPath.concat(res.tempFilePath),
          videoSize: (res.size / (1024 * 1024)).toFixed(2),
        });
      }
    })
  },

  //删除图片
  deleteImage: function () {
    this.setData({
      thumbPath: '',
      thumbSize: '',
    })
  },

  //删除视频
  deleteVideo: function () {
    this.setData({
      videoPath: '',
      videoSize: '',
    })
  },

  //取消上传任务
  stopTask: function () {
    this.setData({
      uploadProgress: {},
      showUploadProgress: false,
      submitDisabled: false,
    });
    fileHandleObj.stopTask();
  },

  //图片预览
  previewImage: function (e) {
    var image = e.target.dataset.src
    wx.previewImage({
      current: image,
      urls: [image]
    })
  },

  //选择
  bindPickerChange: function (e) {
    this.setData({
      catIndex: e.detail.value
    })
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

  },
})