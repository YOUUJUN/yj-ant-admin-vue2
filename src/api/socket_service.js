class HeartCheck {
  ws = null
  timeout = 45000
  timeoutObj = null
  serverTimeoutObj = null

  constructor(ws) {
    this.ws = ws
  }

  reset() {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    return this
  }
  start() {
    this.timeoutObj && clearTimeout(this.timeoutObj)
    this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj)
    this.timeoutObj = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      this.ws.send('HeartBeat')
      console.log('ping')
      this.serverTimeoutObj = setTimeout(() => {
        // 如果超过一定时间还没重置，说明后端主动断开了
        console.log('关闭服务')
        this.ws.close() //onclose执行reconnect
      }, this.timeout)
    }, this.timeout)
  }
}

export default class SocketService {
  //socket 单例
  static wsURL = ''
  static instance = null
  static get Instance() {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  //建立连接的socket对象
  ws = null

  //存储回调函数
  callBackMap = new Map()

  //连接状态标识
  connected = false

  //记录重试次数
  sendRetryCount = 0

  //重新尝试连接次数
  connectRetryCount = 0

  //心跳检测
  heartCheck = null

  //连接方法
  connect(wsURL) {
    if (!window.WebSocket) {
      console.log('您的浏览器不支持WebSocket')
      return
    }
    let socketUrl = wsURL
    if (!socketUrl) {
      socketUrl = this.wsURL
    } else {
      this.wsURL = socketUrl
    }

    this.ws = new WebSocket(socketUrl)
    this.heartCheck = new HeartCheck(this.ws)

    this.ws.onopen = () => {
      console.log('ws 连接服务器成功!')
      this.connected = true
      this.connectRetryCount = 0
      //心跳检测重置
      this.heartCheck.reset().start()
    }

    this.ws.onclose = () => {
      console.log('ws 连接服务器失败!')
      this.connected = false
      this.connectRetryCount++
      this.heartCheck.reset() //心跳检测关闭
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
    }

    this.ws.onmessage = msg => {
    //   console.log('从服务端获取到了数据', msg)
      //心跳检测重置
      this.heartCheck.reset().start()

      if(msg.data === 'HeartBeat'){
        return;
      }

      this.callBackMap.forEach((callback, index) => {
        callback.call(this, msg)
      })
    }
  }

  /**
   * 注册回调函数
   * @param {*} alia 别名
   * @param {*} callback 回调
   */
  registerCallBack(alia, callback) {
    this.callBackMap.set(alia, callback)
  }

  /**
   * 取消注册回调函数
   * @param {*} alia 别名
   * @param {*} callback 回调
   */
  unRegisterCallBack(alia) {
    this.callBackMap.delete(alia)
  }

  send(data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(data)
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, 500 * this.sendRetryCount)
    }
  }

}
