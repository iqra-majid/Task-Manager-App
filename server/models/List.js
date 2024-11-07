import mongoose from 'mongoose';

const { Schema } = mongoose;

const listSchema = new Schema(
  {
    title: { type: String, required: true },
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true }, // Reference to Board
    cards: [{ type: Schema.Types.ObjectId, ref: "Card" }], 
  },
  { timestamps: true }
);

const List = mongoose.models.List || mongoose.model("List", listSchema);

export default List;
