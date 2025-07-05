import express from 'express'
import {create,fetchCommunities,getAllMembers,joinCommunity} from "../Controllers/Community.js"

const router = express.Router();

router.post('/create',create)
router.post('/getcommunities',fetchCommunities)
router.post('/getmember',getAllMembers)
router.post('/join',joinCommunity)
export default router;