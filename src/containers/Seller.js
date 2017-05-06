import React, { Component } from 'react'
import { Row, Button, Popconfirm, Select, Spin, Table, Modal } from 'antd'

import { InnerForm } from '../components/InnerForm'
import InnerTable from '../components/InnerTable'
import { CreateBatch } from '../components/CreateBatch'

import { AppService, AppInfo } from '../service'
import { address } from '../service/address'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { combineDataSource } from '../service/utils'
import * as actions from '../actions'

const Option = Select.Option

class Seller extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalVisible: false,
			// data: [{ name: '超市商家' }, { name: '餐厅商家' }],
			role: 1,
			loading: true,
			hasCreate: false,
		}
		this.sellers = []
		this.sellersId = ''
		this.sellersUpdata = ''
	}

	componentWillMount() {
		//this.fetchResources()

		this.props.getMarkets()

		this.props.getRestaurants()
	}

	// fetchResources = () => {
	// 	AppService.request(AppInfo.address.classList)
	// 		.then(result => {
	// 			// console.log('result', result)
	// 			this.setState({
	// 				loading: false,
	// 				data: result.results,
	// 			})
	// 		}
	// 		)
	// 		.catch(error => {
	// 			console.log(error)
	// 		}
	// 		)
	// }


	// formatTableData = (data) => {
	// 	console.log('表单的数据啊%o', data)
	// 	let newData = data.sellers
	// 	this.sellers = data.sellers
	// 	newData.map((e, i) => {
	// 		e.key = e.id
	// 	})

	// 	return newData
	// }



	onCreate = () => {
		this.setState({
			modalVisible: true,
			editObj: null
		})
	}

	onModalCancel = () => {
		this.setState({
			modalVisible: false,
			hasCreate: false
		})

		location.reload()
		//this.refs.student.updateResource(this.sellersUpdata, null, this.state.class)
	}

	createMember = (values) => {
		console.log('组件给页面的新建数据', values)

		this.sellers.map((e, i) => {
			this.sellersId = [...this.sellersId, e.id]
		})

		values.map((e, i) => {
			this.sellersId = [...this.sellersId, e.id]
		})

		this.sellers.push(values)

		let obj = {
			sellers: this.sellersId
		}
		console.log('obj', obj)

		this.sellersUpdata = obj
		this.sellers = ''
		this.sellersId = ''


	}

	handleChange = (value) => {
		this.setState({
			role: value,
		})
		console.log('角色是？', value)
	}

	marketTable = () => {
		const { modalVisible, editObj } = this.state
		const columns = [
			{
				title: '用户名',
				dataIndex: 'username',
				key: 'username',
			},
			{
				title: '商家昵称',
				dataIndex: 'nickname',
				key: 'nickname',
			},
			{
				title: '初始密码',
				dataIndex: 'init_password',
				key: 'init_password',
			},
			{/*
				title: '操作',
				key: 'action',
				render: (text, record, index) => (
					<span>

						{
							this.state.role == '1' ?
								<a href='javascript:void(0);' onClick={() => this.onEdit(record, index)}>关联餐厅 &nbsp;</a> : null

						}

						{	<Popconfirm title='确认删除?' onConfirm={() => this.onDelete(record, index)}>

							<a href='javascript:void(0);'>删除 &nbsp;</a>

						</Popconfirm>}

					</span>
				),
		*/}
		]

		let { restaurantResults, restaurantEntities } = this.props
		let res = combineDataSource(restaurantResults, restaurantEntities)

		//console.log('restaurant_data %o;', res)
		let { marketResults, marketEntities } = this.props
		let mar = combineDataSource(marketResults, marketEntities)

		//console.log('market_data %o ;', mar)
		let td = this.state.role == '1' ? res : mar
		this.sellers = td
		console.log('this.seller_data%o', this.sellers)

		return (
			<InnerTable
				data={this.sellers}
				columns={columns}
			//	formatTableData={this.formatTableData}
			/>
		)

		// return (
		// 	<InnerTable
		// 		columns={columns}
		// 		dataSource={td}
		// 		// resourceURL={{ url: AppInfo.address.classList, extra: `${this.state.class}/` }}
		// 		// formatTableData={this.formatTableData}
		// 		ref='student'
		// 	/>
		// )

	}

	render() {
		const { modalVisible, editObj } = this.state

		const title = '商家列表'
		const creatTitle = '生成商家账号'
		const label = '商家姓名'

		const createUrl = this.state.role == '1' ? address.restaurantsCreate : address.marketsCreate

		const inputConfig =
			// [
				{
					label: '商家姓名',        //标题  table中的title
					key: 'nickname',             //table中的key
					isAble: true,            //是否为必选项
					type: 'text',            //输入框类型  text  textarea
					message: '请输入商家姓名',     //错误信息 当isAble为true时填写此项
					placeholder: '商家姓名'
				}
			// 	{
			// 		label: '地址',        //标题  table中的title
			// 		key: 'address',             //table中的key
			// 		isAble: true,            //是否为必选项
			// 		type: 'text',            //输入框类型  text  textarea
			// 		message: '请输入商家地址',     //错误信息 当isAble为true时填写此项
			// 		placeholder: '商家地址'
			// 	},
			// ]

		// const home = {
		// 	label: '商家d地址',        //标题  table中的title
		// 	key: 'address',             //table中的key
		// 	isAble: true,            //是否为必选项
		// 	type: 'text',            //输入框类型  text  textarea
		// 	message: '请输入商家地址',     //错误信息 当isAble为true时填写此项
		// 	placeholder: '商家地址'
		// }

		const createConfig = {
			addButton: '增加商家',
			createButton: '批量生成商家账号',
			message: '请将用户名和密码告诉商家登陆平台使用'
		}


		return (
			this.props.status.isFetching ? <Spin /> :
				<div>
					<Row>
						<h2>{title}</h2>
					</Row>
					<Row style={{ marginTop: 24 }}>
						<Select
							showSearch
							style={{ width: 150, marginRight: 20 }}
							placeholder='选择商家角色'
							defaultValue='1'
							onChange={this.handleChange}
						>
							<Option value='1' >餐厅商家</Option>
							<Option value='2' >超市商家</Option>
						</Select>

						<Button type='primary' onClick={this.onCreate}>生成商家账号</Button>

					</Row>

					<Modal
						visible={modalVisible}
						title={creatTitle}
						onCancel={this.onModalCancel}
						footer={null}
					>
						<CreateBatch
							hasCreate={this.state.hasCreate}
							inputConfig={inputConfig}
							createMember={this.createMember}
							createUrl={createUrl}
							createConfig={createConfig}
						/>
					</Modal>

					<Row style={{ marginTop: 16 }}>
						<this.marketTable />
					</Row>
				</div>
		)
	}
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
		getRestaurants: actions.RESTAURANT_METHODS.get,

	}, dispatch)
}


export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Seller)

