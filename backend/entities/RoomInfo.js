const { EntitySchema } = require("typeorm");

const RoomInfo = new EntitySchema({
  name: "RoomInfo",
  tableName: "room_info",
  columns: {
    room_id: {
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
    members: {
      type: "int",
      default: 0,
    },
    status: {
      type: "int",
      default: 0,
      comment: "0=Waiting, 1=Full, 2=Playing, 3=Closed",
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
    {
      name: "idx_status",
      columns: ["status"],
    },
  ],
});

module.exports = RoomInfo;
