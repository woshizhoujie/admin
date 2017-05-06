import React, { Component } from 'react'
import { Form, Icon, Input, Button, Checkbox } from 'antd'

const FormItem = Form.Item

class LoginFormComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: ''
		}
		console.log('密码', this.state.password)
	}

	onConfirm = () => {
		const form = this.props.form;
		form.validateFields((err, values) => {
			if (err) {
				return;
			}
			form.resetFields()
			this.props.onConfirm(values)
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.props.handleSubmit(values)
			}
		})
	}

	onChange = (e) => {
		console.log('弹框是否被选中%o', e.target.checked);
	}

	render() {
		const props = this.props
		const { getFieldDecorator } = props.form
		return (
			<Form onSubmit={this.handleSubmit} style={{ maxWidth: 300 }}>
				<FormItem>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: '请输入用户名!' }],
					})(
						<Input addonBefore={<Icon type="user" />} placeholder="输入用户名" />
						)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: '请输入密码!' }],
					})(
						<Input addonBefore={<Icon type="lock" />} type="password"
							placeholder="输入密码"
							 />
						)}
				</FormItem>


				<Checkbox onChange={e => this.onChange(e)}>7天内免登录</Checkbox>
				<p>&nbsp;</p>


				<FormItem>
					<Button type="primary" htmlType="submit" style={{ width: '100%' }}>
						登录
          </Button>
				</FormItem>
			</Form>
		)
	}
}

export const LoginForm = Form.create()(LoginFormComponent) 