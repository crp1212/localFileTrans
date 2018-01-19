import Lib from './lib.js'
class Ws extends Lib{
    constructor (url, cb, options) {
        super()
        this.socket = new WebSocket(url)
        this.cb = cb || function noop () {}
        this.eventObj = {}
        this.onceObj = {}
        this.options = options
        this.init()
    }

    init () {
        var isFunction = this.isFunction
        this.socket.addEventListener('message', (e) => {
            this.normalize(e.data)
        })
        this.socket.addEventListener('error', (e) => {
            console.log('websocket 连接出错')
        })
        this.socket.addEventListener('open', (e) => {
            console.log('websocket 连接成功')
            this.cb()
        })
        if (this.options && this.isObject(this.options)) {
            isFunction(this.options.nodef) ? this.eventObj.nodef = this.options.nodef : console.log('未定义对未知时间的处理')
            isFunction(this.options.normalError) ? this.eventObj.normalError = this.options.normalError : console.log('未定义对websokce发送是普通字符串的处理')
        }
    }

    normalize (str) {
        try {
            var obj = JSON.parse(str)
            this.emit(obj.type, obj)
        } catch (error) {
            this.emit('normal', str)
        }
        
    }

    on (type, cb) { // 添加事件监听
        var obj = this.eventObj
        if (!obj[type]) {
            obj.type = []
        }
        obj.type.push(cb)
    }

    once (uuid, cb) {
        var obj = this.eventObj
        obj[uuid] = [function () {
            cb()
            this.eventObj[uuid] = null
        }]
        console.log(this.eventObj)
    }

    emit (type, str) {
        var arr = this.eventObj[type] || []
        console.log(arr)
        arr.forEach(cb => {
            cb(str)
        })
    }


    send (type, data, cb) {
        var uuid = Date.now()
        data.type = type
        data.uuid = uuid
        this.socket.send(JSON.stringify(data))
        if (cb) {
            this.once(uuid, cb)
        }

    }
}
export default Ws