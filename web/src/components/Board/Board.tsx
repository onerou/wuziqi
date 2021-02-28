import React from 'react';
import { BoradContainer } from './BoradStyle'
import { cloneDeep } from 'lodash'
import store from '@STORE/index'
// import boots from '@UTILS/boot'
interface Lattice {
    width: number, height: number
}

interface BoradState {
    padding: number,
    borderColor: string,
    count: number,
    checkerboard: any[],
    role: number,
    lattice: Lattice,
    history: object[],
    currentStep: number,
    lineWidth: number,
    win: boolean,

};
interface BoradProps {
    padding?: number
    role?: number
    lineWidth?: number
    onRef?: any,
    onHasResult: any
    onDrawChessman?: (e) => void,
    drewList: []
}
export default class Board extends React.Component<BoradProps, BoradState> {
    public Canvas;
    constructor(props: BoradProps) {
        super(props);
        const defaultPadding = 40
        const defaultCount = 15
        this.state = {
            borderColor: 'black',
            count: defaultCount,
            padding: props.padding || defaultPadding,
            checkerboard: [],
            role: props.role || 1,
            lattice: {
                width: props.padding || defaultPadding,
                height: props.padding || defaultPadding
            },
            history: [],
            currentStep: 0,
            lineWidth: props.lineWidth || 2,
            win: false
        }
        this.Canvas = React.createRef()
        store.subscribe(() => {
            console.log(store.getState())
            this.props.drewList.map((v: any) => {
                this.drawChessman(v.position.x, v.position.y, v.isBlack)
            })
        })
    }

