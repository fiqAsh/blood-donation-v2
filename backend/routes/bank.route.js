import express from "express";

import {
  authenticateAdmin,
  authenticateUser,
} from "../utils/auth.middleware.js";
import {
  createBankRequest,
  getAllBankData,
  getAllBankRequests,
  updateBankDetails,
  processBankrequest,
} from "../controllers/bank.controller.js";

const router = express.Router();

router.post("/createbankrequest", authenticateUser, createBankRequest);
router.get("/getAllBankData", authenticateUser, getAllBankData);
router.get("/getAllBankRequests", authenticateAdmin, getAllBankRequests);
router.patch(
  "/updateBankDetails/:bankid",
  authenticateAdmin,
  updateBankDetails
);
router.patch(
  "/processBankrequest/:requestid",
  authenticateAdmin,
  processBankrequest
);

export default router;
