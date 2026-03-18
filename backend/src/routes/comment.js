const express = require("express");
const router = express.Router();

import {
  handleCreateComment,
  handleGetCommentsByTarget,
} from "../controllers/commentController";
import { CREATE_COMMENT, GET_COMMENTS } from "../utils/routeUrlApi";

router.post(CREATE_COMMENT, handleCreateComment);
router.get(GET_COMMENTS, handleGetCommentsByTarget);

export default router;
