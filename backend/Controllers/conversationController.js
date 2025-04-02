import Conversation from "../models/ConversationSchema.js";

export const getconversation = async (req, res) => {
    try {
        const { participant1, participant2, model1, model2 } = req.query;

        if (!participant1 || !participant2 || !model1 || !model2) {
            return res.status(400).json({ error: "Missing required query parameters" });
        }

        const conversation = await Conversation.findOne({
            participants: {
                $all: [
                    { $elemMatch: { participant: participant1, model: model1 } },
                    { $elemMatch: { participant: participant2, model: model2 } }
                ]
            }
        }).populate({
            path: "messages",
            options: { sort: { createdAt: 1 } } // Ensure messages are sorted by creation time
        });

        if (!conversation) {
            return res.status(404).json({ message: "No conversation found" });
        }

        res.json({ conversation });
    } catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ error: "Error fetching conversation" });
    }
};

// GET /conversations/doctor/:doctorId
export const getdoctorconversation = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;

        const conversations = await Conversation.find({
            'participants': {
                $elemMatch: {
                    participant: doctorId,
                    model: 'Doctor'
                }
            }
        }).populate({
            path: 'messages',
            options: { sort: { createdAt: -1 } }  // Sort messages newest first
        }).populate({
            path: 'participants.participant',
            model: 'User',
            select: 'name phone'  // Only get name & phone
        });

        if (!conversations || conversations.length === 0) {
            return res.status(404).json({ message: "No conversations found" });
        }

        res.status(200).json({ conversations });

    } catch (error) {
        console.error("Error fetching doctor conversations:", error);
        res.status(500).json({ error: "Error fetching conversations" });
    }
};
