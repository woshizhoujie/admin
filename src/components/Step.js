import React, { Component } from 'react'
import { Row, Col, Button, Popconfirm, Collapse, Select, Input, Upload, Icon, message, Modal, } from 'antd'

import { Link } from 'react-router'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getMaterials, delMaterials, updateMaterials, createMaterials } from '../actions'
import { AppService, AppInfo } from '../service'
import { combineDataSource } from '../service/utils'
import * as actions from '../actions'


//参数字典
//data传过来的数组数据
//add() 添加出发的方法 del()删除
//displayItem() 要遍历的界面部分

class Step extends Component {
	constructor(props) {
		super(props)

		this.state = {
			step: [],
		}
	}

	componentWillMount() {
		if (this.props.data) {
			this.setState({ step: this.props.data })
		}
	}

	componentWillReceiveProps(nextProps) {
		//console.log("循环%o", nextProps)
		nextProps.data &&
			this.setState({
				step: nextProps.data
			})
	}


	//添加
	addStep = () => {
		let tmpStep = this.state.step.slice()

		let key = tmpStep.length + 1

		tmpStep.push(key)

		this.props.add(key)

		this.setState({
			step: tmpStep,
		})

	}

	//删除 
	delete = (index) => {
		index = index

		let tmpStep = this.state.step.slice()

		tmpStep.splice(index, 1)

		this.props.del(index, this.props.data[index].id)

		this.setState({
			step: tmpStep
		})

		// console.log('删除数据的ID%o', key)
		// console.log('删除的数据%o,', this.props.data[key].id)
	}

	//添加的部分提出来
	display = (index) => {
		let Panel = Collapse.Panel;
		const customPanelStyle = {
			background: '#f7f7f7',
			borderRadius: 4,
			marginBottom: 24,
			border: 0,
		};

		return (
			<Panel header={`第${index + 1}${this.props.rate}`} key={this.props.data[index].id} style={customPanelStyle}>
				<p><br /></p>

				{/*步骤框中间不同部分  传递函数传过来*/}
				{<this.props.displayItem index={index} />}

				<Row>
					<Col span={20}></Col>
					<Col span={2}>
						<Button style={{ color: 'red' }} onClick={() => this.delete(index)}>删除</Button>
					</Col>
				</Row>
			</Panel>
		)
	}

	render() {
		console.log('页面传给组件的步骤数据: %o', this.props.data)
		return (
			<div>
				<br />

				<Collapse bordered={false} style={{ width: '90%', marginLeft: '5%' }}>
					{
						this.state.step.map((item, index) => {
							return (
								this.display(index)
							)
						})
					}
				</Collapse>

				<br />
				<Row style={{ borderBottom: '1px solid #F2F2F2', height: '40px', }}>
					<Col span={20}></Col>
					<Col span={4}><Button onClick={() => this.addStep()}>新建{this.props.title}</Button></Col>
				</Row>
			</div>
		);
	}
}



export default Step;