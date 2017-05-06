import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Row, Col, Button, Popconfirm, Collapse, Select, Input, Upload, Icon, message, Modal, } from 'antd'
import { StyleSheet, css } from 'aphrodite'
import { Link, browserHistory } from 'react-router'

import { SimpleForm } from '../components/SimpleForm'
import InnerTable from '../components/InnerTable'
import PhotoWall from '../components/PhotoWall'
import Step from '../components/Step'

import { AppService, AppInfo } from '../service'
import * as actions from '../actions'



const subInnerForm_w = '100%'

const InnerForm_w = '80%'

//两种语言的输入框
class InputFrame extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modalVisible: false,
			editObj: this.props.value,
		}
	}

	render() {
		const { modalVisible, editObj, imageUrl } = this.state
		return (
			<div>
				<h2>{this.props.title}</h2>
				<SimpleForm
					form_w={InnerForm_w}
					page={true}
					title={editObj === null ? creatTitle : editTitle}
					visible={modalVisible}
					value={editObj === null ? {} : editObj}
					inputConfig={inputConfig}
					onFieldsChange={this.props.onFieldsChange}
				/>
				<p><br /></p>
			</div>
		)
	}
}



class CreateCookbook extends Component {
	constructor(props) {
		super(props)

		this.state = {
			modalVisible: false,
			editObj: null,
		}


		this.chinese_title = undefined
		this.germany_title = undefined
		this.chinese_description = undefined
		this.germany_description = undefined
		this.chinese_notice = undefined
		this.germany_notice = undefined
		this.cover = undefined
		this.peppery_level = 0
		this.difficulty_level = 0
		this.images = []
		this.steps = [{
			chinese_description: undefined,
			germany_description: undefined,
			image: undefined,
		}]
		this.ingredients = [{
			material: undefined,
			chinese_quantity: undefined,
			germany_quantity: undefined
		}]

		this.isCreate = true
	}


	setCookbook = cookbook => {
		console.log('set cookbook: %o', cookbook)
		this.chinese_title = cookbook.chinese_title
		this.germany_title = cookbook.germany_title
		this.chinese_description = cookbook.chinese_description
		this.germany_description = cookbook.germany_description
		this.chinese_notice = cookbook.chinese_notice
		this.germany_notice = cookbook.germany_notice
		this.cover = cookbook.cover
		this.images = cookbook.images
		this.peppery_level = cookbook.peppery_level
		this.difficulty_level = cookbook.difficulty_level
		this.images = cookbook.images
		this.steps = cookbook.steps
		this.ingredients = cookbook.ingredients
	}

	componentWillMount() {
		console.log('params id: %o', this.props.params.id)
		if (this.props.cookbook) {
			this.isCreate = false
			this.setCookbook(this.props.cookbook)
		}
		if (this.props.params.id) {
			this.isCreate = false
			this.setCookbook(this.props.cookbooksEntities[this.props.params.id])
		}
	}


	//步骤中间部分
	displayStep = props => {
		console.log('step index: %o, %o, %o ', props.index, props, this.steps)

		if (this.steps.length === 0) {
			this.steps.push({
				chinese_description: undefined,
				germany_description: undefined,
				image: undefined,
			})
		}

		let { index } = props
		let images = []
		if (this.steps[index].image) {
			images.push(this.steps[index].image)
		}

		console.log('upload images: %o', images)

		return (
			<div>
				<Row>
					<Col span={12}>
						<Row>
							<Col span={3}><p>中文描述:</p></Col>
							<Col span={16}>
								<Input
									defaultValue={this.steps[index].chinese_description}
									type='textarea'
									onChange={(e) => {
										this.steps[index].chinese_description = e.target.value
									}}
								/>
							</Col>
						</Row>
					</Col>

					<Col span={12}>
						<Row>
							<Col span={3}><p>德语描述:</p></Col>
							<Col span={16}>
								<Input type='textarea'
									defaultValue={this.steps[index].germany_description}
									onChange={e => {
										this.steps[index].germany_description = e.target.value
									}}
								/>
							</Col>
						</Row>
					</Col>
				</Row>
				<p><br /><br /></p>

				{/*添加图片*/}
				<div style={{ float: 'left', marginRight: '10px' }}>
					<p>步骤图片:</p>
				</div>

				<PhotoWall
					imgNum={1}
					newImages={imgs => this.steps[index].image = imgs[0]}
					images={images}
				/>
				<p><br /></p>
			</div>
		)
	}

