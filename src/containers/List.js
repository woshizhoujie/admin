import React, { Component } from 'react'
import { Row, Col, Button, Popconfirm, Modal, Spin, Input, Icon, Select } from 'antd'
import { Link } from 'react-router'

import { InnerForm } from '../components/InnerForm'
import InnerTable from '../components/InnerTable'
import PhotoWall from '../components/PhotoWall'
import Photo from '../components/Photo'
import Step from '../components/Step'

import {
	title, creatTitle, editTitle, inputConfig, upLoadConfig,
	inputConfig_step, inputConfig_ingredients,
} from '../data/ListConfig'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMaterials, delMaterials, updateMaterials, createMaterials } from '../actions'
import { AppService, AppInfo } from '../service'
import { combineDataSource } from '../service/utils'
import * as actions from '../actions'

import _ from 'lodash'

class List extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: '',
			modalVisible: false,
			//存放单条数据
			editObj: null,
			//存放数据中的照片信息
			pic: '',
			//步骤和食材 subData要显示的数据 subTitle字段标题
			visible: false,

			//存放当前编辑或者新建步骤的ID
			cookbook: '',
			//图片集弹框的显示与否
			picture: false,
			images: [],
			getImage: [],

			//步骤
			visibleStep: false,
			getStep: [],

			//食材
			visibleIngredient: false,
			getIngredient: [],
		}
		this.index = ''

		this.create_step = []
		this.update_step = []
		this.del_step = []

		this.create_ingredient = []
		this.update_ingredient = []
		this.del_ingredient = []

		this.create_images = []
		this.del_images = []
	}

	componentWillMount() {
		//console.log(' new props: %o', this.props)
		this.props.getCookbooks()
		if (this.props.materialsResults.length === 0) {
			this.props.getMaterials()
		}
		this.props.getImages()
		this.props.getIngredients()
		this.props.getSteps()
	}

	//步骤---------------------------------------
	showStep = (ID) => {
		let { stepsResults, stepsEntities } = this.props
		let stepsData = combineDataSource(stepsResults, stepsEntities)
		//console.log('redux步骤数据%o', stepsData)

		let getStep = stepsData.filter(item => {
			return (item.cookbook == ID)
		})
		//console.log('所需步骤是！%o', getStep)
		this.update_step = _.cloneDeep(getStep)

		this.setState({
			visibleStep: true,
			cookbook: ID,
			getStep: getStep
		})
	}

	closeStep = () => {
		this.setState({
			visibleStep: false
		})
	}

	confirmStep = () => {
		this.setState({
			visibleStep: false
		})

		//console.log('编辑后的步骤数组%o', this.update_step)
		if (this.update_step) {
			this.update_step.map((item) => {

				if (item.image) {
					if (item.image.startsWith('http')) {
						item.image = undefined
					}
				} else {
					item.image = undefined
				}

				this.props.updateSteps(item)
				//console.log('要循环的item%o', item)
			})
			this.update_step = []
		}



		this.create_step = this.state.getStep.filter(item => {
			return (!item.id)
		})

		//console.log('新建步骤的数组: %o', this.create_step)
		if (this.create_step) {
			this.create_step.map(item => {
				this.props.createSteps(item)
			})
			this.create_step = []
		}

		//console.log('所有步骤数据%o', this.state.getStep)


		//步骤删除
		if (this.del_step) {
			//console.log('删除的id数组是%o', this.del_step)
			this.del_step.map(item => {
				this.props.delSteps({ id: item.id })
			})
			this.del_step = []
		}

	}

	//步骤中间部分
	displayStep = props => {
		let { index } = props

		let stepData = this.state.getStep
		return (
			<div>
				<Row>
					<Col span={3}><p>中文描述:</p></Col>
					<Col span={16}>
						<Input type='textarea'
							defaultValue={stepData[index].chinese_description}

							onChange={e => {
								console.log('中文默认值%o', stepData[index].chinese_description)
								if (stepData[index].id) {
									this.update_step[index].chinese_description = e.target.value
									//console.log('步骤改变后的中文值%o', this.state.getStep[index].chinese_description)
								} else {
									//console.log('create pos: %o, %o', index, this.update_step.length)
									// let position = index - this.update_step.length
									// this.create_step[position].chinese_description = e.target.value

									stepData[index].chinese_description = e.target.value
								}

							}}
						/>
					</Col>
				</Row>
				<br />

				<Row>
					<Col span={3}><p>德语描述:</p></Col>
					<Col span={16}>
						<Input type='textarea'
							defaultValue={stepData[index].germany_description}

							onChange={e => {
								if (stepData[index].id) {
									this.update_step[index].germany_description = e.target.value
									//console.log('步骤改变后的德文值%o', this.state.getStep[index].germany_description)
								} else {

									// let postion = index - this.update_step.length
									// this.create_step[postion].germany_description = e.target.value

									stepData[index].germany_description = e.target.value
								}

							}}
						/>
					</Col>
				</Row>

				<br />

				<div style={{ float: 'left', marginRight: '10px' }}>
					<p>步骤图片:</p>
				</div>

				<Photo
					//传给组件的一张图片信息
					image={this.state.getStep[index].image}

					imageChange={img => {
						//编辑步骤的图片
						if (this.state.getStep[index].id) {
							this.update_step[index].image = img.url
							//新建步骤的图片
						} else {
							// let postion = index - this.update_step.length
							// this.create_step[postion].image = img.url

							stepData[index].image = img.url
						}
					}}
				/>
				<p><br /></p>
			</div>
		)
	}

	stepAdd = () => {
		// this.create_step.push({
		// 	chinese_description: undefined,
		// 	germany_description: undefined,
		// 	image: undefined,
		// 	cookbook: this.state.cookbook,
		// })

		this.state.getStep.push({
			chinese_description: undefined,
			germany_description: undefined,
			image: undefined,
			cookbook: this.state.cookbook,
		})
	}

	stepDel = (index, delStepID) => {
		this.state.getStep.splice(index, 1)

		console.log('删除的ID是%o', index)

		if (delStepID) {
			this.del_step.push({ id: delStepID })
			//console.log('菜谱页面的删除下标,id%o;', index, delStepID)
		}
	}
	//步骤结束--------------------------------------

	//食材-----------------------------------------
	showIngredient = (ID) => {
		let { ingredientsResults, ingredientsEntities } = this.props
		let ingredientsData = combineDataSource(ingredientsResults, ingredientsEntities)
		//console.log('redux食材数据%o', ingredientsData)

		let getIngredient = ingredientsData.filter(item => {
			return (item.cookbook == ID)
		})

		//console.log('所需食材是！%o', getIngredient)
		this.update_ingredient = _.cloneDeep(getIngredient)

		this.setState({
			visibleIngredient: true,
			cookbook: ID,
			getIngredient: getIngredient
		})
	}


	closeIngredient = () => {
		this.setState({
			visibleIngredient: false
		})
	}

	confirmIngredient = () => {
		this.setState({
			visibleIngredient: false
		})

		if (this.update_ingredient) {
			//console.log('编辑后的食材数组%o', this.update_ingredientr)
			this.update_ingredient.map((item) => {
				this.props.updateIngredients(item)
			})
			this.update_ingredient = []
		}


		this.create_ingredient = this.state.getIngredient.filter(item => {
			return (!item.id)
		})

		if (this.create_ingredient) {
			console.log('新建的食材数组是！%o;', this.create_ingredient)
			this.create_ingredient.map(item => {
				this.props.createIngredients(item)
			})
			this.create_ingredient = []
		}

		if (this.del_ingredient) {
			console.log('删除食材的ID数组是！%o;', this.del_ingredient)
			this.del_ingredient.map((item) => {
				this.props.delIngredients({ id: item.id })
			})
			this.del_ingredient = []
		}

	}


	//食材中间部分----------------------------------------------------------
	displayIngredient = props => {

		let { materialsResults, materialsEntities } = this.props
		let { index } = props
		let ingredientData = this.state.getIngredient

		return (
			<div>
				<Row>
					<Col span={4} ><p>&nbsp;&nbsp;食材选择:</p></Col>
					<Col span={16}>
						<Select defaultValue={ingredientData[index].material ?
							materialsEntities[ingredientData[index].material].chinese_name : null}

							showSearch={true}
							style={{ width: 200 }}
							searchPlaceholder="输入"
							optionFilterProp="children"

							onChange={value => {
								if (ingredientData[index].id) {
									this.update_ingredient[index].material = value
								} else {
									// let position = index - this.update_ingredient.length
									// this.create_ingredient[position].material = value
									ingredientData[index].material = value

								}

							}}>

							{
								materialsResults.map((item, index) => {
									return <Option value={materialsEntities[item].id}>{materialsEntities[item].chinese_name}</Option>
								})
							}

						</Select>
					</Col>
				</Row>

				<br />
				<Row>
					<Col span={4}><p>用量(中文):</p></Col>

					<Col span={16}>
						<Input defaultValue={ingredientData[index].chinese_quantity} style={{ width: 200 }}

							onChange={e => {
								if (ingredientData[index].id) {
									this.update_ingredient[index].chinese_quantity = e.target.value
									//console.log('食材用量改变后的中文值%o', this.update_ingredient[index].chinese_quantity)
								} else {
									//console.log('create pos: %o, %o', index, this.update_ingredient.length)
									// let position = index - this.update_ingredient.length
									// this.create_ingredient[position].chinese_quantity = e.target.value
									//console.log('食材用量新建后的中文值%o', this.create_ingredient[position].chinese_quantity)
									ingredientData[index].chinese_quantity = e.target.value
								}
							}}
						/>
					</Col>
				</Row>
				<br />

				<Row>
					<Col span={4}><p>用量(德语):</p></Col>

					<Col span={16}>
						<Input defaultValue={ingredientData[index].germany_quantity} style={{ width: 200 }}

							onChange={e => {
								if (ingredientData[index].id) {
									this.update_ingredient[index].germany_quantity = e.target.value
								} else {
									// let position = index - this.update_ingredient.length
									// this.create_ingredient[position].germany_quantity = e.target.value

									ingredientData[index].germany_quantity = e.target.value
								}

							}}
						/>
					</Col>
				</Row>
				<br />

			</div>
		)
	}

	ingredientAdd = () => {
		// this.create_ingredient.push({
		// 	material: undefined,
		// 	chinese_quantity: undefined,
		// 	germany_quantity: undefined,
		// 	cookbook: this.state.cookbook,
		// })


		this.state.getIngredient.push({
			material: undefined,
			chinese_quantity: undefined,
			germany_quantity: undefined,
			cookbook: this.state.cookbook,
		})
	}

	ingredientDel = (index, delIngredientID) => {
		//console.log('删除的下标和ID%o', index, delIngredientID)
		this.state.getIngredient.splice(index, 1)

		if (delIngredientID) {
			this.del_ingredient.push({ id: delIngredientID })
		}

	}


	//图片集的弹框------------------------------------------
	showPicture = (ID) => {
		//console.log('获取到的图片集%o', subData)
		let { imagesResults, imagesEntities } = this.props
		let imagesData = combineDataSource(imagesResults, imagesEntities)
		//console.log('get的图片集%o', imagesData)
		let getImage = imagesData.filter(item => {
			return (item.cookbook == ID)
		})
		//console.log('get到所需的图片集%o', getImage)
		this.setState({
			picture: true,
			cookbook: ID,
			getImage: getImage
		})
		//console.log('get到所需的图片给state%o', this.state.getImage)
	}

	closePicture = () => {
		this.setState({
			picture: false,
		})
	}

	confirmPicture = () => {
		if (this.create_images) {
			this.create_images.map(item => this.props.createImages(item)),
				this.create_images = []
		}
		//console.log('新建的图片%o', this.create_images)
		this.setState({
			picture: false,
		})

		let images = this.state.getImage
		//console.log('传过来的所有图片%o', images)
		let remineImage = this.del_images
		//console.log('删除后剩余的图片%o', remineImage)
		let difference = images.filter(item => {
			let exit = true
			for (let copy of remineImage) {
				if (copy.url === item.image) {
					exit = false
					break
				}
			}
			return exit
		})
		//console.log('删除的图片是！%o', difference)
		//console.log('删除的图片的ID是！%o', difference[0].id)
		if (difference) {
			difference.map(item => this.props.delImages({ id: item.id })),
				difference = []
		}
	}

	//-------------------------------------------------
	formatTableData = (data) => {
		let newData = data.results
		newData.map((e, i) => {
			e.key = e.id
		})
		return newData
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

		this.props.delCookbooks({ id: record.id })
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
		//console.log('编辑后的数据%o', values)
		this.setState({
			modalVisible: false
		})
		let editObj = this.state.editObj
		//console.log('编辑前的数据%o', editObj)
		//if 编辑 else 新建
		if (editObj != null) {
			values.id = editObj.id
			if (this.state.pic) {
				values.cover = this.state.pic
			}
			this.props.updateCookbooks(values)
		} else {
			if (this.state.pic) {
				values.cover = this.state.pic
			}
			this.props.createCookbooks(values)
			this.state.pic = ''
		}
	}


	//菜谱列表显示数据的表字段标题-----------------------------------------------------
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
				title: '图片集',
				dataIndex: 'images',
				key: 'images',
				render: (text, record, index) => (
					<span>
						<a href='javascript:void(0);' onClick={() => { this.showPicture(record.id) }}>查看/编辑</a>
					</span>
				),
			},
			{
				title: '步骤',
				dataIndex: 'steps',
				key: 'steps',
				render: (text, record, index) => (
					<span>
						<a href='javascript:void(0);' onClick={() => { this.showStep(record.id) }}>查看/编辑</a>
					</span>
				),
			},
			{
				title: '食材',
				dataIndex: 'ingredients',
				key: 'ingredients',
				render: (text, record, index) => (
					<span>
						<a href='javascript:void(0);' onClick={() => { this.showIngredient(record.id) }}>查看/编辑</a>
					</span>
				),
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

		let { cookbookResults, cookbookEntities, } = this.props
		let td = combineDataSource(cookbookResults, cookbookEntities)

		return (
			<InnerTable
				data={td}
				columns={columns}
				formatTableData={this.formatTableData}
			/>
		)
	}

	//页面展示部分----------------------------------------------------------------------
	render() {
		const { modalVisible, editObj, visible, subData, subTitle, picture } = this.state

		return (
			this.props.status.isFetching ? <Spin /> :
				<div>
					<Row><h2>{title}</h2></Row>
					<Row style={{ marginTop: 24 }}>
						<Button type='primary' onClick={this.onCreate}>	{creatTitle}</Button>
					</Row>
					<Row style={{ marginTop: 16 }}>{<this.listTable />}</Row>
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

					{/*步骤 弹框*/}
					<Modal
						padding={0}
						footer={false}
						visible={this.state.visibleStep}
						closable={true}
						onCancel={this.closeStep}
						width='600px'
					>

						<div style={{ margin: '0 auto', minHeight: '90px' }}>
							<Row style={{ borderBottom: '1px solid #F2F2F2', height: '30px', }}>
								<Col span={4}><p>查看步骤</p></Col>
							</Row>

							<Step title='步骤' displayItem={this.displayStep} rate='步'
								data={this.state.getStep} add={this.stepAdd} del={this.stepDel} />

							<Row style={{ marginTop: '30px' }}>
								<Col span={18}></Col>
								<Col span={3}><Button onClick={() => this.closeStep()}>取消</Button></Col>
								<Col span={3}><Button type='primary' onClick={() => this.confirmStep()}>确定</Button></Col>
							</Row>
						</div>
					</Modal>


					{/*食材 弹框*/}
					<Modal
						padding={0}
						footer={false}
						visible={this.state.visibleIngredient}
						closable={true}
						onCancel={this.closeIngredient}
						width='600px'
					>

						<div style={{ margin: '0 auto', minHeight: '90px' }}>
							<Row style={{ borderBottom: '1px solid #F2F2F2', height: '30px', }}>
								<Col span={4}><p>查看食材</p></Col>
							</Row>

							<Step title='食材' displayItem={this.displayIngredient} rate='种'
								data={this.state.getIngredient} add={this.ingredientAdd} del={this.ingredientDel} />

							<Row style={{ marginTop: '30px' }}>
								<Col span={18}></Col>
								<Col span={3}><Button onClick={() => this.closeIngredient()}>取消</Button></Col>
								<Col span={3}><Button type='primary' onClick={() => this.confirmIngredient()}>确定</Button></Col>
							</Row>
						</div>
					</Modal>

					{/*图片集 弹框*/}
					<Modal
						padding={0}
						//footer为false 弹框下的取消确定按钮没有
						footer={false}
						visible={picture}
						closable={true}
						onCancel={this.closePicture}
						width='450px'
					>
						<div style={{ margin: '0 auto', minHeight: '90px' }}>
							<Row style={{ borderBottom: '1px solid #F2F2F2', height: '30px', }}>
								<p>图片集</p>
							</Row>
							<br />

							<Row>
								<PhotoWall imgNum={6} images={this.state.getImage}
									imageChange={(img) => {
										//新建的图片组成对象
										let createImages = {
											cookbook: this.state.cookbook,
											image: img.url
										}
										//新建的图片组成对象push到数组
										this.create_images.push(createImages)
										//console.log('新建的图片是！%o', this.create_images)
									}}

									delPicture={(delPicture) => {
										this.del_images = delPicture
										//console.log('来自组件的删除后的图片集%o', delPicture)
										//console.log('来自组件的删除后的图片集赋值给删除小组%o', this.del_images)
									}}

								/>
							</Row>

							<Row style={{ marginTop: '30px' }}>
								<Col span={20}></Col>
								<Col span={4}><Button type='primary' onClick={() => this.confirmPicture()}>确定</Button></Col>
							</Row>

						</div>
					</Modal>
				</div>
		)
	}
}


