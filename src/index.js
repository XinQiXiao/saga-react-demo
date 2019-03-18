import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import * as serviceWorker from './serviceWorker'

import Counter from './components/Counter'

import { store, sagaMiddleware, rootSaga, } from './create'

sagaMiddleware.run(rootSaga)

const action = type => store.dispatch({type})

function render(){
	ReactDOM.render(
		<Counter 
			value={store.getState()}
			onIncrement={() => action('INCREMENT')}
			onDecrement={() => action('DECREMENT')}
			onIncrementAsync={() => action('INCREMENT_ASYNC')}
		/>, 
		document.getElementById('root')
	)
}

render()

store.subscribe(render)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