	//食材中间部分
	displayIngredient = props => {
		let { materialsResults, materialsEntities } = this.props
		let { index } = props
		console.log('ingredient index: %o. : %o', index, this.ingredients)

		//noting but isCreate is false
		if (this.ingredients.length === 0) {
			this.ingredients.push({
				material: undefined,
				chinese_quantity: undefined,
				germany_quantity: undefined,
			})
		}

		return (
			<div>
				<div style={{ float: 'left', marginRight: '10px' }}>
					<p>&nbsp;&nbsp;食材选择:</p>
				</div>

				<div >
					<Select
						defaultValue={this.ingredients[index].material}
						showSearch={true}
						style={{ width: 200 }}
						searchPlaceholder="输入"
						onChange={value => this.ingredients[index].material = value}>
						{
							materialsResults.map((item, index) => {
								return <Option value={materialsEntities[item].id}>{materialsEntities[item].chinese_name}</Option>
							})
						}
					</Select>
				</div>
				<p><br /></p>

				<Row>
					<Col span={10}>
						<Row>
							<Col span={4}><p>用量(中文):</p></Col>
							<Col span={16}>
								<Input
									defaultValue={this.ingredients[index].chinese_quantity}
									style={{ width: 200 }}
									onChange={e => {
										this.ingredients[index].chinese_quantity = e.target.value
									}}
								/>
							</Col>
						</Row>
					</Col>

					<Col span={10}>
						<Row>
							<Col span={4}><p>用量(德语):</p></Col>
							<Col span={16}>
								<Input
									defaultValue={this.ingredients[index].germany_quantity}
									style={{ width: 200 }}
									onChange={e => {
										this.ingredients[index].germany_quantity = e.target.value
									}}
								/>
							</Col>
						</Row>
					</Col>
				</Row>
				<p><br /></p>

				{/*<div style={{ float: 'left', marginRight: '10px' }}>
					<p>&nbsp;&nbsp;图片展示:</p>
				</div>

				<div >
					<img src={require('../images/1.jpeg')} style={{ width: '100px', height: '100px', borderRadius: '5' }} />
				</div>*/}
			</div>
		)
	}

	restFields = () => {
		this.chinese_title = undefined
		this.germany_title = undefined
		this.chinese_description = undefined
		this.germany_description = undefined
		this.chinese_notice = undefined
		this.germany_notice = undefined
		this.cover = undefined
		this.peppery_level = 0
		this.difficulty_level = 0
		this.images = []
		this.steps = [{
			chinese_description: '',
			germany_description: '',
			image: '',
		}]
		this.ingredients = [{
			id: undefined,
			chinese_quantity: '',
			germany_quantity: ''
		}]
	}

	onFieldsChange = (type, fields) => {
		let title = type === 0 ? 'chinese_title' : 'germany_title'
		let description = type === 0 ? 'chinese_description' : 'germany_description'
		let notice = type === 0 ? 'chinese_notice' : 'germany_notice'

		let setFields = (fields) => {
			for (let key in fields) {
				switch (key) {
					case 'title':
						this[title] = fields[key].value
						break
					case 'description':
						this[description] = fields[key].value
						break
					case 'notice':
						this[notice] = fields[key].value
						break
				}
			}
		}

		return (fields) => {
			setFields(fields)
		}
	}

	stepAdd = () => {
		console.log('step add')
		this.steps.push({
			chinese_description: undefined,
			germany_description: undefined,
			image: undefined
		})
	}

	stepDel = index => this.steps.splice(index, 1)

	ingredientsAdd = () => {
		this.ingredients.push({
			material: undefined,
			chinese_quantity: undefined,
			germany_quantity: undefined,
		})
	}

	ingredientDel = index => this.ingredients.splice(index, 1)

