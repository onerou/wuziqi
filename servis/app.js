const log4js = require("log4js");
const WebSocket = require("ws"); // 引入模块
const { parseTime } = require("./utils");
const ws = new WebSocket.Server({ port: 3045 }, () => {
});
log4js.configure({
  appenders: { globalError: { type: "file", filename: "./log/error.log" } },
  // 只有错误时error级别才会写入文件
  categories: { default: { appenders: ["globalError"], level: "error" } },
});
global.logger = log4js.getLogger("cheese");
global.clients = [];
global.match = []
const checkBlackOrWhite = () => {
    return Math.floor(Math.random()*100)>=50
}
const checkToUser = (from, to) => {
    const isBlack = checkBlackOrWhite()
    let playerFrom = clients.filter(client =>client.id == from)[0]
    let playerTo = clients.filter(client =>client.id == to)[0]
    match.push({ 
        black:isBlack?playerFrom:playerTo,
        white: !isBlack ? playerFrom : playerTo,
        nextPlayer:true
    })
    const sendToUser = {
        userId: to,
        toUserId: from,
        isBlack:!isBlack
    }
    const sendFromUser = {
        userId: from,
        toUserId: to,
        isBlack
    }
    playerFrom.client.send(JSON.stringify(sendFromUser))
    playerTo.client.send(JSON.stringify(sendToUser))
}
const sendDrew = ({userId,isBlack,drew}) => {
    const matchIndex = match.findIndex(v => v[isBlack ? 'black' : 'white'].id == userId)
    if(matchIndex < 0) return // TODO: 错误捕获
    const { black, white, nextPlayer } = match[matchIndex]
    if(nextPlayer != isBlack) return
    black.client.send(JSON.stringify({
        userId: black.id,
        toUserId: white.id,
        isBlack: true,
        drew
    }))
    white.client.send(JSON.stringify({
        userId: white.id,
        toUserId: black.id,
        isBlack: false,
        drew
    }))
    match[matchIndex].nextPlayer = !isBlack
}
const changeChessBoard = ({userId,toUserId,isBlack,regretChess,resetBoard})=>{
    const matchIndex = match.findIndex(v => v.black.id == userId || v.white.id == userId)
    const { black, white,nextPlayer } = match[matchIndex]
    if (resetBoard) {
        match.splice(matchIndex, 1)
        black.client.send(JSON.stringify({
            resetBoard
        }))
        white.client.send(JSON.stringify({
            resetBoard
        }))
        checkToUser(userId,toUserId)
    }
    if (regretChess) {
        black.client.send(JSON.stringify({
            userId: black.id,
            toUserId: white.id,
            isBlack: true,
            regretChess
        }))
        white.client.send(JSON.stringify({
            userId: white.id,
            toUserId: black.id,
            isBlack: false,
            regretChess
        }))
        match[matchIndex].nextPlayer = !nextPlayer
    }
}

ws.on("connection", (client) => {
    client.on("message", (msg) => {
        const thisClient = client
        if (msg === 'ping') {
            client.send('pong')
            return
        }
        const { toUserId, userId, drew,regretChess,resetBoard,isBlack } = JSON.parse(msg)
        if (!userId) {
            const id = Math.floor(Math.random()*100000)
            global.clients.push({
                id,
                client
            });
            client.send(
                JSON.stringify({
                    userId:id
                })
            );
            return
        }
        const hasToUserId = clients.some(v=>v.id==toUserId)
        toUserId && hasToUserId && !drew && checkToUser(userId, toUserId)
        toUserId && userId && drew && sendDrew({userId, toUserId,isBlack, drew})
        toUserId && userId && (regretChess||resetBoard) && changeChessBoard({userId, toUserId,isBlack,regretChess,resetBoard})
    });
    client.on("close", (msg) => {
    });
});