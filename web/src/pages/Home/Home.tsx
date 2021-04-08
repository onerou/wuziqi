import React from 'react';
import Board from '@COMPONTENT/Board'
import { withRouter } from "react-router-dom";
import { Button, Descriptions, Card } from 'antd';
import 'antd/lib/button/style/index.less'
import 'antd/lib/descriptions/style/index.less'
import { connect } from "react-redux"
import { contentWS, messageFn, resetFlage } from "@STORE/actions/asyncAction"

interface HomeState {
    child: any,
    msg: string,
    messageList?: any[],
    userId?: number | null,
    socket?: any,
    toUserId?: number
    isBlack?: boolean
}
function mapStateToProps(state: HomeState) {
    return {
        ...state
    }
}

const mapDispatchToProps = {
    contentWS,
    messageFn,
    resetFlage
}
class Home extends React.Component<any, HomeState> {
    public toUserIdInput: any
    constructor(props) {
        super(props);
        this.state = {
            child: null,
            msg: '',
        }
        this.toUserIdInput = React.createRef()
        if (!this.props.toUserId) this.props.history.push("/")
    }
    onRef(e) {
        this.setState({ child: e })
    }
    onHasResult(e) {
        this.setState({ msg: e.msg })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.resetBoard) {
            this.setState({ msg: '' })
        }
    }
    onDrawChessman({ x, y }) {
        if (this.state.msg) return
        this.props.messageFn({
            userId: this.props.userId,
            toUserId: this.props.toUserId,
            isBlack: this.props.isBlack,
            drewList: [...this.props.drewList, {
                isBlack: this.props.isBlack,
                position: { x, y },
            }]
        })
    }
    regretChess() {
        this.props.messageFn({
            userId: this.props.userId,
            toUserId: this.props.toUserId,
            isBlack: this.props.isBlack,
            regretChess: true
        })
    }
    resetBoard() {
        this.props.messageFn({
            userId: this.props.userId,
            toUserId: this.props.toUserId,
            isBlack: this.props.isBlack,
            resetBoard: true
        })
    }
    initBoard() {
        this.props.resetFlage({ resetBoard: false })
    }
    render() {
        return (<>
            {!this.props.toUserId
                ? ''
                : (<>
                    <Card title="User Info" style={{ width: "50vw", margin: "0 auto", minWidth: "600px" }}>
                        <Descriptions size="small">
                            <Descriptions.Item label="userId">{this.props.userId}</Descriptions.Item>
                            <Descriptions.Item label="执子">{this.props.isBlack ? '黑' : '白'}</Descriptions.Item>
                            <Descriptions.Item label="toUserId">{this.props.toUserId}</Descriptions.Item>
                            <Descriptions.Item label="操作">
                                <Button type="dashed" danger onClick={() => this.resetBoard()}>
                                    认输
                                </Button>
                                {/* <button onClick={() => this.regretChess()}>
                                    悔棋
                                    </button> */}
                            </Descriptions.Item>
                            <Descriptions.Item label="Remark">{this.state.msg}</Descriptions.Item>
                        </Descriptions>,
                        <Board resetBoard={this.props.resetBoard} initBoard={() => this.initBoard()} onRef={(e) => this.onRef(e)} drewList={this.props.drewList} onDrawChessman={(e) => { this.onDrawChessman(e) }} onHasResult={(e) => this.onHasResult(e)}></Board>
                    </Card>
                </>)
            }
        </>)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))