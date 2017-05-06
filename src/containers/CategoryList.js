import React, { Component } from 'react'
import { Row, Button, Popconfirm, Modal, Spin, Checkbox } from 'antd'

import { Link } from 'react-router'

import { InnerForm } from '../components/InnerForm'
import InnerTable from '../components/InnerTable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMaterials, delMaterials, updateMaterials, createMaterials } from '../actions'
import { AppService, AppInfo } from '../service'
import { combineDataSource } from '../service/utils'
import * as actions from '../actions'

class CategoryList extends Component {
	constructor(props, context) {
		super(props)
		this.state = {
			modalVisible: false,
			editObj: null,
			visible: false,

			chooseData: [],
			tableData: [],
			titlt: ''
		}
		this.index = ''
	}


	componentWillMount() {
		//console.log(' new props: %o', this.props)

		this.props.getCookbooks()

		this.props.getCategories()
	}



	//添加菜谱----------------------------------------
	showModal = () => {
		this.setState({
			visible: true
		})
	}


	//添加菜谱确定按钮
	send = () => {
		this.setState({
			visible: false,
		})


		console.log('终极数据！%o', this.state.chooseData)

		let total = this.state.tableData.map(item => item.id)

		this.state.chooseData.map(item => {
			total.push(item.id)
		})

		console.log('update total: %o', total)

		let updateInst = {
			id: this.props.params.ID,
			cookbooks: total
		}

		this.props.updateCategories(updateInst)

	}

	cancelSend = () => {
		this.setState({
			visible: false,
			chooseData: [],
		})
	}

	onChange = (e, record) => {

		// console.log('弹框是否被选中%o', e.target.checked);

		// console.log('获取到的选中数据%o', record)

		// console.log('塞入已经选入数组的数组内容%o', this.state.chooseData)

		if (e.target.checked == true) {
			let chooseData = this.state.chooseData

			this.setState({
				chooseData: [...chooseData, record]
			})
		}

		else {

			let chooseData = this.state.chooseData

			let temporary = []

			temporary = [...temporary, record]

			let difference = chooseData.filter(item => {

				let exit = true

				for (let copy of temporary) {
					//console.log('cb; %o', cb)
					if (copy.id === item.id) {
						exit = false
						break
					}
				}
				return exit
			})

			this.setState({
				chooseData: difference
			})
			//console.log('删除后选入数组的数组内容%o', difference)
		}
	}
	//-------------------------------------------------



	//已有菜谱列表 只有一个删除功能-------------------------
	onDelete = (record, index) => {

		//console.log('删除前的数据: %o', this.state.tableData)

		//console.log('删除的那条数据', record)

		let tds = this.state.tableData

		let temperoy = tds.filter((item) => {
			return (item.id !== record.id)
		})

		let total = temperoy.map(item => item.id)

		//total.del(record.id)

		//console.log('删除后的数据总和: %o', total)

		let updateInst = {
			id: this.props.params.ID,
			cookbooks: total
		}

		this.props.updateCategories(updateInst)


	}


	//添加菜谱弹框 显示 所有菜谱-已有菜谱-----------------------
	listTable = () => {
		const columns = [
			{
				title: '菜谱名称',
				dataIndex: 'chinese_title',
				key: 'title',
			},
			{
				title: '菜谱描述',
				dataIndex: 'chinese_description',
				key: 'description',
			},
			{
				title: '封面图片',
				dataIndex: 'cover',
				key: 'cover',
				render: (text, record, index) => {
					//TODO: add img width and height limit
					return text ? <img style={{ width: 60, height: 60 }} src={text} /> : <div>无</div>
				}
			},
			{
				title: '贴士',
				dataIndex: 'chinese_notice',
				key: 'chinese_notice',
			},
			{
				title: '添加',
				key: 'action',
				render: (text, record, index) => (
					<span>
						<Checkbox onChange={e => this.onChange(e, record)} />
					</span>
				),
			}
		]

		let { cookbookResults, cookbookEntities, } = this.props

		let td = combineDataSource(cookbookResults, cookbookEntities)


		let difference = td.filter(item => {
			let exit = true
			for (let copy of this.state.tableData) {
				if (copy.id === item.id) {
					exit = false
					break
				}
			}
			return exit
		})

		return (
			<InnerTable
				data={difference}
				columns={columns}
			/>
		)
	}

