import db from "../models/index";
import { v4 as uuidv4 } from "uuid";
const { Op } = require("sequelize");

const getChatHistoryByCustomer = async (id_user, limit = 50, offset = 0) => {
  try {
    // 1. Kiểm tra đầu vào (id_user này nên được lấy từ Token xác thực ở Controller)
    if (!id_user) {
      return {
        err: 1,
        message: "Thiếu thông tin định danh người dùng (id_user)",
      };
    }

    // 2. Tìm phòng chat của user, nếu chưa có thì tạo mới (Dùng findOrCreate tránh Race Condition)
    const [room_chat, created] = await db.Chat_room.findOrCreate({
      where: {
        customer_id: id_user,
        status: {
          [Op.ne]: "CLOSE",
        },
      },
      defaults: {
        id: uuidv4(),
        customer_id: id_user,
        status: "WAITING",
      },
    });

    const roomChatIdToFetch = room_chat.id;

    // if (created && io) {
    //   const customerData = await db.User.findByPk(id_user, {
    //     attributes: ["id", "firstName", "lastName", "avatar"],
    //   });

    //   const newRoomData = {
    //     id: roomChatIdToFetch,
    //     customer_id: id_user,
    //     receptionist_id: null,
    //     status: "WAITING",
    //     last_message: null,
    //     customer: customerData,
    //   };
    //   io.emit("new_room_created", newRoomData);
    // }

    // 3. Lấy danh sách tin nhắn có phân trang
    const messages = await db.Message.findAll({
      where: { chat_room_id: roomChatIdToFetch },
      order: [["createdAt", "DESC"]], // Lấy tin nhắn mới nhất trước
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      raw: true,
    });

    // 4. Đảo ngược mảng để client hiển thị đúng thứ tự từ trên xuống dưới
    const sortedMessages = messages.reverse();

    return {
      err: 0,
      data: {
        id_chat_room: roomChatIdToFetch, // Trả về để client biết đang ở phòng nào
        messages: sortedMessages,
      },
    };
  } catch (error) {
    console.error("Lỗi ở getChatHistoryByCustomer: ", error);
    return {
      err: -999,
      message: "Lỗi hệ thống máy chủ, vui lòng thử lại sau.",
    };
  }
};

const getChatHistoryByReceptionist = async (
  id_room_chat,
  limit = 50,
  offset = 0,
) => {
  try {
    // 1. Lễ tân bắt buộc phải truyền id_room_chat
    if (!id_room_chat) {
      return {
        err: 1,
        message: "Thiếu thông tin phòng chat (id_room_chat)",
      };
    }

    // 2. Lấy danh sách tin nhắn có phân trang
    const messages = await db.Message.findAll({
      where: { chat_room_id: id_room_chat },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      raw: true,
    });

    const sortedMessages = messages.reverse();

    return {
      err: 0,
      data: {
        id_chat_room: id_room_chat,
        messages: sortedMessages,
      },
    };
  } catch (error) {
    console.error("Lỗi ở getChatHistoryByReceptionist: ", error);
    return {
      err: -999,
      message: "Lỗi hệ thống máy chủ, vui lòng thử lại sau.",
    };
  }
};

const saveMessage = async (data, io) => {
  try {
    const chat_room_id = data.chat_room_id || data.roomId || data["room-id"];
    const sender_id = data.sender_id || data.senderId || data["sender-id"];
    const sender_type =
      data.sender_type || data.senderType || data.senderRole || "CUSTOMER";
    const content = data.content || data.text || data.message;

    if (!sender_id || !content) {
      return {
        err: 1,
        message:
          "Thiếu thông tin gửi tin nhắn: sender_id và nội dung là bắt buộc.",
      };
    }

    let room_chat;
    if (chat_room_id) {
      room_chat = await db.Chat_room.findByPk(chat_room_id);
      if (!room_chat) {
        console.log("🔴 Không tìm thấy phòng chat với ID:", chat_room_id);
        return;
      }
      const roomData = room_chat.toJSON();
      if (roomData.last_message === null) {
        const customerData = await db.User.findByPk(sender_id, {
          attributes: ["id", "firstName", "lastName", "avatar"],
        });
        io.emit("new_room_created", {
          ...roomData,
          last_message: content,
          customer: customerData,
        });
      }
    } else {
      return {
        err: 2,
        message: "Thiếu thông tin phòng chat (chat_room_id).",
      };
    }

    const transaction = await db.sequelize.transaction();
    try {
      const savedMessage = await db.Message.create(
        {
          id: uuidv4(),
          chat_room_id: room_chat.id,
          sender_id,
          content,
          sender_type,
        },
        { transaction },
      );
      await room_chat.update(
        {
          last_message: content,
        },
        { transaction },
      );

      await transaction.commit();

      return {
        err: 0,
        data: {
          message: savedMessage,
          chat_room_id: room_chat.id,
        },
      };
    } catch (innerError) {
      await transaction.rollback();
      throw innerError;
    }
  } catch (error) {
    console.error("Lỗi ở saveMessage: ", error);
    return {
      err: -999,
      message: "Lỗi hệ thống máy chủ, không thể lưu tin nhắn.",
    };
  }
};

const getAllChatRooms = async () => {
  try {
    const chatRooms = await db.Chat_room.findAll({
      include: [
        {
          model: db.User,
          as: "customer",
          attributes: ["id", "lastName", "firstName"],
        },
        {
          model: db.User,
          as: "receptionist",
          attributes: ["id", "lastName", "firstName"],
        },
      ],
      order: [["updatedAt", "DESC"]],
      raw: true,
      nest: true,
    });

    return {
      err: 0,
      data: chatRooms,
    };
  } catch (error) {
    console.error("Lỗi ở getAllChatRooms: ", error);
    return {
      err: -999,
      message: "Lỗi hệ thống máy chủ, không thể lấy danh sách phòng chat.",
    };
  }
};

export {
  getChatHistoryByCustomer,
  saveMessage,
  getChatHistoryByReceptionist,
  getAllChatRooms,
};
