import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export const RoleAccessSchema = new Schema({
  access_id: {
    type: Schema.Types.ObjectId
  },
  role_id: {
    type: Schema.Types.ObjectId
  }
});