import { Server as SocketIOServer } from "socket.io";
import { RoomData, RoomUser, SocketJoinParams, SocketExitParams, SocketStartGameParams, SocketShutCardsParams, SocketPassCardsParams } from "../types";
import { RandomCardsGenerator } from "../utils/randomCardsGenerator";
import { OutputRestCards } from "../utils/outputRestCards";
import { OutputSortedCardArray } from "../utils/outputSortedCardArray";
import { ScoreCalculator } from "../utils/scoreCalculator";
import { RoomInfoService } from "../services/RoomInfoService";
import { PersonInfoService } from "../services/PersonInfoService";
import { GameLogService } from "../services/GameLogService";
import {
  INITIAL_HANDCARDS_COUNT,
  TOTAL_CARDS_COUNT,
  AUTOMATIC_PASS_TIME,
  SHOW_RESULT_TIME,
} from "../constants/variables";
import { T } from "../constants/texts";

export class GameSocketHandler {
  private io: SocketIOServer;
  private data: { [roomId: number]: RoomData } = {};
  private roomInfoService: RoomInfoService;
  private personInfoService: PersonInfoService;
  private gameLogService: GameLogService;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.roomInfoService = new RoomInfoService();
    this.personInfoService = new PersonInfoService();
    this.gameLogService = new GameLogService();
    this.setupSocketHandlers();
  }

  private setupSocketHandlers(): void {
    this.io.on("connection", (socket) => {
      socket.on("join", (param: SocketJoinParams) => this.handleJoin(socket, param));
      socket.on("disconnect", () => this.handleDisconnect(socket));
      socket.on("exit", (param: SocketExitParams) => this.handleExit(socket, param));
      socket.on("startgame", (param: SocketStartGameParams) => this.handleStartGame(socket, param));
      socket.on("shutcards", (param: SocketShutCardsParams) => this.handleShutCards(socket, param));
      socket.on("passcards", (param: SocketPassCardsParams) => this.handlePassCards(socket, param));
    });
  }

  private handleJoin(socket: any, param: SocketJoinParams): void {
    const { room, user } = param;
    const { roomId, bonus, fee, size } = room;
    const { username, avatarUrl, bounty } = user;

    socket.user = username;
    socket.roomId = roomId;

    if (!this.data[roomId]) {
      this.data[roomId] = {
        userArray: [],
        havingCards: Array.from(Array(size), () => []),
        droppingCards: Array.from(Array(size), () => []),
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
        effectKind: "",
        effectOpen: false,
      };
    }

    if (!this.data[roomId].fee) this.data[roomId].fee = fee;
    if (!this.data[roomId].bonus) this.data[roomId].bonus = bonus;
    if (!this.data[roomId].size) this.data[roomId].size = size;

    if (!this.data[roomId].isStart) {
      if (this.data[roomId].userArray.length < this.data[roomId].size!) {
        if (this.data[roomId].userArray.findIndex((user) => user.username === socket.user) < 0) {
          if (this.data[roomId].host === username) {
            this.data[roomId].userArray.unshift({
              username,
              bounty,
              exitreq: false,
              src: avatarUrl,
            });
          } else {
            this.data[roomId].userArray.push({
              username,
              bounty,
              exitreq: false,
              src: avatarUrl,
            });
          }
        }
        if (!this.data[roomId].host) {
          this.data[roomId].host = username;
        }
        this.io.sockets.emit("update", {
          roomId,
          roomData: { ...this.data[roomId], counterIndex: null },
        });
        this.updateRoomStatus(roomId, 0).catch((err) =>
          console.error("Error updating room status:", err)
        );
      } else {
        socket.emit("full", {
          msg: T.ROOM_FULL_MSG,
          variant: "error",
        });
      }
    } else {
      socket.emit("update", {
        roomId,
        roomData: { ...this.data[roomId], counterIndex: null },
      });
    }
  }

  private handleDisconnect(socket: any): void {
    const roomId = socket.roomId;
    if (!roomId || !this.data[roomId]) {
      return;
    }
    const index = this.data[roomId].userArray.findIndex((user) => user.username === socket.user);
    if (index === -1) {
      return;
    }
    if (!this.data[roomId].isStart) {
      this.data[roomId].userArray.splice(index, 1);
      this.updateRoomStatus(roomId, 1).catch((err) =>
        console.error("Error updating room status:", err)
      );
      this.io.sockets.emit("update", {
        roomId,
        roomData: { ...this.data[roomId], counterIndex: null },
      });
    } else {
      this.data[roomId].userArray[index].exitreq = true;
      this.io.sockets.emit("update", {
        roomId,
        roomData: { ...this.data[roomId], counterIndex: null },
      });
    }
  }

  private handleExit(socket: any, param: SocketExitParams): void {
    const { roomId } = param;
    const index = this.data[roomId].userArray.findIndex((user) => user.username === socket.user);
    if (roomId && !this.data[roomId].isStart) {
      if (index > 0) {
        this.data[roomId].userArray.splice(index, 1);
        this.io.sockets.emit("update", {
          roomId,
          roomData: { ...this.data[roomId], counterIndex: null },
        });
        socket.emit("exit", { roomId, host: false });
        socket.roomId = 0;
        this.updateRoomStatus(roomId, 1).catch((err) =>
          console.error("Error updating room status:", err)
        );
      } else if (index === 0) {
        delete this.data[roomId];
        this.io.sockets.emit("exit", { roomId, host: true });
        this.updateRoomStatus(roomId, 4).catch((err) =>
          console.error("Error updating room status:", err)
        );
      }
    } else if (roomId && this.data[roomId].isStart) {
      if (index > -1) {
        this.data[roomId].userArray[index].exitreq = !this.data[roomId].userArray[index].exitreq;
        this.io.sockets.emit("update", {
          roomId,
          roomData: { ...this.data[roomId], counterIndex: null },
        });
      }
    }
  }

  private handleStartGame(socket: any, param: SocketStartGameParams): void {
    const { roomId } = param;
    const randomcards = RandomCardsGenerator(
      this.data[roomId].size!,
      INITIAL_HANDCARDS_COUNT,
      TOTAL_CARDS_COUNT
    );
    this.data[roomId].havingCards = Array.from(Array(this.data[roomId].size!), () => []);
    this.data[roomId].havingCards.forEach((item, index) => {
      item.push(...randomcards.players[index]);
    });
    this.data[roomId].restingCards = randomcards.rest_cards;
    this.data[roomId].droppingCards = Array.from(Array(this.data[roomId].size!), () => []);
    this.data[roomId].isStart = true;
    this.data[roomId].order = this.data[roomId].prevOrder;
    this.data[roomId].restCardCnt = TOTAL_CARDS_COUNT - this.data[roomId].size! * INITIAL_HANDCARDS_COUNT;
    this.data[roomId].isFinish = false;

    this.resetRoomCounterTimer(roomId);

    this.io.sockets.emit("update", {
      roomId,
      roomData: { ...this.data[roomId], counterIndex: null },
    });
    this.updateRoomStatus(roomId, 2).catch((err) =>
      console.error("Error updating room status:", err)
    );
  }

  private handleShutCards(socket: any, param: SocketShutCardsParams): void {
    const { choosedCard, roomId, double, effectkind, effectOpen } = param;
    this.data[roomId].prevOrder = this.data[roomId].order;
    this.data[roomId].double = double;
    this.data[roomId].effectKind = effectkind;
    this.data[roomId].effectOpen = effectOpen;

    this.resetRoomCounterTimer(roomId);

    OutputRestCards(this.data[roomId].havingCards[this.data[roomId].order], choosedCard);
    this.data[roomId].droppingCards.splice(this.data[roomId].order, 1, []);
    choosedCard.forEach((item) => {
      this.data[roomId].droppingCards[this.data[roomId].order].push(item);
    });

    if (this.data[roomId].havingCards[this.data[roomId].order].length === 0) {
      this.data[roomId].isFinish = true;
      this.resetRoomCounterTimer(roomId);
      const markArray = ScoreCalculator(
        this.data[roomId].bonus! * this.data[roomId].double,
        this.data[roomId].havingCards,
        this.data[roomId].userArray
      );
      markArray.forEach((item, index) => {
        this.data[roomId].userArray[index].bounty += item;
      });
      this.data[roomId].havingCards.forEach((item, index) => {
        if (item.length !== 0) this.data[roomId].droppingCards[index] = item;
      });
      this.updateUsersBounty(this.data[roomId].userArray).catch((err) =>
        console.error("Error updating bounty:", err)
      );
      this.createRoomLog(roomId, this.data[roomId].userArray, markArray).catch((err) =>
        console.error("Error creating room log:", err)
      );
      setTimeout(() => this.resetUserArray(roomId), SHOW_RESULT_TIME * 1000);
    } else {
      this.data[roomId].order = (this.data[roomId].order + 1) % this.data[roomId].size!;
    }

    this.data[roomId].cycleCnt = 1;
    this.io.sockets.emit("update", {
      roomId,
      roomData: { ...this.data[roomId], counterIndex: null },
    });
  }

  private handlePassCards(socket: any, param: SocketPassCardsParams): void {
    const { roomId } = param;
    this.turningOrder(roomId);
    this.io.sockets.emit("update", {
      roomId,
      roomData: { ...this.data[roomId], counterIndex: null },
    });
  }

  private increasingCounterCnt(roomId: number): void {
    this.data[roomId].counterCnt += 1;
    if (this.data[roomId].counterCnt === AUTOMATIC_PASS_TIME + 1) {
      this.turningOrder(roomId);
    }
    this.io.sockets.emit("update", {
      roomId,
      roomData: { ...this.data[roomId], counterIndex: null },
    });
  }

  private resetRoomCounterTimer(roomId: number): void {
    if (this.data[roomId].counterIndex) {
      clearInterval(this.data[roomId].counterIndex);
    }
    this.data[roomId].counterIndex = null;
    this.data[roomId].counterCnt = 0;
    if (this.data[roomId].isStart && !this.data[roomId].isFinish) {
      this.data[roomId].counterIndex = setInterval(
        () => this.increasingCounterCnt(roomId),
        1000
      ) as any;
    }
  }

  private turningOrder(roomId: number): void {
    this.resetRoomCounterTimer(roomId);
    if (this.data[roomId].order === this.data[roomId].prevOrder) {
      this.data[roomId].order = (this.data[roomId].order + 1) % this.data[roomId].size!;
      this.data[roomId].prevOrder = this.data[roomId].order;
    } else {
      this.data[roomId].order = (this.data[roomId].order + 1) % this.data[roomId].size!;
    }
    if (this.data[roomId].cycleCnt === this.data[roomId].size! - 1) {
      for (let i = 0; i < this.data[roomId].size!; i++) {
        if (this.data[roomId].restCardCnt - i > 0)
          this.data[roomId].havingCards[i].push(
            this.data[roomId].restingCards[this.data[roomId].restCardCnt - i - 1]
          );
        OutputSortedCardArray(this.data[roomId].havingCards[i]);
      }
      this.data[roomId].restCardCnt = this.data[roomId].restCardCnt - this.data[roomId].size!;
      this.data[roomId].droppingCards = Array.from(Array(this.data[roomId].size!), () => []);
    }
    this.data[roomId].cycleCnt = (this.data[roomId].cycleCnt + 1) % this.data[roomId].size!;

    this.io.sockets.emit("update", {
      roomId,
      roomData: { ...this.data[roomId], counterIndex: null },
      passBanner: true,
    });
  }

  private resetUserArray(roomId: number): void {
    this.data[roomId].isStart = false;
    this.data[roomId].havingCards = Array.from(Array(this.data[roomId].size!), () => []);
    this.data[roomId].droppingCards = Array.from(Array(this.data[roomId].size!), () => []);
    this.data[roomId].double = 1;

    if (
      this.data[roomId].userArray[0].bounty < this.data[roomId].fee! ||
      this.data[roomId].userArray[0].exitreq
    ) {
      delete this.data[roomId];
      this.io.sockets.emit("exit", { roomId, host: true });
      this.updateRoomStatus(roomId, 4).catch((err) =>
        console.error("Error updating room status:", err)
      );
      return;
    }

    this.data[roomId].userArray = this.data[roomId].userArray.filter((item) => {
      if (item.bounty < this.data[roomId].fee! || item.exitreq) {
        return false;
      }
      return true;
    });
    this.updateRoomStatus(roomId, 5, this.data[roomId].userArray.length).catch((err) =>
      console.error("Error updating room status:", err)
    );
    this.io.sockets.emit("update", {
      roomId,
      roomData: { ...this.data[roomId], counterIndex: null },
    });
  }

  private async createRoomLog(roomId: number, users: RoomUser[], bonuses: number[]): Promise<void> {
    const create_at = new Date().toISOString();
    const logs = users.map((user, index) => ({
      room_id: roomId,
      username: user.username,
      bonus: bonuses[index],
      create_at: create_at,
    }));
    await this.gameLogService.createMultiple(logs);
  }

  private async updateRoomStatus(roomId: number, status: number, newMembers: number = 0): Promise<void> {
    // Status: 0 => One Entry
    // Status: 1 => One Exit
    // Status: 2 => Full to Playing
    // Status: 3 => Entry to Playing
    // Status: 4 => Close
    // Status: 5 => Members Update
    try {
      const room = await this.roomInfoService.findById(roomId);
      if (!room) return;

      const members = room.members;
      const size = room.size!;
      const updateData: Partial<typeof room> = {};

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

      await this.roomInfoService.update(roomId, updateData);
      this.io.sockets.emit("room_refetch");
    } catch (err) {
      console.error("Error updating room status:", err);
    }
  }

  private async updateUsersBounty(users: RoomUser[]): Promise<void> {
    for (const user of users) {
      try {
        await this.personInfoService.updateBounty(user.username, user.bounty);
      } catch (err) {
        console.error("Server Error updating bounty:", err);
      }
    }
  }
}

