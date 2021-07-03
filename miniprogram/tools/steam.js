const crypto = require("crypto.js");
const tools = require("tools.js");

module.exports = {
  inputs: ["Shared Secret"],
  output_length: 5,
  calculateCode: function(shared){
    var STEAMCHARS = "23456789BCDFGHJKMNPQRTVWXY"
    var data = parseInt(Date.now()/30000)
    var edata = crypto.enc.Hex.parse((data).toString(16).padStart(16,'0'))
    var res = crypto.HmacSHA1(edata,crypto.enc.Base64.parse(shared)).words
    var mac = []
    for(var w in res){
      var t = tools.intToBytes(res[w])
      for(var i in t){
        mac.push(t[i])
      }
    }
    var start = mac[19] & 0x0f
    var bytes = []
    for(var i=start;i<start+4;i++){
      bytes.push(mac[i])
    }
    bytes.reverse()
    var fullcode = tools.bytesToInt(bytes) & 0x7fffffff
    var code = ""
    for(var i=0;i<this.output_length;i++){
      code += STEAMCHARS[fullcode%STEAMCHARS.length]
      fullcode /= STEAMCHARS.length
      fullcode = parseInt(fullcode)
    }
    return code
  }
}