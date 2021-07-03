module.exports = {
    intToBytes: function(e){
        var bytes = []
        for(var i=0;i<4;i++){
            bytes.push(e>>i*8 & 0xff)
        }
        bytes.reverse()
        return bytes
    },
    bytesToInt: function(b){
        var r = b[0]&0xff
        for(var i=1;i<b.length;i++){
            r = r | (b[i] & 0xff)<<8*i
        }
        return r
    }
}