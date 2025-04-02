import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        participant: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "participants.model",
        },
        model: {
          type: String,
          required: true,
          enum: ["User", "Doctor"],
        },
      },
    ],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
