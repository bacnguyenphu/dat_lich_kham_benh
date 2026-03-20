import db from "../models/index";

const createComment = async (data) => {
  try {
    if (!data?.content) {
      return {
        err: 1,
        message: "Content is required!",
      };
    }

    if (!data?.userId) {
      return {
        err: 2,
        message: "User ID is required!",
      };
    }

    if (!data?.appointmentId) {
      return {
        err: 3,
        message: "Appointment ID is required!",
      };
    }

    if (!data?.targetId) {
      return {
        err: 4,
        message: "Target ID is required!",
      };
    }

    if (!data?.targetType) {
      return {
        err: 5,
        message: "Target type is required!",
      };
    }

    const comment = await db.Comment.create({
      content: data.content,
      userId: data.userId,
      appointmentId: data.appointmentId,
      targetId: data.targetId,
      targetType: data.targetType,
    });

    return {
      err: 0,
      message: "Comment created successfully!",
      data: comment,
    };
  } catch (error) {
    console.log("Lỗi ở createComment:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const updateComment = async (data) => {
  try {
    if (!data?.id) {
      return {
        err: 1,
        message: "Comment ID is required!",
      };
    }

    if (!data?.content) {
      return {
        err: 2,
        message: "Content is required!",
      };
    }

    const comment = await db.Comment.findOne({
      where: { id: data.id },
    });

    if (!comment) {
      return {
        err: 3,
        message: "Comment not found!",
      };
    }

    await db.Comment.update(
      {
        content: data.content,
      },
      {
        where: { id: data.id },
      },
    );

    const updatedComment = await db.Comment.findOne({
      where: { id: data.id },
    });

    return {
      err: 0,
      message: "Comment updated successfully!",
      data: updatedComment,
    };
  } catch (error) {
    console.log("Lỗi ở updateComment:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getCommentsByTarget = async (targetId, targetType) => {
  try {
    if (!targetId || !targetType) {
      return {
        err: 1,
        message: "targetId and targetType are required!",
      };
    }

    const comments = await db.Comment.findAll({
      where: { targetId, targetType },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: db.Appointment,
          as: "Appointment",
          attributes: ["appointment_date"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      message: "Get comments success!",
      data: comments,
    };
  } catch (error) {
    console.log("Lỗi ở getCommentsByTarget:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const getCommentsByAppointmentId = async (appointmentId) => {
  try {
    if (!appointmentId) {
      return {
        err: 1,
        message: "Appointment ID is required!",
      };
    }

    const comments = await db.Comment.findOne({
      where: { appointmentId },
      order: [["createdAt", "DESC"]],
    });

    return {
      err: 0,
      message: "Get comments success!",
      data: comments,
    };
  } catch (error) {
    console.log("Lỗi ở getCommentsByAppointmentId:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

const deleteComment = async (commentId) => {
  try {
    if (!commentId) {
      return {
        err: 1,
        message: "Comment ID is required!",
      };
    }

    const comment = await db.Comment.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      return {
        err: 2,
        message: "Comment not found!",
      };
    }

    await db.Comment.destroy({
      where: { id: commentId },
    });

    return {
      err: 0,
      message: "Comment deleted successfully!",
    };
  } catch (error) {
    console.log("Lỗi ở deleteComment:", error);
    return {
      err: -999,
      message: `Error server: ${error}`,
    };
  }
};

export {
  createComment,
  getCommentsByTarget,
  getCommentsByAppointmentId,
  updateComment,
  deleteComment,
};
