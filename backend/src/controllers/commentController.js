import { createComment, getCommentsByTarget } from "../services/commentService";

const handleCreateComment = async (req, res) => {
  try {
    const content = req.body?.content;
    const appointmentId = req.body?.appointmentId;
    const targetId = req.body?.targetId;
    const targetType = req.body?.targetType;

    // Prefer userId from token (set by checkPermissions) to avoid spoofing
    const userId = req.user?.id || req.body?.userId;

    const message = await createComment({
      content,
      appointmentId,
      targetId,
      targetType,
      userId,
    });
    return res.status(200).json(message);
  } catch (error) {
    console.log("Lỗi ở handleCreateComment: ", error);
    return res
      .status(500)
      .json({ err: -999, message: `Error server: ${error}` });
  }
};

const handleGetCommentsByTarget = async (req, res) => {
  try {
    const targetId = req.query.targetId;
    const targetType = req.query.targetType;

    const message = await getCommentsByTarget(targetId, targetType);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Lỗi ở handleGetCommentsByTarget: ", error);
    return res
      .status(500)
      .json({ err: -999, message: `Error server: ${error}` });
  }
};

export { handleCreateComment, handleGetCommentsByTarget };
