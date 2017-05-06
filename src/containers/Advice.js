import React, { Component } from 'react'
import { Row, Button, Popconfirm, Spin } from 'antd'

import { Link } from 'react-router'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { combineDataSource } from '../service/utils'
import * as actions from '../actions'

import { InnerForm } from '../components/InnerForm'
import InnerTable from '../components/InnerTable'




class Advice extends Component {
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

		this.props.getRecommends()
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

		this.props.delRecommends({ id: record.id })
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
				values.cover = this.state.pic
			}
			this.props.updateRecommends(values)
		} else {
			if (this.state.pic) {
				values.cover = this.state.pic
			}
			this.props.createRecommends(values)
			this.state.pic = ''
		}
	}




	adviceTable = () => {
		const columns = [
			{
				title: '分类名',
				dataIndex: 'chinese_name',
				key: 'name',
			},
			{
				title: '图片',
				dataIndex: 'cover',
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

						<Link to={`/cookbook/advice/${record.id}`}	>
							<span>查看菜谱&nbsp;</span>
						</Link>

					</span>
				),
			}
		]
		//redux 获取数据
		let { recommendResults, recommendEntities } = this.props

		let td = combineDataSource(recommendResults, recommendEntities)

		console.log('advice_data%o', td)

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
						<Button type='primary' onClick={this.onCreate}>	新建分类</Button>
					</Row>

					<InnerForm
						title={editObj === null ? creatTitle : editTitle}

						visible={modalVisible}

						onCancel={this.onModalCancel}

						onConfirm={this.onModalConfirm}

						value={editObj}

						image={editObj === null ? null : editObj.cover}

						inputConfig={inputConfig}

						upLoadConfig={upLoadConfig}

						imageChange={this.imageChange}

					/>

					<Row style={{ marginTop: 16 }}>
						{
							<this.adviceTable />
						}
					</Row>
				</div>
		)
	}
}


//新建和编辑弹出框的
//页面标题
const title = '为你推荐'

//新建页面标题
const creatTitle = '新建分类'

//编辑页面标题
const editTitle = '编辑分类'

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
		status: state.status.recommend,
		recommendResults: state.results.recommends,
		recommendEntities: state.entities.recommends
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getRecommends: actions.RECOMMEND_METHODS.get,
		delRecommends: actions.RECOMMEND_METHODS.del,
		createRecommends: actions.RECOMMEND_METHODS.create,
		updateRecommends: actions.RECOMMEND_METHODS.update,
	}, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Advice)
