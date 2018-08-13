//index.js

const wxRequest = require('../../utils/request.js')
const util = require('../../utils/util.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:null,
    errorText:null,
    errorShow:false,
    animationError:{},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    historySearch:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
      });
      app.globalData.canSearch = true;

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        });
        app.globalData.canSearch = true;

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          });
          app.globalData.canSearch = true;

        }
      })
    } 

    var history = wx.getStorageSync('objList');
    if(history.length>0){
      this.setData({
        historySearch: JSON.parse(history),
      });
    }
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
   
    var params = this.data.userInfo.nickName;
    wxRequest.addCounts(params, data => {
     
      if (data.code != 200) {
        this.showError('未知错误！');
      }
    }, data => {
      this.showError(data.data.error);
    }, data => {
    });
    return {
      title: '我正在用柜号快查，很方便的查到了西门收发室快递的柜号，你也来试一下吧！',
    }
  },

  username: function (e) {
      this.setData({'username':e.detail.value})
  },

  search:function(){
    if (app.globalData.canSearch){
      var name = this.data.username;
      if (!name) {
        this.showError('名字不能为空！');
        return;
      } else if (name.length > 20) {
        this.showError('名字过长！');
        return;
      } else {
        this.goToDeails();
      }
    }else{
      this.showError('未授权不能查询');
      return;
    }    
    
    
  },

  clear:function(e){
    this.setData({ username: '' })
  },

  animateError: function (opacity) {
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.opacity(opacity).step();

    this.setData({ animationError: animation.export() });

  },

  showError:function(text){
    this.animateError(1);
    this.setData({ errorText: text, errorShow:true});

    setTimeout(function () {
      this.animateError(0);
    }.bind(this), 2000);

    setTimeout(function () {
      this.setData({errorShow: false });
    }.bind(this), 3000);

  },
  goToDeails:function(){
      var username = this.data.username;
      var params = username + '/' + this.data.userInfo.nickName
      util.showLoading('查询中');
      wxRequest.getDygDelivery(params,data=>{
        try{
          var data_length = data.datas.length;
        }catch(e){
          this.showError('未知错误，请重新查询');
          return;
        }
        if (data.code == 200 && data_length>0){
          app.globalData.listData=data.datas;
          this.saveLocal();
          wx.navigateTo({
            url: '../details/details?name='+username,
          });   
        }else if(data.code==444){
          this.showError('查询超过限制次数了！');
        }else{
          this.showError('未查询到相关数据！');
        }
      }, data => {
        this.showError(data.errMsg);
        }, data => {
          util.hideLoading();
          this.onLoad();                
        })
  },
  getUserInfo: function (e) {
    if (e.detail.errMsg =='getUserInfo:ok'){
      app.globalData.userInfo = e.detail.userInfo
      app.globalData.hasUserInfo =true;
      app.globalData.canSearch=true;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
      });
    }
  },
  saveLocal:function(){

    var list = app.globalData.listData;

    var objList ={
      name: this.data.username,
      data: list[0]
    };

    var objLists = wx.getStorageSync('objList');
    if(objLists.length>0){
      objLists = JSON.parse(objLists);

      for(var i in objLists){
        if(objLists[i].name==this.data.username){
          objLists.splice(i,1);
        }
      }
    }else{
      objLists=[];
    }

    objLists.unshift(objList);
    objLists =JSON.stringify(objLists);
    wx.setStorageSync('objList', objLists);
  },

  historySearch:function(e){
    this.setData({
      username: e.currentTarget.dataset.name
    })
    this.search();
  },
  feed:function(){
    wx.setClipboardData({
      data: 'ssy15818454571',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '微信号已复制！',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  }
})