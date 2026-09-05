import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";


export const getAllContacts = async( req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers= await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);

    } catch(error){
        res.status(500).json(error.message);

    }

}

export const getMessagesByUserId = async(req,res)=>{
    try {
        const myId = req.user._id;
        const{id:userToChatId} = req.params;
        
        const meesages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId},
            ],
        })
        res.status(200).json(meesages);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

export const sendMessage = async(req,res)=>{
    try{
        const {text,image}= req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId:senderId,
            receiverId:receiverId,
            text:text,
            image:imageUrl
        })

        await newMessage.save();

        // todo:send message in real-time if user is online using socket.io
        res.status(201).json(newMessage);
    }catch(error){
        res.status(500).json(error.message);
    }
}   

export const getChatPartners = async (req,res)=>{
    try {
        const loggedInUserId = req.user._id;
        // find all the messages where the logged-in user is either a sender or receiver
        const messages = await Message.find({
            $or:[{senderId:loggedInUserId},
            {receiverId:loggedInUserId}]
        })
        const chatPartnerIds = [ ...new Set ( messages.map((msg)=> msg.senderId.toString()== loggedInUserId.toString() ?msg.receiverId.toString():msg.senderId.toString()))];

        const chatPartners = await User.find({_id:{$in:chatPartnerIds}}).select("-password");
        res.status(200).json(chatPartners);
        
    } catch (error) {
      res.status(500).json(error.message);  
    }
}