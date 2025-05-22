import express from "express"
import {createNudge,fetchNudge} from "../Controllers/Nudge.js"

const router = express.Router();

router.post("/createNudge",createNudge)
router.post("/fetchNudge",fetchNudge)

export default router