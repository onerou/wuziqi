import React from 'react';
import {
    Link
} from "react-router-dom";

interface HomeState {
    child: any,
    msg: string,
    messageList: any[],
    userId: number
}
export default class App extends React.Component<any, HomeState> {

    constructor(props) {
        super(props);
        this.state = {
            child: null,
            msg: '',
            messageList: [],
            userId: 0
        }
    }

    render() {
        return (<>
            <Link to="/home">
                <button >进入游戏</button>
            </Link>
        </>)
    }
}