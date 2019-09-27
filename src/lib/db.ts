import dotenv from "dotenv";
import { Sequelize, Model, DataTypes, BuildOptions } from "sequelize";

dotenv.config();

const {
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_LOG
} = process.env;

console.log({ DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT });

if (!DB_DATABASE || !DB_USERNAME) {
  throw new Error("DB_DATABASE or DB_USERNAME not defined");
}

function btree(field: string) {
  return { fields: [field], method: "BTREE" };
}

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT ? parseInt(DB_PORT) : undefined,
  dialect: "postgres",
  logging: DB_LOG ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// We need to declare an interface for our model that is basically what our class would be
export interface DefinitionAttributes extends Model {
  readonly version: string;
  readonly table: string;
  readonly key: string;
  readonly json: any;
}

// Need to declare the static model so `findOne` etc. use correct types.
export type DefinitionStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): DefinitionAttributes;
};

export const Definition = <DefinitionStatic>sequelize.define("Definition", {
  version: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  table: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  json: DataTypes.JSONB
});

export const ready = sequelize.sync();
