import React, { Component } from 'react'
import { Modal, Form, Input, Icon, Button, Row, Col, Table, Alert } from 'antd'

import { request } from '../service/WebService.js'


import '../assets/CreateBatch.css'

import { isObjectValueEqual } from '../utils/Object'


import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { combineDataSource } from '../service/utils'
import * as actions from '../actions'
const FormItem = Form.Item

class Create extends Component {
	constructor(props) {
		super(props)
		this.state = {
			hasCreate: this.props.hasCreate,
			data: [],
			loading: true
		}
		this.uuid = 0
	}

	componentWillReceiveProps(nextProps) {
		//console.log('nextProps', nextProps)
		if (this.state.hasCreate === nextProps.hasCreate) {
			return
		}
		this.setState({
			hasCreate: nextProps.hasCreate
		})
		console.log('this.state.hascreate', this.state.hasCreate)
	}


	remove = (k) => {
		const { form } = this.props;
		const keys = form.getFieldValue('keys')
		if (keys.length === 1) {
			return;
		}
		form.setFieldsValue({
			keys: keys.filter(key => key !== k),
		})
	}

	add = () => {
		this.uuid++;
		const { form } = this.props;
		const keys = form.getFieldValue('keys')
		const nextKeys = keys.concat(this.uuid)
		form.setFieldsValue({
			keys: nextKeys,
		});
	}



	handleSubmit = (e) => {
		// console.log('e', e)
		e.preventDefault()
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values)

				//this.props.inputValue(values)



				this.setState({
					hasCreate: true
				})
				let users = []
				values.keys.map((e, i) => {
					let obj = {
						nickname: values[`nickname${e}`]
					}
					users.push(obj)
				})
				console.log('users', users)


				console.log('creaturl', this.props.createUrl)
				request(this.props.createUrl,
					JSON.stringify({ users }), true, 'POST')
					.then((results) => {
						console.log('result', results)
						this.setState({
							data: results.users,
							loading: false
						})
						this.props.createMember(results.users)
					})
					.catch(error => {
					})
				this.props.form.resetFields()
				console.log('submit hasCreate', this.state.hasCreate)
			}
		})
	}



	render() {
		// console.log('页面给组件的url', this.props.createUrl)

		const { getFieldDecorator, getFieldValue } = this.props.form

		const { inputConfig } = this.props
		const formItemLayout = {
			labelCol: {
				span: 24
			},
			wrapperCol: {
				span: 24
			},
		}
		const formItemLayoutWithOutLabel = {
			wrapperCol: {
				span: 24
			},
		}
		getFieldDecorator('keys', { initialValue: [] });

		const keys = getFieldValue('keys');
		const formItems = keys.map((k, index) => {

			return (
				<div>
					<FormItem
						{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel) }
						label={inputConfig.label}
						required={false}
						key={inputConfig.id}
					>
						{getFieldDecorator(`nickname${k}`, {
							validateTrigger: ['onChange', 'onBlur'],
							rules: [{
								required: true,
								whitespace: true,
								message: inputConfig.message,
							}],
						})(
							<Input placeholder={inputConfig.placeholder} style={{ width: '60%', marginRight: 8 }} />
							)}

					</FormItem>

					{/*inputConfig.map((element, index) => {
						//console.log('shouldshowData%o', inputConfig)
						return (
							<div>
								<FormItem
									{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel) }
									label={element.label}
									required={false}
									key={element.id}
								>
									{getFieldDecorator(`nickname${k}`, {
										validateTrigger: ['onChange', 'onBlur'],
										rules: [{
											required: true,
											whitespace: true,
											message: element.message,
										}],
									})(
										<Input placeholder={element.placeholder} style={{ width: '60%', marginRight: 8 }} />
										)}

								</FormItem>
							</div>
						)
					}
					)*/}

					<Row>
						<Col span={18}></Col>
						<Col span={2}>
							<Icon
								className="dynamic-delete-button"
								type="minus-circle-o"
								disabled={keys.length === 1}
								onClick={() => this.remove(k)}
							/>
						</Col>
					</Row>
					<p><br /></p>
				</div>


			)
		})
		const columns = [
			{
				title: '商家姓名',
				dataIndex: 'nickname',
				key: 'nickname',
			},
			{
				title: '用户名',
				dataIndex: 'username',
				key: 'username',
			},
			{
				title: '默认密码',
				dataIndex: 'password',
				key: 'password',
			},
		]
		return (
			!this.state.hasCreate ?
				<Row>
					<Form onSubmit={this.handleSubmit}>
						{formItems}
						<FormItem {...formItemLayoutWithOutLabel}>
							<Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
								<Icon type="plus" /> 增加商家
							</Button>
						</FormItem>
						<FormItem {...formItemLayoutWithOutLabel}>
							<Button type="primary" htmlType="submit" size="large" >批量生成商家账号</Button>
						</FormItem>
					</Form>
				</Row> :
				<Row>
					<Alert
						message='请将用户名和密码告诉商家登陆平台使用'
						type='info'
						showIcon
					/>
					<Table
						columns={columns}
						dataSource={this.state.data}
						loading={this.state.loading}
					/>
				</Row>

		)
	}
}

export const CreateBatch = Form.create()(Create)

CreateBatch.defaultProps = {
	inputConfig: [],
}


const mapStateToProps = (state, ownProps) => {
	//console.log('seller state', state)
	return {
		status: state.status.market,

		marketResults: state.results.markets,
		marketEntities: state.entities.markets,

		restaurantResults: state.results.restaurants,
		restaurantEntities: state.entities.restaurants,
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getMarkets: actions.MARKET_METHODS.get,
		delMarkets: actions.MARKET_METHODS.del,
		createMarkets: actions.MARKET_METHODS.create,
		updateMarkets: actions.MARKET_METHODS.update,

		getRestaurants: actions.RESTAURANT_METHODS.get,
		delRestaurants: actions.RESTAURANT_METHODS.del,
		createRestaurants: actions.RESTAURANT_METHODS.create,
		updateRestaurants: actions.RESTAURANT_METHODS.update,
	}, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CreateBatch)

