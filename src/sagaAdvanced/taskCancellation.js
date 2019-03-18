import { take, put, call, fork, cancel, cancelled, delay, } from 'redux-saga/effects'

const someApi = {}, actions = {}

function* bgSync() {
  try {
    while (true) {
      yield put(actions.requestStart())
      const result = yield call(someApi)
      yield put(actions.requestSuccess(result))
      yield delay(5000)
    }
  } finally {
    if (yield cancelled())
      yield put(actions.requestFailure('Sync cancelled!'))
  }
}

function* main() {
  while ( yield take(START_BACKGROUND_SYNC) ) {
    // 启动后台任务
    const bgSyncTask = yield fork(bgSync)

    // 等待用户的停止操作
    yield take(STOP_BACKGROUND_SYNC)
    // 用户点击了停止，取消后台任务
    // 这会导致被 fork 的 bgSync 任务跳进它的 finally 区块
    yield cancel(bgSyncTask)
  }
}