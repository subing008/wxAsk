var fs = require('fs');
var request = require('request');
var crypto = require('crypto');
const jsapiTokenFile = ".jssdktoken.json";
const accessTokenFile = ".accesstoken.json";

function weixinsdk(appid,appsecret){
  this.appId = appid;
  this.appSecret = appsecret;
}

weixinsdk.prototype = {
  createNonceStr: function(){
    return Math.random().toString(36).substr(2, 15);
  },

  createTimestamp: function(){
    return parseInt(new Date().getTime() / 1000) + '';
  },

  rew: function(args){
    var keys = Object.keys(args);
    keys = keys.sort()
    var newArgs = {};
    keys.forEach(function (key) {
      newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  },

  readCacheFile: function(filename){
    try {
      return JSON.parse(fs.readFileSync(filename));
    } catch (e) {
      console.log("read file failed!");
    }
    return {};
  },

  writeCacheFile: function(filename,data){
    return fs.writeFileSync(filename,JSON.stringify(data));
  },

  getAccessToken: function(callback){
    var data = this.readCacheFile(accessTokenFile);
    var curtiem = new Date().getTime() / 1000;
    var instance = this;

    if ( typeof data.expireTime === "undefined" || data.expireTime < curtiem) {
      var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + this.appId + "&secret=" + this.appSecret;
      request.get(url,function(err,res,body){
        if (err) {
          callback(err);
        }

        var access_token = JSON.parse(body).access_token;
        instance.writeCacheFile(accessTokenFile,{
          accessToken: access_token,
          expireTime: curtiem + 7200,
        });

        callback(null,access_token);
      });
    }else{
      callback(null,data.accessToken);
    }
  },

  getJsApiTicket: function(callback){
    var data = this.readCacheFile(jsapiTokenFile);
    var curtiem = new Date().getTime() / 1000;
    var instance = this;

    if ( typeof data.expireTime === "undefined" || data.expireTime < curtiem) {
      instance.getAccessToken(function(err,accessToken){
        if( err ){
            callback(err);
        }

        const url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=" + accessToken;
        request.get(url,function(err,res,body){
          if (err) {
            callback(err);
          }

          var jsapi_ticket = JSON.parse(body).ticket;
          instance.writeCacheFile(jsapiTokenFile,{
            JsApiTicket: jsapi_ticket,
            expireTime: curtiem + 7200,
          });
          callback(null,jsapi_ticket);
        });
      });
    }else{
      callback(null,data.JsApiTicket);
    }
  },

  getSignPackage: function(url,callback){
    var instance = this;
    instance.getJsApiTicket(function(err,jssdkToken){
      if (err) {
        callback(err);
      }

      var ret = {
        jsapi_ticket: jssdkToken,
        nonceStr: instance.createNonceStr(),
        timestamp: instance.createTimestamp(),
        url: url
      };

      var string = instance.rew(ret);
      var hash = crypto.createHash('sha1');
      ret.signature = hash.update(string).digest('hex');
      ret.appId = instance.appId;
      ret.appSecret = instance.appSecret;
      callback(null,ret);
    })
  },
}

var js = new weixinsdk("wxc91966ee5d3eaebc","bba039ca1a84ce1816601507120fb9ff");
module.exports = js;
