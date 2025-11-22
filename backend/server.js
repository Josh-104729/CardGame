const express = require("express");
const fileUpload = require('express-fileupload');
const app = express();
const cors = require("cors");
//middle ware
app.use(express.static('public')); //to access the files in public folder
app.use(fileUpload());
//file upload api
app.get("/", function (req, res) { });
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const env = require("dotenv").config().parsed;

const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;
const BACKEND_URL = process.env.BACKEND_URL;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = app.listen(8050, function () {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Luckyman app listening at http://%s:%s", host, port);
});

if (!HOST) {
  console.log("Please add an env file");
  return;
}

const io = require("socket.io")(5050);
app.set("io", io);

const mysql = require("mysql");

// Force IPv4 if HOST is 'localhost' to avoid IPv6 connection issues
// 'localhost' can resolve to IPv6 (::1) which may cause EACCES errors
const dbHost = (HOST === 'localhost' || HOST === '::1') ? '127.0.0.1' : HOST;

const db = mysql.createConnection({
  host: dbHost,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  port: 3306
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.message);
    console.error("Please check:");
    console.error("1. MySQL server is running");
    console.error("2. Database credentials in .env file are correct");
    console.error("3. MySQL is listening on port 3306");
    console.error(`4. Attempting to connect to: ${dbHost}:3306`);
    process.exit(1);
  }
  console.log("Connected to database");
});

const { RandomCardsGenerator } = require("./utils/randomCardsGenerator");
const { OutputRestCards } = require("./utils/outputRestCards");
const { OutputSortedCardArray } = require("./utils/outputSortedCardArray");
const { generateUploadFileName } = require("./utils/generateUploadFileName");
const { ScoreCalculator } = require("./utils/scoreCalculator");
const { T } = require("./const/texts");
const { INITIAL_HANDCARDS_COUNT, TOTAL_CARDS_COUNT, AUTOMATIC_PASS_TIME, SHOW_RESULT_TIME, INITIAL_BOUNTY } = require("./const/variables");
const { secretOrKey } = require('./const/config');

let data = [];

