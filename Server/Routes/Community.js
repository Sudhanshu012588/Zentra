import express from 'express'
import {create,fetchCommunities,getAllMembers,joinCommunity,searchcommunity,RemoveMember,makeAdmin} from "../Controllers/Community.js"

const router = express.Router();

router.post('/create',create)
router.post('/getcommunities',fetchCommunities)
router.post('/getmember',getAllMembers)
router.post('/search',searchcommunity)
router.post('/join',joinCommunity)
router.get('/remove',RemoveMember)
router.get('/makeAdmin',makeAdmin)
export default router;