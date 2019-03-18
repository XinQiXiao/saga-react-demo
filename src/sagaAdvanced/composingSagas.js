import { put, } from 'redux-saga/effects'

const fetchApi = {}

const actions = {}

const FETCH_POSTS = 'FETCH_POSTS'

function* fetchPosts() {
  yield put( actions.requestPosts() )
  const products = yield call(fetchApi, '/products')
  yield put( actions.receivePosts(products) )
}

function* watchFetch() {
  while ( yield take(FETCH_POSTS) ) {
    yield call(fetchPosts) // 等待 fetchPosts 完成
  }
}

function* mainSaga(getState) {
  const results = yield [call(task1), call(task2),]
  yield put(showResults(results))
}

function* game(getState) {
  let finished
  while(!finished) {
    // 必须在 60 秒内完成
    const {score, timeout} = yield race({
      score: call( play, getState),
      timeout: call(delay, 60000)
    })

    if (!timeout) {
      finished = true
      yield put(showScore(score))
    }
  }
}