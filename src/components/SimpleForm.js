import React, { Component } from 'react'
import { Modal, Form, Input, Button, Row, Col, } from 'antd'
import { Link } from 'react-router'

const FormItem = Form.Item

class NormalForm extends Component {
	constructor(props) {
		super(props)
	}

	onConfirm() {
		const form = this.props.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			form.resetFields()
			this.props.onConfirm(values)
		})
	}

	render() {
		const { visible, value, title, onCancel, inputConfig, form_w } = this.props
		const { getFieldDecorator } = this.props.form
		return (
			//	this.props.page?  新建菜谱 录入数据不需要弹框 
			<div style={{ width: form_w }}>
				{
					<Form verticals>
						{inputConfig.map((element, index) => {
							return (
								<FormItem key={index} label={element.label}>
									{getFieldDecorator(element.key, {
										initialValue: value[element.key],
										rules: [{ required: element.isAble, message: element.message }],
									})
										(<Input type={element.type} />)}
								</FormItem>
							)
						})}

					</Form>
				}

			</div>
		)
	}
}

export const SimpleForm = Form.create({
	onFieldsChange: (props, fields) => props.onFieldsChange(fields)
})(NormalForm)

SimpleForm.defaultProps = {
	inputConfig: []
}
