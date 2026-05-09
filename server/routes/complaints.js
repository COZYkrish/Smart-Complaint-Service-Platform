const express = require('express');
const router = express.Router();
const {
  createComplaint, getComplaints, getComplaint,
  updateComplaint, deleteComplaint, getComplaintStats
} = require('../controllers/complaintController');
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

router.use(verifyToken);

router.post('/', createComplaint);
router.get('/', cacheMiddleware(60), getComplaints);
router.get('/stats', requireAdmin, getComplaintStats);
router.get('/:id', getComplaint);
router.patch('/:id', requireAdmin, updateComplaint);
router.delete('/:id', requireAdmin, deleteComplaint);

module.exports = router;
