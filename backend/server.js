require("reflect-metadata");
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

// TypeORM Data Source
const AppDataSource = require("./config/database");

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to database via TypeORM");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
    console.error("Please check:");
    console.error("1. MySQL server is running");
    console.error("2. Database credentials in .env file are correct");
    console.error("3. MySQL is listening on port 3306");
    process.exit(1);
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
        updateRoomStatus(roomId, 0).catch(err => console.error("Error updating room status:", err));
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
      updateRoomStatus(roomId, 1).catch(err => console.error("Error updating room status:", err));
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
        updateRoomStatus(roomId, 1).catch(err => console.error("Error updating room status:", err));
      }
      else if (index === 0) {
        delete data[roomId];
        io.sockets.emit('exit', { roomId, host: true });
        updateRoomStatus(roomId, 4).catch(err => console.error("Error updating room status:", err));
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
    updateRoomStatus(roomId, 2).catch(err => console.error("Error updating room status:", err));
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
      updateUsersBounty(data[roomId].userArray).catch(err => console.error("Error updating bounty:", err));
      // addGameLog(roomId, data[room])
      createRoomLog(roomId, data[roomId].userArray, markArray).catch(err => console.error("Error creating room log:", err));
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
      updateRoomStatus(roomId, 4).catch(err => console.error("Error updating room status:", err));
      return;
    }

    data[roomId].userArray = data[roomId].userArray.filter((item) => {
      if (item.bounty < data[roomId].fee || item.exitreq) {
        return false;
      }
      return true;
    })
    updateRoomStatus(roomId, 5, data[roomId].userArray.length).catch(err => console.error("Error updating room status:", err));
    io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
  }

  socket.on("passcards", (param) => {
    let { roomId } = param;
    turningOrder(roomId);
    io.sockets.emit('update', { roomId, roomData: { ...data[roomId], counterIndex: null } });
  })


  const createRoomLog = async (roomid, username, bonus) => {
    const gameLogRepository = AppDataSource.getRepository("GameLog");
    let create_at = new Date().toISOString();
    let len = username.length;
    for (let i = 0; i < len; i++) {
      try {
        await gameLogRepository.insert({
          room_id: roomid,
          username: username[i].username,
          bonus: bonus[i],
          create_at: create_at
        });
      } catch (err) {
        console.log("Server err..", err);
      }
    }
  }

  const updateRoomStatus = async (roomId, status, newMembers = 0) => {
    // Status: 0 => One Entry
    // Status: 1 => One Exit
    // Status: 2 => Full to Playing
    // Status: 3 => Entry to Playing
    // Status: 4 => Close
    // Status: 5 => Members Update
    const roomInfoRepository = AppDataSource.getRepository("RoomInfo");
    try {
      const room = await roomInfoRepository.findOne({
        where: { room_id: roomId }
      });
      if (!room) return;
      
      const members = room.members;
      const size = room.size;
      let updateData = {};
      
      if (status === 0) {
        updateData.members = members + 1 <= size ? members + 1 : size;
        updateData.status = members + 1 >= size ? 1 : 0;
      } else if (status === 1) {
        updateData.members = members - 1 >= 0 ? members - 1 : 0;
        updateData.status = 0;
      } else if (status === 2) {
        updateData.members = size;
        updateData.status = 2;
      } else if (status === 3) {
        updateData.members = size;
        updateData.status = 1;
      } else if (status === 4) {
        updateData.members = 0;
        updateData.status = 3;
      } else if (status === 5) {
        updateData.members = newMembers;
        updateData.status = 0;
      } else {
        return;
      }
      
      await roomInfoRepository.update({ room_id: roomId }, updateData);
      io.sockets.emit('room_refetch');
    } catch (err) {
      console.error("Error updating room status:", err);
    }
  }

  const updateUsersBounty = async (users) => {
    const personInfoRepository = AppDataSource.getRepository("PersonInfo");
    for (const user of users) {
      try {
        await personInfoRepository.update(
          { username: user.username },
          { bounty: user.bounty }
        );
      } catch (err) {
        console.log("Server Error..", err);
      }
    }
  }
});

