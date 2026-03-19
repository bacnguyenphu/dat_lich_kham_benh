const express = require("express");
const router = express.Router();

import {
  handleCreateComment,
  handleGetCommentsByAppointmentId,
  handleGetCommentsByTarget,
} from "../controllers/commentController";
import {
  CREATE_COMMENT,
  GET_COMMENTS,
  GET_COMMENTS_BY_APPOINTMENT_ID,
} from "../utils/routeUrlApi";

router.post(CREATE_COMMENT, handleCreateComment);
router.get(GET_COMMENTS, handleGetCommentsByTarget);
router.get(GET_COMMENTS_BY_APPOINTMENT_ID, handleGetCommentsByAppointmentId);

export default router;