	render() {
		const { modalVisible, editObj } = this.state

		return (
			<div>
				<Row>
					<h2>{title}</h2><br />
				</Row>

				{/*双语版输入框*/}
				<Row>
					<Col span={12}>
						<InputFrame
							title='中文版'
							onFieldsChange={this.onFieldsChange(0)}
							value={{
								title: this.chinese_title,
								description: this.chinese_description,
								notice: this.chinese_notice
							}}
						/>
					</Col>

					<Col span={12}>
						<InputFrame
							title='德语版'
							onFieldsChange={this.onFieldsChange(1)}
							value={{
								title: this.germany_title,
								description: this.germany_description,
								notice: this.germany_notice
							}}
						/>
					</Col>
				</Row>

				<Row style={{ marginBottom: 20 }} >
					{/*difficult and pepper*/}
					<div style={{ textAlign: 'left', marginBottom: 10 }}>
						<p>难易度:</p>
					</div>
					<div>
						<Select
							defaultValue={this.peppery_level}
							style={{ width: 120 }}
							onChange={(value) => this.peppery_level = value
							}>
							<Option value={0}>0</Option>
							<Option value={1}>1</Option>
							<Option value={2}>2</Option>
							<Option value={3}>3</Option>
						</Select>
						<p><br /></p>
					</div>
					<div style={{ textAlign: 'left', marginBottom: 10 }}>
						<p>辣度:</p>
					</div>
					<Select
						defaultValue={this.difficulty_level}
						style={{ width: 120 }}
						onChange={(value) => { this.difficulty_level = value }
						}>
						<Option value={0}>0</Option>
						<Option value={1}>1</Option>
						<Option value={2}>2</Option>
						<Option value={3}>3</Option>
					</Select>
					<p><br /></p>
				</Row>

				{/*封面图片*/}
				<div style={{ float: 'left', marginRight: '10px' }}>
					<p>封面图片:</p>
				</div>
				<PhotoWall imgNum={1} newImages={(imgs) => this.cover = imgs[0]} images={this.cover ? [this.cover] : []} />
				<p><br /></p>

				{/*图片集*/}
				<div style={{ float: 'left', marginRight: '10px' }}>
					<p>&nbsp;&nbsp;&nbsp;&nbsp;图片集:</p>
				</div>
				<PhotoWall newImages={(imgs) => this.images = imgs.map(item => ({ image: item }))} images={this.images} />
				<p><br /><br /></p>

				{/*步骤输入框*/}
				{
					(this.create || !this.steps || this.steps.length === 0) ?
						<Step title='步骤' displayItem={this.displayStep} rate='步' add={this.stepAdd} del={this.stepDel} /> :

						<Step title='步骤' displayItem={this.displayStep} rate='步' add={this.stepAdd} del={this.stepDel} stepNum={this.steps.length} />

				}


				{/*食材输入框*/}
				{
					(this.create || !this.props.ingredients || this.props.ingredients.length === 0) ? <Step title='食材' displayItem={this.displayIngredient} rate='种' add={this.ingredientsAdd} del={this.ingredientDel} /> :
						<Step title='食材' displayItem={this.displayIngredient} rate='种' add={this.ingredientsAdd} del={this.ingredientDel} stepNum={this.props.ingredients.length} />
				}

				{/*新建菜谱下的返回 确定按钮*/}
				<hr />
				<p><br /><br /></p>
				<Row >
					<Col span={20}></Col>
					<Col span={2} >


						<Button onClick={() => browserHistory.goBack()} >取消&nbsp;&nbsp;</Button>
					</Col>
					<Col span={2} >
						<Button type='primary' onClick={() => {
							console.log('cookbook data: ct: %o, gt:%o, cd:%o, gd:%o, cn:%o,gn: %o, pl:%o,dl: %o, co:%o, img:%o, ste:%o, ing:%o',
								this.chinese_title, this.germany_title, this.chinese_description, this.germany_description,
								this.chinese_notice, this.germany_notice, this.peppery_level,
								this.difficulty_level, this.cover, this.images, this.steps, this.ingredients
							)
							browserHistory.goBack()
							if (!this.chinese_title || !this.germany_title) {
								console.log('invalid title')
								return
							}
							let body = {
								chinese_title: this.chinese_title,
								germany_title: this.germany_title,
								chinese_description: this.chinese_description,
								germany_description: this.germany_description,
								chinese_notice: this.chinese_notice,
								germany_notice: this.germany_notice,
								cover: this.cover,
								peppery_level: this.peppery_level,
								difficulty_level: this.difficulty_level,
								images: this.images,
								steps: this.steps,
								ingredients: this.ingredients
							}

							console.log('body stringfy: %o', JSON.stringify(body))
							//filter
							this.ingredients = this.ingredients.filter(item => item.material)
							this.steps = this.steps.filter(item => item.chinese_description || item.germany_description || item.image)

							this.props.createCookbooks({
								chinese_title: this.chinese_title,
								germany_title: this.germany_title,
								chinese_description: this.chinese_description,
								germany_description: this.germany_description,
								chinese_notice: this.chinese_notice,
								germany_notice: this.germany_notice,
								cover: this.cover,
								peppery_level: this.peppery_level,
								difficulty_level: this.difficulty_level,
								images: this.images,
								steps: this.steps,
								ingredients: this.ingredients
							})

						}}>确定</Button>
					</Col>
				</Row>
			</div>
		)
	}
}

CreateCookbook.propTypes = {
	cookbook: React.PropTypes.object
}

CreateCookbook.defaultProps = {
	cookbook: undefined
}

//页面标题
const title = '新建菜谱'

//新建页面标题
const creatTitle = '新建菜谱'

//编辑页面标题
const editTitle = '编辑菜谱'


//Modal输入框设置
const inputConfig = [
	{
		label: '菜谱名称',        //标题  table中的title
		key: 'title',             //table中的key
		isAble: true,            //是否为必选项
		type: 'text',            //输入框类型  text  textarea
		message: '请输入内容'      //错误信息 当isAble为true时填写此项
	},
	{
		label: '菜谱描述',
		key: 'description',
		isAble: false,
		type: 'textarea'
	},
	{
		label: '贴士',
		key: 'notice',
		isAble: false,
		type: 'text'
	},
]

const inputConfig_step = [
	{
		label: '描述',
		key: 'description',
		isAble: false,
		type: 'text'
	},
	{
		label: '图片',
		key: 'imgs',
		isAble: false,
		type: 'text'
	},
]

const inputConfig_ingredients = [
	{
		label: '用量',
		key: 'num',
		isAble: false,
		type: 'text'
	},
]


const mapStateToProps = (state, ownProps) => {
	return {
		cookbooksResults: state.results.cookbooks,
		cookbooksEntities: state.entities.cookbooks,
		materialsResults: state.results.materials,
		materialsEntities: state.entities.materials,
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		createCookbooks: actions.COOKBOOK_METHODS.create,
		updateCookbooks: actions.COOKBOOK_METHODS.update,
	}, dispatch)
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CreateCookbook)
