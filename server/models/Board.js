import mongoose from 'mongoose';

const { Schema } = mongoose;

const boardSchema = new Schema(
  {
    title: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    lists: [{ type: Schema.Types.ObjectId, ref: "List" }], // Array of list references
  },
  { timestamps: true }
);




const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);

export default Board;