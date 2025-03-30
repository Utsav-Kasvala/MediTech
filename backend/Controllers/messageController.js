import Message from "../models/Messages.js";

export const messageController = async (req, res) => {
    try {
        const { sender, receiver } = req.query;
    
        if (!sender || !receiver) {
          return res.status(400).json({ message: "Both IDs are required" });
        }
    
        const messages = await Message.find({
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        })
        .sort({ createdAt: 1 })
        .populate("sender", "_id name")
        .populate("receiver", "_id name");
    
        res.status(200).json(messages || []);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
      }
        
}