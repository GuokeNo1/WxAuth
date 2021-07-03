// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database()
    var res = await db.collection("Tokens").add({data:{user_id:wxContext.OPENID, rtype: event.rtype,name: event.name, key: event.key, hash: event.hash}})
    return res
}