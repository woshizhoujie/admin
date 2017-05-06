import React, { Component } from 'react'
import { Upload, Icon, Modal, Spin } from 'antd'

import { AppService, AppInfo } from '../service'

class PicturesWall extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			previewVisible: false,
			previewImage: '',
			fileList: [{
				uid: -1,
				name: 'xxx.png',
				status: 'done',
				url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
			}],
			loading: true
		}
		this.fetchProductData = this.fetchProductData.bind(this)
		this.showModal = this.showModal.bind(this)
		this.handleCancel = this.handleCancel.bind(this)
		this.onCancel = this.onCancel.bind(this)
		this.handlePreview = this.handlePreview.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.beforeUpload = this.beforeUpload.bind(this)
	}

	fetchProductData() {
		AppService.request(AppInfo.address.products)
			.then(result => {
				let images = []
				result[0].images.map((e, i) => {
					let id = images.length === 0 ? -1 : images[images.length - 1].uid - 1
					return (
						images.push({
							uid: id,
							status: 'done',
							url: e.image,
							id: e.id,
						})
					)
				})
				this.setState({
					fileList: images,
					loading: false,
				})
			}
			)
			.catch(error => {
			}
			)
	}

	componentWillMount() {
		this.fetchProductData()
	}

	showModal() {
		this.setState({
			visible: true,
		})
	}

	handleCancel(e) {
		this.setState({
			visible: false,
		})
	}

	onCancel() {
		this.setState({
			previewVisible: false
		})
	}

	handlePreview(file) {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		})
	}

	handleChange(status) {

		console.log('handle change fileList: %o', status)
		let url = `http://58.84.54.177:8000/rv/images/${status.file.id}/`
		AppService.request(url, null, false, 'DELETE')
			.then(result => {
				// console.log('Delete managet:', result)
			})
		this.setState({
			fileList: status.fileList
		})
	}

	beforeUpload(pic) {
		let reader = new FileReader();
		reader.readAsDataURL(pic);
		reader.onloadend = function () {
			let fileList = this.state.fileList
			let id = fileList.length === 0 ? -1 : fileList[fileList.length - 1].uid - 1
			let pics = {
				uid: id,
				status: 'done',
				url: reader.result
			}
			let productImage = {
				rv: 1,
				image: pics.url
			}
			AppService.request('http://58.84.54.177:8000/rv/images/', JSON.stringify(productImage), false, 'POST')
				.then(result => {
					// update
					this.setState({
						fileList: [...fileList, pics]
					})
				})
		}.bind(this);
		return false;
	}

	render() {
		const { previewVisible, previewImage, fileList, visible } = this.state;
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">上传</div>
			</div>
		);
		return (
			this.state.loading ?
				<div style={{ textAlign: 'center', borderRadius: 4, marginBottom: 20, padding: '30px 50px', margin: '20px 0px' }}>
					<Spin size='large' />
				</div>
				:
				<div style={{ textAlign: 'center', marginTop: 100 }}>
					<a src='#' onClick={this.showModal}>照片墙</a>
					<Modal
						title="产品图集"
						visible={visible}
						onCancel={this.handleCancel}
						footer={false}
						>
						<div className="clearfix">
							<Upload
								
								listType="picture-card"
								fileList={fileList}
								onPreview={this.handlePreview}
								onChange={this.handleChange}
								beforeUpload={this.beforeUpload}
								>
								{fileList.length >= 2 ? null : uploadButton}
							</Upload>
							<Modal
								visible={previewVisible}
								footer={null}
								onCancel={this.onCancel}>
								<img alt="example" style={{ width: '100%' }} src={previewImage} />
							</Modal>
						</div>
					</Modal>
				</div>
		)
	}
}

export default PicturesWall