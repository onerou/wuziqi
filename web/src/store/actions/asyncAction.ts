// thunk Action
import webSocket from "@UTILS/webSocket";
import { GETMESSAGE, ADDSOCKET, RESETFLAG } from "./appAction";

type Dispatch = any;
type GetState = any;

export const messageFn = (data: any) => {
  console.log("messageFn -> data", data);
  return (dispatch: Dispatch, getState: GetState) => {
    const { socket } = getState();
    socket.sendHandle(data);
  };
};

export const contentWS = () => {
  return (dispatch: Dispatch, getState: GetState) => {
    const { userId, toUserId } = getState();
    const socket = new webSocket(
      `wss://www.hecheng.info:3048`,
      (e) => {
        dispatch(GETMESSAGE(e));
      },
      "五子棋"
    );
    socket.connect({
      userId,
      toUserId,
    });
    dispatch(ADDSOCKET({ socket }));
  };
};
export const resetFlage = (e) => {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(RESETFLAG(e));
  };
};

export default { contentWS, messageFn };
