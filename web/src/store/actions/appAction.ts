export const GETMESSAGE = (e?: any) => {
  return {
    type: "GETMESSAGE",
    payload: e ? JSON.parse(e) : {},
  };
};
export const ADDSOCKET = (e?: any) => {
  return {
    type: "ADDSOCKET",
    payload: e,
  };
};
export const SETTOUSERID = (e?: any) => {
  return {
    type: "SETTOUSERID",
    payload: e,
  };
};
