import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { GETMESSAGE, ADDSOCKET } from "./actions/appAction";

const initialState = {
  messageList: [],
  userId: null,
  toUserId: null,
  drewList: [],
};

function reducer(state = initialState, action) {
  console.log("reducer -> action.payload", action);
  switch (action.type) {
    case GETMESSAGE().type:
      return {
        ...state,
        ...action.payload,
      };
    case ADDSOCKET().type:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return { ...state };
  }
}
const store = createStore(reducer, applyMiddleware(thunk));

export default store;
