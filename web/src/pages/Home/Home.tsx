import React from 'react';
import Board from '@COMPONTENT/Board'
import webSocket from "@UTILS/webSocket"
// import { Button, Input } from 'antd';

interface HomeState {
    child: any,
    msg: string,
    messageList: any[],
    userId: number | null,
    socket: any,
    toUserId: number
    loading: boolean
    isBlack: boolean
}
export default class Home extends React.Component<any, HomeState> {
    public toUserIdInput: any
    constructor(props) {
        super(props);
        this.state = {
            child: null,
            msg: '',
            messageList: [],
            userId: null,
            socket: null,
            toUserId: null,
            loading: false,
            isBlack: null
        }
        this.toUserIdInput = React.createRef()
    }
    onRef(e) {
        this.setState({ child: e })
    }
    onHasResult(e) {
        this.setState({ msg: e.msg })
    }
    messageFn(message: any) {
        const data = JSON.parse(message) || {}
        if (!this.state.userId && data.userId) {
            this.setState({
                userId: data.userId
            })
        }
        if (!this.state.toUserId && data.toUserId) {
            this.setState({
                toUserId: data.toUserId
            })
        }
        if (data.isBlack != undefined) {
            this.setState({
                isBlack: data.isBlack
            })
        }
        if (data.drew) {
            const { position, isBlack } = data.drew
            this.state.child.drawChessman(position.x, position.y, isBlack);
        }
        if (data.regretChess) {
            this.state.child.regretChess()
        }
        if (data.resetBoard) {
            this.state.child.resetBoard()
            this.setState({ msg: '' })
        }

        this.setState({ messageList: [data, ...this.state.messageList] })
    }
    UNSAFE_componentWillMount() {
        const socket = new webSocket(`ws://www.hecheng.info:3045`, (e) => { this.messageFn(e) }, '五子棋')
        socket.connect({
            userId: this.state.userId,
            toUserId: this.state.toUserId
        })
        this.setState({ socket: socket })
    }
    componentWillUnmount() {
        this.state.socket.closeMyself()
    }
    onDrawChessman({ x, y }) {
        if (this.state.msg) return
        this.state.socket.sendHandle({
            userId: this.state.userId,
            toUserId: this.state.toUserId,
            isBlack: this.state.isBlack,
            drew: {
                isBlack: this.state.isBlack,
                position: { x, y },
            }
        })
    }
    regretChess() {
        this.state.socket.sendHandle({
            userId: this.state.userId,
            toUserId: this.state.toUserId,
            isBlack: this.state.isBlack,
            regretChess: true
        })
    }
    resetBoard() {
        this.state.socket.sendHandle({
            userId: this.state.userId,
            toUserId: this.state.toUserId,
            isBlack: this.state.isBlack,
            resetBoard: true
        })
    }
    sendUserToIdChange() {
        this.state.socket.sendHandle({
            userId: this.state.userId,
            toUserId: this.toUserIdInput.current.value / 1
        })

    }
    render() {
        return (<>
            {!this.state.toUserId
                ? ''
                : (<>
                    <Board onRef={(e) => this.onRef(e)} onDrawChessman={(e) => { this.onDrawChessman(e) }} onHasResult={(e) => this.onHasResult(e)}></Board>
                    <button onClick={() => this.regretChess()}>
                        悔棋
                    </button>
                    <button onClick={() => this.resetBoard()}>
                        重置
                    </button>
                    <div className="message">
                        {this.state.msg}
                    </div>
                </>)}
            <div className="userId">
                userId:{this.state.userId}&nbsp;&nbsp;{this.state.isBlack == null ? '' : `执子：${this.state.isBlack ? '黑' : '白'}`}
            </div>
            <div className="userId">
                to:{!this.state.toUserId ? (<><input ref={this.toUserIdInput} /> <button onClick={() => this.sendUserToIdChange()} >连接</button></>) : this.state.toUserId}
            </div>
        </>)
    }
}