import React, { Component } from 'react';
import { Row, message, Layout } from 'antd'

import { Auth, AppService, AppInfo } from '../service'
import { LoginForm } from '../components/LoginForm'
import { browserHistory } from 'react-router'
const { Header, Content, Footer } = Layout;

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(values) {
    let information = {
      username: values.username,
      password: values.password
    }

    let config = {
      url: AppInfo.address.login,
      method: 'POST',
      body: JSON.stringify(information),
      hasCert: false,
    }


    AppService.request(config)
      .then(result => {
        console.log('result: %o', result)
        AppInfo.token = result.token
        AppInfo.username = result.user.nickname

				localStorage.setItem('nickname',result.user.nickname)
				localStorage.setItem('token',result.token)


        let nextURL = this.props.location.query.next
        if (nextURL === undefined) {
          nextURL = "/"
        }
        browserHistory.push(nextURL)
        // Auth.auth(values.username, values.password, nextURL)
      })
      .catch(err => {
        message.error("用户名或密码错误")
      })
  }

  render() {
    return (
      <Layout className="layout">
        <Header>
        </Header>
        <Content style={{ padding: '0 50px' }}>

          <Row style={{ minHeight: 600 }}>

            <div style={{ width: 320, margin: '200px auto auto auto' }}>
              <div style={{textAlign:'center', marginBottom:20, fontSize:32}} >
                菜谱APP管理系统
              </div>
              <div style={{ backgroundColor: '#fbfbfb', padding: 10, margin: 0 }}>
                <LoginForm handleSubmit={this.handleSubmit} />
              </div>
            </div>
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          DXRV ©2017 Created by DongWu-Inc
        </Footer>
      </Layout>
    )
  }
}