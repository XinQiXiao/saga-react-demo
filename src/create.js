import { createStore, applyMiddleware, } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootSaga from './sagaIntroduce/sagas'
import reducer from './sagaIntroduce/reducer'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
	reducer, 
	applyMiddleware(sagaMiddleware)
)

export {
	store,
	sagaMiddleware,
	rootSaga,
}
