const { EntitySchema } = require("typeorm");

const GameLog = new EntitySchema({
  name: "GameLog",
  tableName: "game_logs",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    room_id: {
      type: "int",
    },
    username: {
      type: "varchar",
      length: 255,
    },
    bonus: {
      type: "int",
      nullable: true,
    },
    create_at: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },
  indices: [
    {
      name: "idx_room_id",
      columns: ["room_id"],
    },
    {
      name: "idx_username",
      columns: ["username"],
    },
  ],
});

module.exports = GameLog;
