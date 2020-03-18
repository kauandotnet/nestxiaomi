import * as mongoose from 'mongoose';

const date = new Date();

export const RoleSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  },
  status: {
    type: Number,
    default: 1
  },
  add_time: {
    type: Number,
    default: date.getTime()
  }
});