io.on('connection', function (socket) {
  socket.on('join', function (param) {
    const { room, user } = param;
    const { roomId, bonus, fee, size } = room;
    const { username, avatarUrl, bounty } = user;

    socket.user = username;
    socket.roomId = roomId;

    if (!data[roomId]) {
      data[roomId] = {
        userArray: [],
        havingCards: Array.from(Array(size), () => new Array),
        droppingCards: Array.from(Array(size), () => new Array),
        restingCards: [],
        order: 0,
        cycleCnt: 0,
        isStart: false,
        restCardCnt: TOTAL_CARDS_COUNT - size * INITIAL_HANDCARDS_COUNT,
        prevOrder: 0,
        counterIndex: null,
        counterCnt: 0,
        double: 1,
        isFinish: false,
        effectKind: '',
        effectOpen:false,
      }
    }

    if (!data[roomId].fee) data[roomId].fee = fee;
    if (!data[roomId].bonus) data[roomId].bonus = bonus;
    if (!data[roomId].size) data[roomId].size = size;

    if (!data[roomId].isStart) {
      if (data[roomId].userArray.length < data[roomId].size) {
        // Host will be added at the index 0
        if (data[roomId].userArray.findIndex(user => user.username === socket.user) < 0) {
          if (data[roomId].host === username) {
            data[roomId].userArray.unshift({
              username,
              bounty,
              exitreq: false,
              src: avatarUrl
            })
          }
          else {
            data[roomId].userArray.push({
              username,
              bounty,
              exitreq: false,
              src: avatarUrl
            })
          }
        }
        if (!data[roomId].host) {
          data[roomId].host = username;
        }
        io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
        updateRoomStatus(roomId, 0);
      }
      else {
        socket.emit("full", {
          msg: T['ROOM_FULL_MSG'],
          variant: "error",
        });
      }
    }
    else {
      socket.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
    }
  })

  socket.on('disconnect', function () {
    const roomId = socket.roomId;
    if (!roomId || !data[roomId]) {
      return;
    }
    const index = data[roomId].userArray.findIndex(user => user.username === socket.user);
    if (index === -1) {
      return;
    }
    if (!data[roomId].isStart) {
      data[roomId].userArray.splice(index, 1);
      updateRoomStatus(roomId, 1);
      io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
    } else {
      data[roomId].userArray[index].exitreq = true;
      io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
    }
  });

  socket.on('exit', function (param) {
    const { roomId } = param;
    const index = data[roomId].userArray.findIndex(user => user.username === socket.user);
    if (roomId && !data[roomId].isStart) {
      if (index > 0) {
        data[roomId].userArray.splice(index, 1);
        io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
        socket.emit('exit', { roomId, host: false });
        socket.roomId = 0;
        updateRoomStatus(roomId, 1);
      }
      else if (index === 0) {
        delete data[roomId];
        io.sockets.emit('exit', { roomId, host: true });
        updateRoomStatus(roomId, 4);
      }
    }
    else if (roomId && data[roomId].isStart) {
      if (index > -1) {
        data[roomId].userArray[index].exitreq = !data[roomId].userArray[index].exitreq;
        io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
      }
    }
  })

  socket.on('startgame', function (param) {
    const { roomId } = param;
    const randomcards = RandomCardsGenerator(data[roomId].size, INITIAL_HANDCARDS_COUNT, TOTAL_CARDS_COUNT);
    data[roomId].havingCards = Array.from(Array(data[roomId].size), () => new Array);
    data[roomId].havingCards.map((item, index) => {
      item.push(...randomcards.players[index]);
    })
    data[roomId].restingCards = randomcards.rest_cards;
    data[roomId].droppingCards = Array.from(Array(data[roomId].size), () => new Array);
    data[roomId].isStart = true;
    data[roomId].order = data[roomId].prevOrder;
    data[roomId].restCardCnt = TOTAL_CARDS_COUNT - data[roomId].size * INITIAL_HANDCARDS_COUNT;
    data[roomId].isFinish = false;

    resetRoomCounterTimer(roomId);

    io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
    updateRoomStatus(roomId, 2);
  });

  const increasingCounterCnt = (roomId) => {
    data[roomId].counterCnt += 1;
    if (data[roomId].counterCnt === AUTOMATIC_PASS_TIME + 1) {
      turningOrder(roomId);
    }
    io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
  }

  const resetRoomCounterTimer = (roomId) => {
    if (data[roomId].counterIndex) {
      clearInterval(data[roomId].counterIndex);
    }
    data[roomId].counterIndex = null;
    data[roomId].counterCnt = 0;
    if (data[roomId].isStart && !data[roomId].isFinish) {
      data[roomId].counterIndex = setInterval(() => increasingCounterCnt(roomId), 1000);
    }
  }

  const turningOrder = (roomId) => {
    resetRoomCounterTimer(roomId);
    // If turn changes from the son
    if (data[roomId].order === data[roomId].prevOrder) {
      data[roomId].order = (data[roomId].order + 1) % data[roomId].size;
      data[roomId].prevOrder = data[roomId].order;
    } else {
      data[roomId].order = (data[roomId].order + 1) % data[roomId].size;
    }
    if (data[roomId].cycleCnt === data[roomId].size - 1) {
      for (let i = 0; i < data[roomId].size; i++) {
        if (data[roomId].restCardCnt - i > 0)
          data[roomId].havingCards[i].push(data[roomId].restingCards[data[roomId].restCardCnt - i - 1])
        OutputSortedCardArray(data[roomId].havingCards[i]);
      }
      data[roomId].restCardCnt = data[roomId].restCardCnt - data[roomId].size;
      data[roomId].droppingCards = Array.from(Array(data[roomId].size), () => new Array);
    }
    data[roomId].cycleCnt = (data[roomId].cycleCnt + 1) % data[roomId].size

    io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null }, passBanner: true });
  }

  socket.on("shutcards", (param) => {
    let { choosedCard, roomId, double, effectkind, effectOpen } = param;
    data[roomId].prevOrder = data[roomId].order;
    data[roomId].double = double;
    data[roomId].effectKind = effectkind;
    data[roomId].effectOpen = effectOpen;

    resetRoomCounterTimer(roomId);

    // Add choosed card to dropping cards and remove from having cards
    OutputRestCards(data[roomId].havingCards[data[roomId].order], choosedCard);
    data[roomId].droppingCards.splice(data[roomId].order, 1, []);
    choosedCard.map((item) => {
      data[roomId].droppingCards[data[roomId].order].push(item)
    })

    if (data[roomId].havingCards[data[roomId].order].length === 0) {
      data[roomId].isFinish = true;
      resetRoomCounterTimer(roomId);
      const markArray = ScoreCalculator(data[roomId].bonus * data[roomId].double, data[roomId].havingCards, data[roomId].userArray);
      markArray.map((item, index) => {
        data[roomId].userArray[index].bounty += item;
      })
      data[roomId].havingCards.map((item, index) => {
        if (item.length !== 0) data[roomId].droppingCards[index] = item;
      })
      updateUsersBounty(data[roomId].userArray);
      // addGameLog(roomId, data[room])
      createRoomLog(roomId, data[roomId].userArray, markArray);
      setTimeout(() => resetUserArray(roomId), SHOW_RESULT_TIME * 1000);
    }
    else {
      data[roomId].order = (data[roomId].order + 1) % data[roomId].size
    }

    data[roomId].cycleCnt = 1;
    io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
  });

  const resetUserArray = (roomId) => {
    data[roomId].isStart = false;
    data[roomId].havingCards = Array.from(Array(data[roomId].size), () => new Array);
    data[roomId].droppingCards = Array.from(Array(data[roomId].size), () => new Array);
    data[roomId].double = 1;

    // If host should be existed
    if (data[roomId].userArray[0].bounty < data[roomId].fee || data[roomId].userArray[0].exitreq) {
      delete data[roomId];
      io.sockets.emit("exit", { roomId, host: true });
      updateRoomStatus(roomId, 4);
      return;
    }

    data[roomId].userArray = data[roomId].userArray.filter((item) => {
      if (item.bounty < data[roomId].fee || item.exitreq) {
        return false;
      }
      return true;
    })
    updateRoomStatus(roomId, 5, data[roomId].userArray.length);
    io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
  }

  socket.on("passcards", (param) => {
    let { roomId } = param;
    turningOrder(roomId);
    io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
  })


  const createRoomLog = (roomid, username, bonus) => {
    let create_at = new Date().toISOString();
    let len = username.length;
    for (let i = 0; i < len; i++) {
      let createRoom_query = `INSERT INTO game_logs(room_id,username,bonus,create_at) VALUES(${roomid},'${username[i].username}',${bonus[i]},'${create_at}')`
      db.query(createRoom_query, (err, result) => {
        if (err) console.log("Server err..");
      })

    }

  }

  const updateRoomStatus = (roomId, status, newMembers = 0) => {
    // Status: 0 => One Entry
    // Status: 1 => One Exit
    // Status: 2 => Full to Playing
    // Status: 3 => Entry to Playing
    // Status: 4 => Close
    // Status: 5 => Members Update
    let cnt_query = `SELECT * FROM room_info WHERE room_id = '${roomId}'`;
    db.query(cnt_query, (err, resu) => {
      if (err) return;
      if (!resu.length) return;
      let room_query;
      const members = resu[0].members;
      const size = resu[0].size;
      if (status === 0) {
        room_query = `UPDATE room_info SET members='${members + 1 <= size ? members + 1 : size}', status = '${members + 1 >= size ? 1 : 0}' WHERE room_id = '${roomId}'`;
      } else if (status === 1) {
        room_query = `UPDATE room_info SET members='${members - 1 >= 0 ? members - 1 : 0}', status = '0' WHERE room_id = '${roomId}'`;
      } else if (status === 2) {
        room_query = `UPDATE room_info SET members='${size}', status = '2' WHERE room_id = '${roomId}'`;
      } else if (status === 3) {
        room_query = `UPDATE room_info SET members='${size}', status = '1' WHERE room_id = '${roomId}'`;
      } else if (status === 4) {
        room_query = `UPDATE room_info SET members='0', status = '3' WHERE room_id = '${roomId}'`;
      } else if (status === 5) {
        room_query = `UPDATE room_info SET members='${newMembers}', status = '0' WHERE room_id = '${roomId}'`;
      } else {
        return;
      }
      db.query(room_query, () => {
        io.sockets.emit('room_refetch');
      });
    });
  }

  const updateUsersBounty = (users) => {
    users.map(i => {
      let query = `UPDATE person_info SET bounty='${i.bounty}' WHERE username = '${i.username}'`;
      db.query(query, (err, rev) => {
        if (err) console.log("Server Error..");
      });
    });
  }
});

