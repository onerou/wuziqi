import React from 'react';
import {
    withRouter
} from "react-router-dom";
import { Button, Card, Input, Form, message } from "antd"
import 'antd/lib/button/style/index.less'
import 'antd/lib/card/style/index.less'
import 'antd/lib/input/style/index.less'
import 'antd/lib/form/style/index.less'
import 'antd/lib/button/style/index.less'

import { ButtonContainer, UserInfoContainer } from "./AppStyle"
import { connect } from "react-redux"
import { contentWS, messageFn } from "@STORE/actions/asyncAction"
import axios from "axios"
import store from '@STORE/index'

interface HomeState {
    messageList: any[],
    infoVisible: boolean,
    contentButton: boolean,
    toUserId: number | string,
    userName: null | string,
    errorMsg: string,
    contentLoading: boolean
}

function mapStateToProps(state: HomeState) {
    return {
        ...state
    }
}

const mapDispatchToProps = {
    contentWS,
    messageFn
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
};
const { Search } = Input;
class App extends React.Component<any, HomeState> {
    form: any;
    constructor(props) {
        super(props);
        this.state = {
            messageList: [],
            toUserId: null,
            infoVisible: false,
            contentButton: true,
            userName: this.props.userName,
            errorMsg: '',
            contentLoading: false
        }
    }
    changeInfoVisible(flag: boolean) {
        this.props.contentWS()
        this.setState({
            infoVisible: flag
        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.history.location.pathname !== "/") return;
        if (nextProps.toUserId && this.props.history.location.pathname != "/home") this.props.history.push("/home");
    }
    onFinish = (e) => {
    }
    handleChangeUserName(e) {
        this.setState({ userName: e.target.value })
    }
    onSearch(e) {
        let _this = this
        axios.get(`http://www.hecheng.info:3048/hasUserId?userID=${e}`).then(({ data, msg }: any) => {
            _this.setState({ contentButton: !data })
            if (msg) {
                message.error(msg);
            }
        })
    }
    handleChangeToUserName(e) {
        this.setState({ toUserId: e.target.value })
    }
    contactToUser() {
        this.setState({ contentLoading: true })
        this.props.messageFn({
            userId: this.props.userId,
            toUserId: Number(this.state.toUserId),
            userName: this.state.userName
        })
    }
    render() {
        return (<>
            <ButtonContainer>
                {this.state.infoVisible ?
                    <Card title="登陆信息" style={{ width: "100%" }}>
                        <Form {...layout} onFinish={this.onFinish}>
                            {/* <Form.Item label="用户名" >
                                <Input placeholder="用户名" value={this.state.userName} onChange={(e) => this.handleChangeUserName(e)} />
                            </Form.Item> */}
                            <Form.Item label="用户ID" >
                                <b>{this.props.userId}</b>
                            </Form.Item>
                            <Form.Item label="对战用户" >
                                <Search placeholder="请输入用户ID" value={this.state.toUserId} onChange={(e) => this.handleChangeToUserName(e)} onSearch={(e) => this.onSearch(e)} />
                            </Form.Item>
                            <Form.Item {...tailLayout}>
                                <Button type="primary" loading={this.state.contentLoading} block disabled={this.state.contentButton} onClick={() => this.contactToUser()}>匹配</Button>
                            </Form.Item>
                        </Form>
                    </Card> :
                    <Button type="primary" onClick={() => this.changeInfoVisible(true)}>进入游戏</Button>
                }

            </ButtonContainer>
        </>)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App))