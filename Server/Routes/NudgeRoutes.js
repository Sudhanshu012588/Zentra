import express from "express"
import {createNudge,fetchNudge,deleteNudge,like,reply,getallnudges} from "../Controllers/Nudge.js"

const router = express.Router();

router.post("/createNudge",createNudge)
router.post("/fetchNudge",fetchNudge)
router.post("/delete",deleteNudge)
router.post("/like",like),
router.post("/getallnudges",getallnudges)
router.post("/reply",reply)
export default router