const mapStateToProps = (state, ownProps) => {
	return {
		status: state.status.cookbook,
		cookbookResults: state.results.cookbooks,
		cookbookEntities: state.entities.cookbooks,
		materialsResults: state.results.materials,
		materialsEntities: state.entities.materials,

		stepsResults: state.results.steps,
		stepsEntities: state.entities.steps,

		ingredientsResults: state.results.ingredients,
		ingredientsEntities: state.entities.ingredients,

		imagesResults: state.results.images,
		imagesEntities: state.entities.images,
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getCookbooks: actions.COOKBOOK_METHODS.get,
		delCookbooks: actions.COOKBOOK_METHODS.del,
		createCookbooks: actions.COOKBOOK_METHODS.create,
		updateCookbooks: actions.COOKBOOK_METHODS.update,
		getMaterials,

		getSteps: actions.STEP_METHODS.get,
		delSteps: actions.STEP_METHODS.del,
		createSteps: actions.STEP_METHODS.create,
		updateSteps: actions.STEP_METHODS.update,

		getIngredients: actions.INGREDIENT_METHODS.get,
		delIngredients: actions.INGREDIENT_METHODS.del,
		createIngredients: actions.INGREDIENT_METHODS.create,
		updateIngredients: actions.INGREDIENT_METHODS.update,

		getImages: actions.IMAGE_METHODS.get,
		delImages: actions.IMAGE_METHODS.del,
		createImages: actions.IMAGE_METHODS.create,
		updateImages: actions.IMAGE_METHODS.update,
	}, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(List)



