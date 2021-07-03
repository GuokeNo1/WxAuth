// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const db = cloud.database()
    const MAX_LIMIT = 100
    var total = (await db.collection("Tokens").where({user_id: wxContext.OPENID}).count()).total
    const batchTimes = Math.ceil(total / 100)
    var result = []
    for(let i=0;i<batchTimes;i++){
        const res = await db.collection('Tokens').where({user_id: wxContext.OPENID}).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
        for(var k in res.data){
            result.push(res.data[k])
        }
    }
    return result
}