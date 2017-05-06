import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { appReducer } from './reducers'
import { state } from './store'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

import App from './App'
import List from './containers/List'
import Login from './containers/Login'
import Advice from './containers/Advice'
import AdviceList from './containers/AdviceList'
import Category from './containers/Category'
import CategoryList from './containers/CategoryList'
import CreateCookbook from './containers/CreateCookbook'
import Material from './containers/Material'
import Seller from './containers/Seller'

import { Auth, AppInfo } from './service'
import './index.css';
import 'antd/dist/antd.css';

// redux
let sagaMiddleware = createSagaMiddleware()

let enhancer = compose(
	applyMiddleware(sagaMiddleware),
	// window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const store = createStore(appReducer, state, enhancer)

sagaMiddleware.run(rootSaga)

// auth check
function onEnter(nextState, replace) {
	//console.log(nextState)
	if (!AppInfo.token) {
		let token = localStorage.getItem('token')
		let nickname = localStorage.getItem('nickname')

		if (token && nickname) {
			AppInfo.token = token
			AppInfo.username = nickname
			return true
		}

		replace({
			pathname: '/login',
			query: {
				next: '/'
			}
		})
	}
}

ReactDOM.render((
	<Provider store={store}>
		<Router history={browserHistory}>
			<Route path='/' component={App} onEnter={onEnter}>
				<IndexRoute component={Material} />

				<Route path='/cookbook/list' component={List} />

				<Route path='/cookbook/category' component={Category} />

				<Route path='/cookbook/category/:ID' component={CategoryList} />

				<Route path='/cookbook/advice' component={Advice} />

				<Route path='/cookbook/advice/:ID' component={AdviceList} />

				<Route path='/material' component={Material} />

				<Route path='/seller' component={Seller} />

			</Route>
			<Route path='/login' component={Login} />
		</Router>
	</Provider>
), document.getElementById('root'))
