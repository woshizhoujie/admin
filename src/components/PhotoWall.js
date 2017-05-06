import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Popconfirm, Collapse, Select, Input, Upload, Icon, message, Modal, Spin } from 'antd'
import { StyleSheet, css } from 'aphrodite'
import { Link } from 'react-router'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMaterials, delMaterials, updateMaterials, createMaterials } from '../actions'
import { AppService, AppInfo } from '../service'
import { combineDataSource } from '../service/utils'
import * as actions from '../actions'

//参数字典
//this.props.images 传过来的图片数组 一定是数组 多张图片 单张请用 Photo 组件
//this.props.imgNum 允许上传的图片数量 默认3张

class PhotoWall extends Component {
	constructor(props) {
		super(props)

		this.state = {
			//model是否显示
			modalVisible: false,

			//上传图片所需3个state
			previewVisible: false,
			previewImage: '',
			fileList: [],
		}
	}

	//把获取到的图片推到空数组 picture[]里
	componentWillMount() {
		let pics = []
		this.props.images.map((element, index) => {
			let pic = {
				uid: -(element.id),
				status: 'done',
				url: element.image
			}
			pics.push(pic)
		})
		//console.log('pics', pics)

		this.setState({
			fileList: pics
		})
	}

	componentWillReceiveProps(nextProps) {
		let pics = []

		nextProps.images && nextProps.images.map((element, index) => {
			let pic = {
				uid: -(element.id),
				status: 'done',
				url: element.image
			}
			pics.push(pic)
		})

		this.setState({
			fileList: pics
		})
	}

	//上传图片 的三个函数
	handleCancel = () => this.setState({ previewVisible: false })

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		});
	}

	handleChange = ({ fileList }) => {

		this.setState({ fileList })

		this.props.delPicture(this.state.fileList)

		console.log('组件里删除后的图片是！%o', this.state.fileList)
	}




	//上传图片不经过服务器
	beforeUpload = (pic) => {
		let reader = new FileReader();
		reader.readAsDataURL(pic);
		reader.onloadend = function () {
			let fileList = this.state.fileList
			let id = fileList.length === 0 ? -1 : -(fileList.length) - 1
			let pics = {
				uid: id,
				status: 'done',
				url: reader.result
			}

			this.setState({
				fileList: [...fileList, pics]
			})

			this.props.imageChange(pics)

		}.bind(this);
		return false;


	}


	static propTypes = {
		imgNum: PropTypes.number,
		//images: PropTypes.array,
		//newImages: PropTypes.func,
	}

	static defaultProps = {
		imgNum: 3,
		//images: [],
		//newImages: () => { },
	}


	render() {
		const { previewVisible, previewImage, fileList } = this.state

		//没走删除函数 删除后的图片赋值原数组
		this.props.delPicture(this.state.fileList)

		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">Upload</div>
			</div>
		);

		console.log('组件获取到的图片%o', this.props.images)
		return (
			// this.props.status.isFetching ? <Spin /> :
			<div className="clearfix">
				<Upload
					action='/upload.do'
					listType="picture-card"
					fileList={fileList}
					onPreview={this.handlePreview}
					onChange={this.handleChange}
					beforeUpload={this.beforeUpload}
				>
					{fileList.length >= this.props.imgNum ? null : uploadButton}
				</Upload>

				<Modal
					visible={previewVisible}
					footer={null}
					onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		status: state.status.image,

		imagesResults: state.results.images,
		imagesEntities: state.entities.images,
	}
}


const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({

		delImages: actions.IMAGE_METHODS.del,
		createImages: actions.IMAGE_METHODS.create,
		updateImages: actions.IMAGE_METHODS.update,
	}, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(PhotoWall)