app.post("/log_in", function (req, res) {
  db.query(
    `SELECT * FROM person_info WHERE username='${req.body.UserName}'`,
    function (err, result) {
      if (err) throw err;
      let myResult = {
        variant: "",
        msg: ""
      };
      if (result.length === 0) {
        myResult.msg += T['NO_USER_FOUND'];
        myResult.variant += "warning";
        res.send(myResult);
      } else {
        if (req.body.Password === result[0].password) {
          if (parseInt(result[0].allowedbyadmin) === 1) {
            if (result[0].signtoken === "------") {
              myResult.msg += T['USER_SIGNIN_SUCCESS'];
              myResult.variant += "success";
              myResult = {
                ...myResult,
                bounty: result[0].bounty,
                username: result[0].username,
                avatar: result[0].avatar_url
              };
              const payload = {
                name: req.body.UserName,
                password: req.body.Password
              }; //  Create JWT PayLoad
              //  Sign Token
              jwt.sign(
                payload,
                secretOrKey,
                { expiresIn: 10800 },
                (err, token) => {
                  myResult.token = "Bearer " + token;
                  let query = `UPDATE person_info SET signtoken = '${myResult.token
                    }' WHERE username = '${req.body.UserName}'`;
                  db.query(query, function (err, resu) {
                    if (resu) {
                      res.send(myResult);
                    }
                  });
                }
              );
            } else {
              myResult.msg += T['USER_SIGNIN_DUPLICATE'];
              myResult.variant += "error";
              myResult.token = "404";
              res.send(myResult);
            }
          } else {
            myResult.msg += T['USER_SIGNIN_PERMISSION_NEEDED'];
            myResult.variant += "info";
            res.send(myResult);
          }
        } else {
          myResult.msg += T['USER_SIGNIN_INCORRECT_PASSWORD'];
          myResult.variant += "warning";
          res.send(myResult);
        }
      }
    }
  );
});