	//已有菜谱展示---------------------------------------------
	categoryListTable = () => {
		const columns = [

			{
				title: '菜谱名称',
				dataIndex: 'chinese_title',
				key: 'title',
			},
			{
				title: '菜谱描述',
				dataIndex: 'chinese_description',
				key: 'description',
			},
			{
				title: '封面图片',
				dataIndex: 'cover',
				key: 'cover',
				render: (text, record, index) => {
					//TODO: add img width and height limit
					return text ? <img style={{ width: 60, height: 60 }} src={text} /> : <div>无</div>
				}
			},
			{
				title: '贴士',
				dataIndex: 'chinese_notice',
				key: 'chinese_notice',
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record, index) => (
					<span>
						<Popconfirm title='确认删除' onConfirm={() => this.onDelete(record, index)}>
							<a href='javascript:void(0);'>删除</a>
						</Popconfirm>
					</span>
				),
			}
		]

		let { categoryResults, categoryEntities, } = this.props

		let td = combineDataSource(categoryResults, categoryEntities)

		let tds = this.props.categoryEntities[this.props.params.ID]

		console.log('td_data%o', tds)


		if (tds) {
			let cbEntities = tds.cookbooks
			if (tds.cookbooks.length > 0) {
				if (typeof tds.cookbooks[0] === 'number') {
					cbEntities = combineDataSource(tds.cookbooks, this.props.cookbookEntities)
				}
			}

			this.state.tableData = cbEntities

			this.state.titlt = tds.chinese_name

			console.log('tds_data:', this.state.tableData)

			console.log('title:', this.state.titlt)

		}

		return (
			<InnerTable
				data={this.state.tableData}
				columns={columns}
			/>
		)
	}

	render() {
		const { modalVisible, editObj } = this.state

		//console.log('category: %o:', this.props.categoryEntities[this.props.params.ID])

		//console.log('lalalalala: %o', this.props.params.ID)

		return (
			this.props.status.isFetching ? <Spin /> :

				<div>
					<Row><h2>{this.state.titlt}列表</h2></Row>

					<Row style={{ marginTop: 24 }}>

						<Button type='primary' onClick={() => { this.showModal() }} >添加菜谱</Button>

						<Modal
							padding={0}
							width={1000}
							height={300}
							okText="确定"
							cancelText="取消 "
							visible={this.state.visible}
							closable={false}
							onOk={() => {
								this.send()
							}}
							onCancel={() => {
								this.cancelSend()
							}}
						>
							<div>
								<p style={{ marginLeft: '10px', fontSize: '18px' }}>请选择要添加的菜谱</p>
								<div style={{ margin: '0 auto', width: '900px', minHeight: '90px' }}>
									<div>
										<div style={{ marginTop: '10px' }} >
											<Row style={{ marginTop: 16 }}>
												{<this.listTable />}
											</Row>
										</div>
									</div>
								</div>
							</div>
						</Modal>

					</Row>

					<Row style={{ marginTop: 16 }}>
						{<this.categoryListTable />}
					</Row>

				</div>
		)
	}
}


const mapStateToProps = (state, ownProps) => {
	return {
		cookbookResults: state.results.cookbooks,
		cookbookEntities: state.entities.cookbooks,

		status: state.status.category,
		categoryResults: state.results.categories,
		categoryEntities: state.entities.categories
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getCookbooks: actions.COOKBOOK_METHODS.get,

		getCategories: actions.CATEGORY_METHODS.get,
		delCategories: actions.CATEGORY_METHODS.del,
		createCategories: actions.CATEGORY_METHODS.create,
		updateCategories: actions.CATEGORY_METHODS.update,
	}, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(CategoryList)