    initChessboardMatrix() {
        const { count } = this.state;
        const checkerboard = [];
        for (let x = 0; x < count; x++) {
            checkerboard[x] = [];
            for (let y = 0; y < count; y++) {
                checkerboard[x][y] = 0;
            }
        }
        this.setState({ checkerboard })
    }
    async drawChessman(x, y, isBlack) {
        const Canvas: any = this.Canvas.current
        const context = Canvas.getContext('2d');
        let { padding,
            currentStep,
            role,
            checkerboard,
            lattice,
            history } = this.state;
        let half_padding = padding / 2;
        context.beginPath();
        context.arc(half_padding + x * padding, half_padding + y * padding, half_padding - 2, 0, 2 * Math.PI);
        let gradient = context.createRadialGradient(half_padding + x * padding + 2, half_padding + y * padding - 2, half_padding - 2, half_padding + x * padding + 2, half_padding + y * padding - 2, 0);
        context.closePath();
        if (isBlack) {
            gradient.addColorStop(0, '#0a0a0a');
            gradient.addColorStop(1, '#636766');
        } else {
            gradient.addColorStop(0, '#d1d1d1');
            gradient.addColorStop(1, '#f9f9f9');
        }

        context.fillStyle = gradient;
        context.fill();
        checkerboard[x][y] = role;
        let newHistory: any[] = history.slice(0, currentStep)
        newHistory.push({// 保存坐标和角色快照
            x,
            y,
            role: role
        });
        this.setState({
            role: Object.is(this.state.role, 1) ? 2 : 1,
            currentStep: currentStep + 1,
            history: newHistory
        })
        // 每次下完棋后都要裁判判下是否有获胜的一方，异步操作
        await this.checkReferee(x, y, isBlack ? 1 : 2);
        // boots(this.state.checkerboard)
    }
    checkReferee(x, y, role) {
        if ((x == undefined) || (y == undefined) || (role == undefined)) return;
        // 连杀的分数，五个同一色的棋子连成一条直线就是胜利
        const { checkerboard } = this.state
        let countContinuous = 0;
        const XContinuous = checkerboard.map(x => x[y]); // x轴上连杀
        const YContinuous = checkerboard[x]; // y轴上连杀
        const S1Continuous = []; // 存储左斜线连杀
        const S2Continuous = []; // 存储右斜线连杀
        checkerboard.forEach((_y, i) => {
            // 左斜线
            const S1Item = _y[y - (x - i)];
            if (S1Item !== undefined) {
                S1Continuous.push(S1Item);
            }
            // 右斜线
            const S2Item = _y[y + (x - i)];
            if (S2Item !== undefined) {
                S2Continuous.push(S2Item);
            }
        });

        // 当前落棋点所在的X轴/Y轴/交叉斜轴，只要有能连起来的5个子的角色即有胜者

        [XContinuous, YContinuous, S1Continuous, S2Continuous].forEach(axis => {
            if (axis.some((x, i) => axis[i] !== 0 &&
                axis[i - 2] === axis[i - 1] &&
                axis[i - 1] === axis[i] &&
                axis[i] === axis[i + 1] &&
                axis[i + 1] === axis[i + 2])) {
                countContinuous++
            }
        });
        // 如果赢了就给出提示
        if (countContinuous) {
            this.props.onHasResult({
                msg: (role == 1 ? '黑' : '白') + '子胜利✌️',
                role: this.state.role
            })
        }
    }
    drawChessBoard() {
        const Canvas: any = this.Canvas.current
        const context = Canvas.getContext('2d');
        const { padding, count, borderColor } = this.state;
        let half_padding = padding / 2;
        Canvas.width = Canvas.height = padding * count;
        context.strokeStyle = borderColor;
        // 画棋盘
        for (var i = 0; i < count; i++) {
            context.moveTo(half_padding + i * padding, half_padding);
            context.lineTo(half_padding + i * padding, padding * count - half_padding);
            context.stroke(); // 这里绘制出的是竖轴
            context.moveTo(half_padding, half_padding + i * padding);
            context.lineTo(count * padding - half_padding, half_padding + i * padding);
            context.stroke(); // 这里绘制出的是横轴
        }
    }
    componentDidMount() {
        this.drawChessBoard()
        this.initChessboardMatrix()
        this.props.onRef(this)
        this.setState({
            win: false,
        })
    }
    resetBoard() {
        this.componentDidMount()
    }
    // 修补删除后的棋盘
    fixchessboard(a, b, c, d, e, f, g, h) {
        const Canvas: any = this.Canvas.current
        const context = Canvas.getContext('2d');
        const { borderColor, lineWidth } = this.state;
        context.strokeStyle = borderColor;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(a, b);
        context.lineTo(c, d);
        context.moveTo(e, f);
        context.lineTo(g, h);
        context.stroke();
    }
    minusStep(x, y) {
        const { padding, count } = this.state
        const Canvas: any = this.Canvas.current
        const context = Canvas.getContext('2d');
        context.clearRect(x * padding, y * padding, padding, padding);
        // 修补删除的棋盘位置
        // 重画该圆周围的格子,对边角的格式进行特殊的处理
        let half_padding = padding / 2; // 棋盘单元格的一半
        if (x <= 0 && y <= 0) { // 情况比较多，一共九种情况
            this.fixchessboard(half_padding, half_padding, half_padding, padding, half_padding, half_padding, padding, half_padding);
        } else if (x >= count - 1 && y <= 0) {
            this.fixchessboard(count * padding - half_padding, half_padding, count * padding - padding, half_padding, count * padding - half_padding, half_padding, count * padding - half_padding, padding);
        } else if (y >= count - 1 && x <= 0) {
            this.fixchessboard(15, count * padding - half_padding, half_padding, count * padding - padding, half_padding, count * padding - half_padding, padding, count * padding - half_padding);
        } else if (x >= count - 1 && y >= count - 1) {
            this.fixchessboard(count * padding - half_padding, count * padding - half_padding, count * padding - padding, count * padding - half_padding, count * padding - half_padding, count * padding - half_padding, count * padding - half_padding, count * padding - padding);
        } else if (x <= 0 && y > 0 && y < count - 1) {
            this.fixchessboard(half_padding, padding * y + half_padding, padding, padding * y + half_padding, half_padding, padding * y, half_padding, padding * y + padding);
        } else if (y <= 0 && x > 0 && x < count - 1) {
            this.fixchessboard(x * padding + half_padding, half_padding, x * padding + half_padding, padding, x * padding, half_padding, x * padding + padding, half_padding);
        } else if (x >= count - 1 && y > 0 && y < count - 1) {
            this.fixchessboard(count * padding - half_padding, y * padding + half_padding, count * padding - padding, y * padding + half_padding, count * padding - half_padding, y * padding, count * padding - half_padding, y * padding + padding);
        } else if (y >= count - 1 && x > 0 && x < count - 1) {
            this.fixchessboard(x * padding + half_padding, count * padding - half_padding, x * padding + half_padding, count * padding - padding, x * padding, count * padding - half_padding, x * padding + padding, count * padding - half_padding);
        } else {
            this.fixchessboard(half_padding + x * padding, y * padding, half_padding + x * padding, y * padding + padding, x * padding, y * padding + half_padding, (x + 1) * padding, y * padding + half_padding)
        }
    }
    // 悔棋
    regretChess() {
        // 找到最后一次记录，回滚到上一次的ui状态
        const { history, currentStep, checkerboard } = this.state
        if (history.length) {
            const prev: any = history[currentStep - 1];
            if (prev) {
                const {
                    x,
                    y,
                    role
                } = prev;
                // 销毁棋子
                this.minusStep(x, y);
                let newCheckerboard = cloneDeep(checkerboard)
                newCheckerboard[prev.x][prev.y] = 0; // 置空操作
                // 角色发生改变,下一步的下棋是该撤销棋子的角色
                this.setState({
                    checkerboard: newCheckerboard,
                    currentStep: currentStep - 1,
                    role: Object.is(role, 1) ? 1 : 2
                })
            }
        }
    }
    handleChlick(event) {
        if (this.state.win) return;
        let { padding,
            currentStep,
            role,
            checkerboard,
            lattice,
            history } = this.state;
        let {
            offsetX: x,
            offsetY: y,
        } = event.nativeEvent;
        x = Math.abs(Math.round((x - padding / 2) / lattice.width));
        y = Math.abs(Math.round((y - padding / 2) / lattice.height));
        if (checkerboard[x][y] !== undefined && Object.is(checkerboard[x][y], 0)) {
            // 这里调用刻画棋子的方法
            // this.drawChessman(x, y, Object.is(role, 1));
            // 切换棋子的角色
            // checkerboard[x][y] = role;
            // let newHistory: any[] = history.slice(0, currentStep)
            // newHistory.push({// 保存坐标和角色快照
            //     x,
            //     y,
            //     role: role
            // });
            this.props.onDrawChessman({ x, y, isBlack: Object.is(role, 1) })
            // this.setState({
            //     role: Object.is(this.state.role, 1) ? 2 : 1,
            //     currentStep: currentStep + 1,
            //     history: newHistory
            // })
        }
    }
    render() {
        return (
            <BoradContainer>
                <canvas ref={this.Canvas} style={{ backgroundColor: "rgb(251, 188, 5)" }} onClick={(e) => this.handleChlick(e)}>

                </canvas>
            </BoradContainer>
        )
    }
}