app.post("/register", function (req, res) {
  let myResult = {
    variant: "",
    msg: "",
  };
  db.query(
    `SELECT * FROM person_info WHERE username='${req.body.UserName}'`,
    function (err, result) {
      if (err || result.length === 0) {
        let create_at = new Date().toISOString();
        db.query(
          `INSERT INTO person_info(full_name,username,password,bounty,signtoken,birthdate,gender,allowedbyadmin,email, avatar_url,create_at) VALUES ('${req.body.Name}','${req.body.UserName}','${req.body.Password}',${INITIAL_BOUNTY},'------','${req.body.BirthDay}','${req.body.Gender}','${req.body.AllowedByAdmin}', '${req.body.Email}','${req.body.AvatarUrl}','${create_at}')`
        );
        myResult.variant = "success";
        myResult.msg += T['USER_SIGNUP_SUCCESS'];
      } else {
        myResult.variant = "warning";
        myResult.msg += T['USER_SIGNUP_DUPLICATE'];
      }
      res.send(myResult);
    }
  );
});

app.post("/upload", function (req, res) {
  if (!req.files.file) {
    return res.status(500).send({ success: false, msg: T['UPLOAD_FILE_NOT_FOUND'] })
  }
  // accessing the file
  const myFile = req.files.file;
  //  mv() method places the file inside public directory
  const type = "png";
  const filename = generateUploadFileName() + "." + type;
  myFile.mv(`${__dirname}/public/${filename}`, function (err) {
    if (err) {
      console.log(err)
      return res.status(500).send({ success: false, msg: T['UPLOAD_FILE_ERROR'] });
    }
    // returing the response with file path and name
    return res.send({ success: true, name: filename, path: `${BACKEND_URL}/${filename}` });
  });
});

