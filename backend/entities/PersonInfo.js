const { EntitySchema } = require("typeorm");

const PersonInfo = new EntitySchema({
  name: "PersonInfo",
  tableName: "person_info",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    full_name: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    username: {
      type: "varchar",
      length: 255,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
    },
    bounty: {
      type: "int",
      default: 10000,
    },
    signtoken: {
      type: "varchar",
      length: 500,
      default: "------",
    },
    birthdate: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    gender: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    allowedbyadmin: {
      type: "int",
      default: 0,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    avatar_url: {
      type: "varchar",
      length: 500,
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
      name: "username",
      columns: ["username"],
      unique: true,
    },
    {
      name: "idx_signtoken",
      columns: ["signtoken"],
    },
  ],
});

module.exports = PersonInfo;
