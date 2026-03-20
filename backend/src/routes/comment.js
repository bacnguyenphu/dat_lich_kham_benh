const express = require("express");
const router = express.Router();

import {
  handleCreateComment,
  handleDeleteComment,
  handleGetCommentsByAppointmentId,
  handleGetCommentsByTarget,
  handleUpdateComment,
} from "../controllers/commentController";
import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  GET_COMMENTS,
  GET_COMMENTS_BY_APPOINTMENT_ID,
  DELETE_COMMENT,
} from "../utils/routeUrlApi";

router.post(CREATE_COMMENT, handleCreateComment);
router.put(UPDATE_COMMENT, handleUpdateComment);
router.get(GET_COMMENTS, handleGetCommentsByTarget);
router.get(GET_COMMENTS_BY_APPOINTMENT_ID, handleGetCommentsByAppointmentId);
router.delete(DELETE_COMMENT, handleDeleteComment);

export default router;
