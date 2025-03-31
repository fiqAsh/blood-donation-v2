import express from "express";
import {
  authenticateAdmin,
  authenticateUser,
} from "../utils/auth.middleware.js";
import {
  filterBanksByBloodGroup,
  filterDonors,
  filterPosts,
} from "../controllers/searchFilter.controller.js";

const router = express.Router();

router.get(
  "/filterBanksByBloodGroup",
  authenticateUser,
  filterBanksByBloodGroup
);
router.get("/filterDonors", authenticateUser, filterDonors);
router.get("/filterPosts", authenticateUser, filterPosts);

export default router;
