import mongoose from "mongoose";

const Schema=mongoose.Schema;

let userShema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "newUser",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref:"Post"
    },
  ],
});


export default mongoose.model("User",userShema);