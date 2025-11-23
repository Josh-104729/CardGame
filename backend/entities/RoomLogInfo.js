const { EntitySchema } = require("typeorm");

const RoomLogInfo = new EntitySchema({
  name: "RoomLogInfo",
  tableName: "room_log_info",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    creator: {
      type: "varchar",
      length: 255,
    },
    bonus: {
      type: "int",
      nullable: true,
    },
    fee: {
      type: "int",
      nullable: true,
    },
    size: {
      type: "int",
      nullable: true,
    },
    status: {
      type: "int",
      nullable: true,
    },
    members: {
      type: "int",
      nullable: true,
    },
    created_at: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    updated_at: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
  },
  indices: [
    {
      name: "idx_creator",
      columns: ["creator"],
    },
  ],
});

module.exports = RoomLogInfo;
