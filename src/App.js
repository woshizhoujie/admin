import React, { Component } from 'react';

import { Row, Col, Breadcrumb, Layout, Icon, Menu } from 'antd'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import './assets/Layout.css'

import { platformData } from './data/Platform'
import { sidebarMenu } from './data/Menu'
import {AppInfo} from './service'

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			current: 'home',
			tailCurrent: '',
			collapsed: false,
		}
		this.frontHandleClick = this.frontHandleClick.bind(this)
		this.toggle = this.toggle.bind(this)
	}

	frontHandleClick(e) {
		this.setState({
			tailCurrent: '',
			current: e.key,
		})
	}

	toggle() {
		this.setState({
			collapsed: !this.state.collapsed,
		});
	}

	render() {
		return (
			<Layout>
				<Sider
					trigger={null}
					collapsible
					collapsed={this.state.collapsed}
				>
					<div className="logo" style={{ textAlign: 'center', lineHeight: 2 }}>
						<img src={platformData.favicon} alt='' style={{ width: 32, height: 32, float: 'left' }} />
						<span className='nav-text' style={{ fontSize: 16, color: 'white' }}>{platformData.name}</span>
					</div>
					<Row>
						<Col span={24}>
							<Menu
								theme="dark"
								mode='inline'
								selectedKeys={[this.state.current]}
								onClick={this.frontHandleClick}
							>
								{sidebarMenu.map((e, i) => {
									return (
										<SubMenu key={e.key} title={<span><Icon type={e.icon} style={{ marginRight: 16 }} /><span className='nav-text'>{e.name}</span></span>}>
											{e.sub.map((element, index) => {
												return (
													<Menu.Item className='nav-text' key={element.key}><Link to={element.link}>{element.name}</Link></Menu.Item>
												)
											})}
										</SubMenu>
									)
								})}
							</Menu>
						</Col>
					</Row>
				</Sider>
				<Layout>
					<Header style={{ background: '#fff', padding: 0 }}>
						<Row>
							<Col span={12}>
								<Icon
									className="trigger"
									type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
									onClick={this.toggle}
								/>
							</Col>
							<Col span={12}>
								<div style={{ float: 'right', marginRight: 16 }}>
									<Icon type='user' />&nbsp;
                  <span >{AppInfo.username}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                  <a onClick = {()=>{
											console.log('logout')
											AppInfo.token = ''
											browserHistory.push('/login')
										}}>退出</a>
								</div>
							</Col>
						</Row>
					</Header>
					<Content>
						<Row style={{ marginTop: 8, paddingLeft: 24, paddingBottom: 4 }}>
							<Breadcrumb {...this.props} />
						</Row>
						<Content style={{ margin: '0px 16px', padding: 24, background: '#fff', minHeight: 600 }}>
							{this.props.children}
						</Content>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						<div dangerouslySetInnerHTML={{ __html: platformData.footer }}></div>
					</Footer>
				</Layout>
			</Layout>
		);
	}
}

export default App
