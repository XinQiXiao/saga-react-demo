
import { select, takeEvery, take, put,} from 'redux-saga/effects'

// function* watchAndLog(){
// 	yield takeEvery('*', function* logger(action){
// 		const state = yield select()

// 		console.log('action ', action)
// 		console.log('state after ', state)
// 	})
// }
function* watchAndLog(){
	while(true){
		const action = yield take('*')
		const state = yield select()

		console.log('action ', action)
		console.log('state after ', state)
	}
}

function* watchFirstThreeTodosCreation() {
  for (let i = 0; i < 3; i++) {
    const action = yield take('TODO_CREATED')
  }
  yield put({type: 'SHOW_CONGRATULATION'})
}

export {
	watchAndLog,
}