app.post("/log_in", async function (req, res) {
  const personInfoRepository = AppDataSource.getRepository("PersonInfo");
  try {
    const result = await personInfoRepository.findOne({
      where: { username: req.body.UserName }
    });
    
    let myResult = {
      variant: "",
      msg: ""
    };
    
    if (!result) {
      myResult.msg += T['NO_USER_FOUND'];
      myResult.variant += "warning";
      res.send(myResult);
    } else {
      if (req.body.Password === result.password) {
        if (parseInt(result.allowedbyadmin) === 1) {
          if (result.signtoken === "------") {
            myResult.msg += T['USER_SIGNIN_SUCCESS'];
            myResult.variant += "success";
            myResult = {
              ...myResult,
              bounty: result.bounty,
              username: result.username,
              avatar: result.avatar_url
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
              async (err, token) => {
                if (err) throw err;
                myResult.token = "Bearer " + token;
                await personInfoRepository.update(
                  { username: req.body.UserName },
                  { signtoken: myResult.token }
                );
                res.send(myResult);
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send({ variant: "error", msg: "Server error" });
  }
});

app.post("/register", async function (req, res) {
  const personInfoRepository = AppDataSource.getRepository("PersonInfo");
  let myResult = {
    variant: "",
    msg: "",
  };
  try {
    const existingUser = await personInfoRepository.findOne({
      where: { username: req.body.UserName }
    });
    
    if (!existingUser) {
      let create_at = new Date().toISOString();
      await personInfoRepository.insert({
        full_name: req.body.Name,
        username: req.body.UserName,
        password: req.body.Password,
        bounty: INITIAL_BOUNTY,
        signtoken: "------",
        birthdate: req.body.BirthDay,
        gender: req.body.Gender,
        allowedbyadmin: req.body.AllowedByAdmin,
        email: req.body.Email,
        avatar_url: req.body.AvatarUrl,
        create_at: create_at
      });
      myResult.variant = "success";
      myResult.msg += T['USER_SIGNUP_SUCCESS'];
    } else {
      myResult.variant = "warning";
      myResult.msg += T['USER_SIGNUP_DUPLICATE'];
    }
    res.send(myResult);
  } catch (err) {
    console.error("Register error:", err);
    myResult.variant = "error";
    myResult.msg = "Server error";
    res.status(500).send(myResult);
  }
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

app.post("/clear_tk", async function (req, res) {
  const personInfoRepository = AppDataSource.getRepository("PersonInfo");
  let myResult = {
    status: "",
  };
  try {
    await personInfoRepository.update(
      { username: req.body.UserName },
      { signtoken: "------" }
    );
    myResult.status = 1;
    res.send(myResult);
  } catch (err) {
    console.error("Clear token error:", err);
    myResult.status = 0;
    res.send(myResult);
  }
});

app.post("/validate_token", async function (req, res) {
  const personInfoRepository = AppDataSource.getRepository("PersonInfo");
  let myResult = {
    status: "",
  };
  try {
    const result = await personInfoRepository.findOne({
      where: { signtoken: req.body.token }
    });
    if (!result) {
      myResult.status = 0;
    } else {
      myResult.status = 1;
      myResult.user = result;
    }
    res.send(myResult);
  } catch (err) {
    console.error("Validate token error:", err);
    myResult.status = 0;
    res.send(myResult);
  }
});

app.post("/create_room", async function (req, res) {
  const roomInfoRepository = AppDataSource.getRepository("RoomInfo");
  const roomLogInfoRepository = AppDataSource.getRepository("RoomLogInfo");
  let new_result = {
    msg: "",
    roomID: -1
  };
  try {
    const existingRoom = await roomInfoRepository.findOne({
      where: { creator: req.body.creator, status: 0 }
    });
    
    if (existingRoom) {
      new_result = {
        variant: 'warning',
        msg: T['CREATE_ROOM_DUPLICATE'],
        roomID: -1
      };
      res.send(new_result);
    } else {
      let create_at = new Date().toISOString();
      await roomInfoRepository.insert({
        creator: req.body.creator,
        bonus: req.body.bonus,
        fee: req.body.fee,
        size: req.body.size,
        status: req.body.status,
        created_at: create_at,
        updated_at: create_at,
        members: 0
      });
      
      const createdRoom = await roomInfoRepository.findOne({
        where: { creator: req.body.creator, status: 0 }
      });
      
      new_result = {
        variant: "success",
        msg: T['CREATE_ROOM_SUCCESS'],
        roomID: createdRoom.room_id,
      };
      
      await roomLogInfoRepository.insert({
        creator: req.body.creator,
        bonus: req.body.bonus,
        fee: req.body.fee,
        size: req.body.size,
        status: req.body.status,
        created_at: create_at,
        updated_at: create_at,
        members: 1
      });
      
      io.sockets.emit('room_refetch');
      res.send(new_result);
    }
  } catch (err) {
    console.error("Create room error:", err);
    new_result = {
      variant: "error",
      msg: "Server error",
      roomID: -1
    };
    res.status(500).send(new_result);
  }
});

app.post("/get_rooms", async function (req, res) {
  const roomInfoRepository = AppDataSource.getRepository("RoomInfo");
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
  
  try {
    const queryBuilder = roomInfoRepository.createQueryBuilder("room_info")
      .where("room_info.status < :status", { status: 3 })
      .andWhere(
        "(room_info.creator LIKE :search OR CAST(room_info.room_id AS CHAR) LIKE :search)",
        { search: `%${search_key}%` }
      )
      .orderBy("room_info.room_id", "DESC")
      .skip(pgNum * pgSize)
      .take(pgSize);
    
    const [result, total] = await queryBuilder.getManyAndCount();
    
    resValue.data = result;
    resValue.total = [{ total_cnt: total }];
    res.send(resValue);
  } catch (err) {
    console.error("Get rooms error:", err);
    resValue.data = [];
    resValue.total = [{ total_cnt: 0 }];
    res.status(500).send(resValue);
  }
});