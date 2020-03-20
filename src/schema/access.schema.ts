import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
const date = new Date();

export const AccessSchema = new Schema({
  module_name: {
    type: String
  },
  action_name: {
    type: String
  },
  type: {
    type: Number
  },
  url: {
    type: String
  },
  module_id: {
    type: Schema.Types.Mixed
  },
  sort: {
    type: Number,
    default: 100
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