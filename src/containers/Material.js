import React, { Component } from 'react'
import { Row, Button, Popconfirm, Spin, Modal, Upload } from 'antd'

import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'


import { InnerForm } from '../components/InnerForm'
import InnerTable from '../components/InnerTable'

import MaterialDetail from '../components/MaterialDetail'
import { AppService, AppInfo } from '../service'
import { getMaterials, delMaterials, updateMaterials, createMaterials } from '../actions'
import { combineDataSource } from '../service/utils'


import * as actions from '../actions'


class Material extends Component {
	constructor(props) {
		super(props)

		this.state = {
			data: '',
			modalVisible: false,
			//存放单条数据
			editObj: null,
			//存放数据中的照片信息
			pic: ''
		}
		this.index = ''
	}

	componentWillMount() {

		console.log(' new props: %o', this.props)
		this.props.getMaterials()
	}

	onCreate = () => {
		this.setState({
			modalVisible: true,
			editObj: null,
		})
	}

	onEdit = (record, index) => {
		console.log('record', record)
		this.setState({
			modalVisible: true,
			editObj: record,
		})
		this.index = index
	}

	onDelete = (record, index) => {
		let data = [...this.state.data]
		data.splice(index, 1)
		this.setState({ data })

		this.props.delMaterials({ id: record.id })
	}

	imageChange = (pic) => {
		console.log('pic', pic)
		this.state.pic = pic.url
	}

	onModalCancel = () => {
		this.setState({
			modalVisible: false,
		})
	}

	onModalConfirm = (values) => {
		console.log('编辑后的数据%o', values)

		this.setState({
			modalVisible: false
		})
		let editObj = this.state.editObj
		console.log('编辑前的数据%o', editObj)
		//if 编辑 else 新建
		if (editObj != null) {
			values.id = editObj.id

			if (this.state.pic) {
				values.image = this.state.pic
			}
			this.props.updateMaterials(values)
		} else {

			if (this.state.pic) {
				values.image = this.state.pic
			}
			this.props.createMaterials(values)
			this.state.pic = ''
		}
	}


	categoryTable = () => {
		const columns = [
			{
				title: '分类名',
				dataIndex: 'chinese_name',
				key: 'name',
			},
			{
				title: '图片',
				dataIndex: 'image',
				render: text => text ? <img style={{ width: 60, height: 60 }} src={text} /> : <div>无</div>
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record, index) => (
					<span>

						<a href='javascript:void(0);' onClick={() => this.onEdit(record, index)}>编辑 &nbsp;</a>

						<Popconfirm title='确认删除?' onConfirm={() => this.onDelete(record, index)}>

							<a href='javascript:void(0);'>删除 &nbsp;</a>

						</Popconfirm>

					</span>
				),
			}
		]

		//redux 获取数据

		let { isFetching } = this.props.status
		let { materials, materialResults } = this.props
		let td = combineDataSource(materialResults, materials)
		//数据显示列表
		return (
			<InnerTable
				data={td}
				columns={columns}
			/>
		)
	}


	render() {
		const { modalVisible, editObj } = this.state


		return (
			this.props.status.isFetching ? <Spin /> :
				<div>
					<Row>
						<h2>{title}</h2>
					</Row>

					<Row style={{ marginTop: 24 }}>
						<Button type='primary' onClick={this.onCreate}>	新建食材</Button>
					</Row>

					<InnerForm
						title={editObj === null ? creatTitle : editTitle}

						visible={modalVisible}

						onCancel={this.onModalCancel}

						onConfirm={this.onModalConfirm}

						value={editObj}

						image={editObj === null ? null : editObj.image}

						inputConfig={inputConfig}

						upLoadConfig={upLoadConfig}

						imageChange={this.imageChange}

					/>

					<Row style={{ marginTop: 16 }}>
						{
							<this.categoryTable />
						}
					</Row>

				</div>
		)
	}
}

//新建和编辑弹出框的
//页面标题
const title = '食材列表'

//新建页面标题
const creatTitle = '新建食材'

//编辑页面标题
const editTitle = '编辑食材'

//新建、编辑输入框各列表名设置
const inputConfig = [
	{
		label: '分类名(中文)',
		key: 'chinese_name',
		isAble: true,
		type: 'text',
		message: '请输入内容'
	},
	{
		label: '分类名(德语)',
		key: 'germany_name',
		isAble: true,
		type: 'text',
		message: '请输入内容'
	},
]

const upLoadConfig = [
	{
		label: '上传图片',
		key: 'image'
	}
]


const mapStateToProps = (state, ownProps) => {
	return {
		status: state.status.material,
		materials: state.entities.materials,
		materialResults: state.results.materials
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getMaterials,
		delMaterials,
		createMaterials,
		updateMaterials
	}, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Material)

