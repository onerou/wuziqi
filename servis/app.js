const log4js = require("log4js");
const fs = require("fs");
const WebSocket = require("ws"); // 引入模块
const https = require("https");
const { parseTime } = require("./utils");
const express = require("express");
const URL = require("url");
const keyPath = process.cwd() + "/www.hecheng.info.key";
const certPath = process.cwd() + "/www.hecheng.info.pem";
const app = express();
const server = https.createServer(
  {
    cert: fs.readFileSync(certPath),
    key: fs.readFileSync(keyPath),
  },
  app
);
const ws = new WebSocket.Server({ server }, () => {});
log4js.configure({
  appenders: { globalError: { type: "file", filename: "./log/error.log" } },
  // 只有错误时error级别才会写入文件
  categories: { default: { appenders: ["globalError"], level: "error" } },
});
global.logger = log4js.getLogger("cheese");
global.clients = [];
global.match = [];
const checkBlackOrWhite = () => {
  return Math.floor(Math.random() * 100) >= 50;
};
const checkToUser = (from, to) => {
  const isBlack = checkBlackOrWhite();
  let playerFrom = clients.filter((client) => client.id == from)[0];
  let playerTo = clients.filter((client) => client.id == to)[0];
  match.push({
    black: isBlack ? playerFrom : playerTo,
    white: !isBlack ? playerFrom : playerTo,
    nextPlayer: true,
  });
  const sendToUser = {
    userId: to,
    toUserId: from,
    isBlack: !isBlack,
  };
  const sendFromUser = {
    userId: from,
    toUserId: to,
    isBlack,
  };
  playerFrom.client.send(JSON.stringify(sendFromUser));
  playerTo.client.send(JSON.stringify(sendToUser));
};
const sendDrew = ({ userId, isBlack, drewList }) => {
  const matchIndex = match.findIndex(
    (v) => v[isBlack ? "black" : "white"].id == userId
  );
  if (matchIndex < 0) throw new Error("matchIndex < 0"); // TODO: 错误捕获
  const { black, white, nextPlayer } = match[matchIndex];
  if (nextPlayer != isBlack) return;
  black.client.send(
    JSON.stringify({
      userId: black.id,
      toUserId: white.id,
      isBlack: true,
      drewList,
    })
  );
  white.client.send(
    JSON.stringify({
      userId: white.id,
      toUserId: black.id,
      isBlack: false,
      drewList,
    })
  );
  match[matchIndex].nextPlayer = !isBlack;
};
const changeChessBoard = ({
  userId,
  toUserId,
  isBlack,
  regretChess,
  resetBoard,
}) => {
  const matchIndex = match.findIndex(
    (v) => v.black.id == userId || v.white.id == userId
  );
  const { black, white, nextPlayer } = match[matchIndex];
  if (resetBoard) {
    match.splice(matchIndex, 1);
    black.client.send(
      JSON.stringify({
        resetBoard,
      })
    );
    white.client.send(
      JSON.stringify({
        resetBoard,
      })
    );
    checkToUser(userId, toUserId);
  }
  if (regretChess && nextPlayer == !isBlack) {
    black.client.send(
      JSON.stringify({
        userId: black.id,
        toUserId: white.id,
        isBlack: true,
        regretChess,
      })
    );
    white.client.send(
      JSON.stringify({
        userId: white.id,
        toUserId: black.id,
        isBlack: false,
        regretChess,
      })
    );
    match[matchIndex].nextPlayer = !nextPlayer;
  }
};

ws.on("connection", (client) => {
  client.on("message", (msg) => {
    if (msg === "ping") {
      client.send("pong");
      return;
    }
    const {
      toUserId,
      userId,
      drewList,
      regretChess,
      resetBoard,
      isBlack,
    } = JSON.parse(msg);
    if (!userId) {
      const id = Math.floor(Math.random() * 100000);
      global.clients.push({
        id,
        client,
      });
      client.send(
        JSON.stringify({
          userId: id,
        })
      );
      return;
    }
    const hasToUserId = clients.some((v) => v.id == toUserId);
    toUserId && hasToUserId && !drewList && checkToUser(userId, toUserId);
    toUserId && userId && drewList && sendDrew(JSON.parse(msg));
    toUserId &&
      userId &&
      (regretChess || resetBoard) &&
      changeChessBoard({
        userId,
        toUserId: Number(toUserId),
        isBlack,
        regretChess,
        resetBoard,
      });
  });
  client.on("close", (msg) => {
    console.log("close", msg);
  });
  client.on("error", (msg) => {
    console.log("error", msg);
  });
});

app.use(express.static("views"));
app.set("view engine", "pug");
app.use(async (req, res, next) => {
  try {
    await next();
  } catch (e) {
    console.log("e", e);
    logger.error(e);
  }
});
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get("/hasUserId", (req, res, next) => {
  const { userID } = URL.parse(req.url, true).query;
  const hasUserId = clients.some((client) => client.id === Number(userID));
  res.send(
    JSON.stringify({ data: hasUserId, msg: hasUserId ? "" : "此UserId不存在" })
  );
});

server.listen(3048, () => {
  console.log("Example app listening on port 3048!");
});
