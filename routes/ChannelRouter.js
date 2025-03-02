import express from "express";
import {
  blockChannel,
  createChannel,
  deleteChannel,
  getChannel,
  validateStreamKey,
  UnVerifyStream,
} from "../controllers/channelController.js";

const channelRouter = express.Router();

channelRouter.post("/:userId?", createChannel);
channelRouter.post("/stream/verify", validateStreamKey);
channelRouter.post("/stream/unverify", UnVerifyStream);
channelRouter.get("/:userId?", getChannel);
channelRouter.get("/delete/:channelId?/:userId?", deleteChannel);
channelRouter.post("/block-channel/:channelId?/:streamId?", blockChannel);

export default channelRouter;
