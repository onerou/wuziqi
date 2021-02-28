import React from 'react';
import Board from '@COMPONTENT/Board'
import { withRouter } from "react-router-dom";
import { Button } from 'antd';
import { connect } from "react-redux"
import { contentWS, messageFn } from "@STORE/actions/asyncAction"

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
    messageFn
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
    messageFn(message: any) {
        const data = JSON.parse(message) || {}
        if (data.drew) {
            const { position, isBlack } = data.drew
            this.state.child.drawChessman(position.x, position.y, isBlack);
        }
        // if (data.regretChess) {
        //     this.state.child.regretChess()
        // }
        if (data.resetBoard) {
            this.state.child.resetBoard()
            this.setState({ msg: '' })
        }

        // this.setState({ messageList: [data, ...this.state.messageList] })
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
    render() {
        return (<>
            {!this.props.toUserId
                ? ''
                : (<>
                    <Board onRef={(e) => this.onRef(e)} drewList={this.props.drewList} onDrawChessman={(e) => { this.onDrawChessman(e) }} onHasResult={(e) => this.onHasResult(e)}></Board>
                    {/* <button onClick={() => this.regretChess()}>
                        悔棋
                    </button> */}
                    <Button onClick={() => this.resetBoard()}>
                        重置
                    </Button>
                    <div className="message">
                        {this.state.msg}
                    </div>
                </>)}
            <div className="userId">
                userId:{this.props.userId}&nbsp;&nbsp;{this.props.isBlack == null ? '' : `执子：${this.props.isBlack ? '黑' : '白'}`}
            </div>
            <div className="userId">
                to:{this.props.toUserId}
            </div>
        </>)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Home))