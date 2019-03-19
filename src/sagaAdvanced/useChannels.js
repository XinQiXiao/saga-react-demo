import { take, fork, actionChannel, call, delay, } from 'redux-saga/effects'
import { eventChannel, END, channel, } from 'redux-saga'

const api = {}

function createWebSocketConnection(){}

function* handleRequest(payload){

}

function* watchRequests(){
	while(true){
		const { payload } = yield take('REQUEST')
		yield fork(handleRequest, payload)
	}
}

// queue 依次处理
function* watchRequestsQueue(){
	// 1- 为 REQUEST actions 创建一个 channel
	const requestChan = yield actionChannel('REQUEST')
	while(true){
		// 2- take from the channel
		const { payload } = yield take(requestChan)
		// 3- 注意这里我们用了一个阻塞调用
		yield call(handleRequest, payload)
	}
}

function countdown(secs){
	return eventChannel(emitter => {
		const iv = setInterval(()=>{
			secs -= 1
			if(secs > 0){
				emitter(secs)
			} else {
				// 这里将导致 channel 关闭
				emitter(END)
			}
		}, 1000)
		// subscriber 必须回传一个 unsubscribe 函数
		return ()=> {
			clearInterval(iv)
		}
	})
}

export function* saga(){
	const chan = yield call(countdown, value)
	try{
		while(true){
			// take(END) 将造成 saga 终止，跳到 finally 区块
			let seconds = yield take(chan)
			console.log(`countdown: ${seconds}`)
		}
	}finally{
		if (yield cancelled()) {
      chan.close()
      console.log('countdown cancelled')
    }
		console.log(`countdown terminated`)
	}
}

// 这个函数从给定的 socket 创建一个 event channel
// 设定传入 `ping` 事件的 subscription
function createSocketChannel(socket) {
  // `eventChannel` 接收一个 subscriber 函数
  // 这个 subscriber 接收一个 `emit` 参数，用来把消息放到 channel 上
  return eventChannel(emit => {
    const pingHandler = (event) => {
      // 把 event payload 放入 channel
      // 这可以让 Saga 从被回传的 channel 接收这个 payload
      emit(event.payload)
    }
    // 设定 subscription
    socket.on('ping', pingHandler)
    // subscriber 必须返回一个 unsubscribe 函数
    // unsubscribe 将在 saga 调用 `channel.close` 方法时被调用
    const unsubscribe = () => {
      socket.off('ping', pingHandler)
    }
    return unsubscribe
  })
}
// 通过调用 `socket.emit('pong')` 回复一个 `pong` 消息
function* pong(socket) {
  yield call(delay, 5000)
  yield apply(socket, socket.emit, ['pong']) // 把 `emit` 作为一个方法调用，并以 `socket` 为上下文
}
export function* watchOnPings() {
  const socket = yield call(createWebSocketConnection)
  const socketChannel = yield call(createSocketChannel, socket)

  while (true) {
    const payload = yield take(socketChannel)
    yield put({ type: INCOMING_PONG_PAYLOAD, payload })
    yield fork(pong, socket)
  }
}


function* watchRequestsCustom() {
  // 创建一个 channel 来队列传入的请求
  const chan = yield call(channel)

  // 创建 3 个 worker 'threads'
  for (var i = 0; i < 3; i++) {
    yield fork(handleRequestCustom, chan)
  }

  while (true) {
    const {payload} = yield take('REQUEST')
    yield put(chan, payload)
  }
}

function* handleRequestCustom(chan) {
  while (true) {
    const payload = yield take(chan)
    // process the request
  }
}