app.post("/clear_tk", function (req, res) {
  let myResult = {
    status: "",
  };
  let query = `UPDATE person_info SET signtoken = '------' WHERE username = '${req.body.UserName}'`;
  db.query(query, function (err, result) {
    if (err) {
      myResult.status = 0;
    } else myResult.status = 1;
    res.send(myResult);
  });
});

app.post("/validate_token", function (req, res) {
  let myResult = {
    status: "",
  };
  let query = `SELECT * from person_info WHERE signtoken = '${req.body.token}'`;
  db.query(query, function (err, result) {
    if (err) {
      myResult.status = 0;
    } else if (result.length === 0) {
      myResult.status = 0;
    } else {
      myResult.status = 1;
      myResult.user = result[0];
    }
    res.send(myResult);
  });
});

app.post("/create_room", function (req, res) {
  let new_result = {
    msg: "",
    roomID: -1
  };
  db.query(`SELECT creator FROM room_info WHERE creator = '${req.body.creator}' AND status = 0`, function (err, result) {
    if (result.length > 0) {
      new_result = {
        variant: 'warning',
        msg: T['CREATE_ROOM_DUPLICATE'],
        roomID: -1
      };
      res.send(new_result);
    }
    else {
      let create_at = new Date().toISOString();
      db.query(`INSERT INTO room_info(creator,bonus,fee,size,status,created_at,updated_at,members) VALUES ('${req.body.creator}','${req.body.bonus}','${req.body.fee}','${req.body.size}','${req.body.status}', '${create_at}','${create_at}','0')`, function (err1, result1) {
        if (err1) throw err1;
        db.query(`SELECT room_id FROM room_info WHERE creator = '${req.body.creator}' AND status = 0`, function (err2, result2) {
          if (err2) throw err2;
          new_result = {
            variant: "success",
            msg: T['CREATE_ROOM_SUCCESS'],
            roomID: result2[0].room_id,
          }
          io.sockets.emit('room_refetch');
          res.send(new_result);
        })
      });
      db.query(`INSERT INTO room_log_info(creator,bonus,fee,size,status,created_at,updated_at,members) VALUES ('${req.body.creator}','${req.body.bonus}','${req.body.fee}','${req.body.size}','${req.body.status}', '${create_at}','${create_at}','1')`);
    }
  });
});

app.post("/get_rooms", function (req, res) {
  let resValue = new Object();
  let search_key;
  let pgSize = 100;
  let pgNum = 0;
  if (req.body.search_key) {
    search_key = req.body.search_key;
  } else search_key = "";
  if (req.body.pgSize) {
    pgSize = req.body.pgSize;
  } else pgSize = 5;
  if (req.body.pgNum) {
    pgNum = parseInt(req.body.pgNum) - 1;
  } else pgNum = 1;
  let query = `SELECT * FROM room_info WHERE status < 3 AND (creator LIKE '%${search_key}%' OR room_id LIKE '%${search_key}%') ORDER BY room_id DESC LIMIT ${pgSize} OFFSET ${pgNum * pgSize
    }`;
  let query_2 = `SELECT COUNT(X.room_id) AS total_cnt FROM (SELECT * FROM room_info WHERE status < 3 AND (creator LIKE '%${search_key}%' OR room_id LIKE '%${search_key}%')) AS X`;
  db.query(query, function (err, result) {
    db.query(query_2, function (err, result1) {
      resValue.data = result;
      resValue.total = result1;
      res.send(resValue);
    });
  });
});