import React, { Component, PropTypes } from 'react';
import { Row, Col, Button, Popconfirm, Input, Table, Alert, Spin } from 'antd'
import PhotoWall from '../components/PhotoWall'

class MaterialDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      images: [],
      chinese_name: '',
      germany_name: '',
    }

  }

  newImages = images => {
    // this.setState({ images })
    this.props.changeContent(this.props.record ? this.props.record.id : -1, 'image', images[0])
  }

  refresh = (record) => {
    let cfg = Object.assign({}, {
      chinese_name: '',
      germany_name: undefined,
      image: undefined
    }, record)

    let { chinese_name, germany_name, image } = cfg 

    let images = []
    if (image) {
      images.push(image)
    }

    this.setState({ images, chinese_name, germany_name })
  }

  componentWillMount() {
    this.refresh(this.props.record)
  }


  componentWillReceiveProps(nextProps) {
    this.refresh(nextProps.record)
  }

  render() {

    return (
      <div>
        <Row style={{ marginBottom: 10 }} >
          <Col span={4}><p>名称(中文):</p></Col>
          <Col span={16}>
            <Input style={{ width: '80%' }}
              value={this.state.chinese_name}
              onChange={(e) => {
                this.props.changeContent(
                  this.props.record ? this.props.record.id : -1, 
                  'chinese_name', 
                  e.target.value
                )
                this.setState({chinese_name: e.target.value});
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }} >
          <Col span={4}><p>名称(德文):</p></Col>
          <Col span={16}>
            <Input style={{ width: '80%' }}
              value={this.state.germany_name}
              onChange={(e) => {
                this.props.changeContent(
                  this.props.record ? this.props.record.id : -1, 
                  'germany_name', e.target.value)
                this.setState({germany_name: e.target.value});
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 10 }} >
          <Col span={4}><p>图片:</p></Col>
          <Col span={16}>
            <PhotoWall imgNum={1} images={this.state.images} images={this.newImages} />
          </Col>
        </Row>
      </div>
    );
  }
}

MaterialDetail.propTypes = {
  record: React.PropTypes.object,
  changeContent: React.PropTypes.func,
};

MaterialDetail.defaultProps = {
  record: {
    id: -1,
    chinese_name: '',
    germany_name: '',
    image: undefined
  },
  changeContent: ()=>{},
}

export default MaterialDetail;