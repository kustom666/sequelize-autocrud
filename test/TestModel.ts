import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from "sequelize";

export const sequelize = new Sequelize("sqlite::memory:");

export class TestModel extends Model {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
}

TestModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "users",
    sequelize, // passing the `sequelize` instance is required
  },
);
