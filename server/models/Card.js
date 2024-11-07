import mongoose from 'mongoose';

const { Schema } = mongoose;

const cardSchema = new Schema(
  {
    title: { type: String },
    description: String,
    stage: String,
    list: { type: Schema.Types.ObjectId, ref: "List", required: true }, // Reference to List
    dueDate: Date,
    assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    position: {
      type: Number,
     
    },
  },
  { timestamps: true }
);

const Card = mongoose.models.Card || mongoose.model("Card", cardSchema);

export default Card;
