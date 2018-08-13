const api = require('./api.js')

const wxRequest = (params,url,successCallback,errorCallback,completeCallback)=>{
    wx.request({
      url: url+params,

      success: function (res) {
        if(res.statusCode==200){
          successCallback(res.data);
        }else{
          errorCallback(res);
        }
      },
      fail:function(res){
        errorCallback(res);
      },
      complete:function(res){
        completeCallback(res);
      }
    })
}


const getDygDelivery = (params, s, e, c) => wxRequest(params, api.API_TARGET,s,e,c);

const addCounts = (params, s, e, c) => wxRequest(params, api.API_ADD_COUNT, s, e, c);

module.exports={
  getDygDelivery: getDygDelivery,
  addCounts: addCounts
}