const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendComplaintConfirmation, sendStatusUpdateEmail } = require('../services/emailService');
const { emitComplaintCreated, emitComplaintUpdated } = require('../services/socketService');
const { invalidateCache } = require('../middleware/cache');

const createComplaint = async (req, res) => {
  const { title, description, category, priority } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }

  const complaint = await Complaint.create({
    title,
    description,
    category: category || 'other',
    priority: priority || 'medium',
    userId: req.user._id,
    statusHistory: [{ status: 'pending', changedBy: req.user._id }],
  });

  const populatedComplaint = await complaint.populate('userId', 'name email');

  // Emit real-time event to admin room
  emitComplaintCreated(populatedComplaint);

  // Invalidate complaint cache
  invalidateCache('complaints');

  // Send confirmation email (non-blocking)
  sendComplaintConfirmation({
    to: req.user.email,
    name: req.user.name,
    complaintTitle: title,
    complaintId: complaint._id.toString().slice(-8).toUpperCase(),
  });

  res.status(201).json({ success: true, complaint: populatedComplaint });
};

const getComplaints = async (req, res) => {
  const { status, priority, category, page = 1, limit = 10 } = req.query;

  const filter = {};

  // Regular users only see their own complaints
  if (req.user.role !== 'admin') {
    filter.userId = req.user._id;
  }

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Complaint.countDocuments(filter);
  const complaints = await Complaint.find(filter)
    .populate('userId', 'name email')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    complaints,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
};

const getComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('assignedTo', 'name email')
    .populate('statusHistory.changedBy', 'name');

  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  // Non-admin can only view their own
  if (req.user.role !== 'admin' && complaint.userId._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  res.json({ success: true, complaint });
};

const updateComplaint = async (req, res) => {
  const { status, resolution, assignedTo, note } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  const previousStatus = complaint.status;

  if (status) complaint.status = status;
  if (resolution !== undefined) complaint.resolution = resolution;
  if (assignedTo !== undefined) complaint.assignedTo = assignedTo;

  if (status && status !== previousStatus) {
    complaint.statusHistory.push({
      status,
      changedBy: req.user._id,
      note: note || '',
    });
  }

  await complaint.save();
  const populatedComplaint = await complaint.populate([
    { path: 'userId', select: 'name email' },
    { path: 'assignedTo', select: 'name email' },
  ]);

  // Real-time emit
  emitComplaintUpdated(populatedComplaint);

  // Invalidate cache
  invalidateCache('complaints');

  // Email notification if status changed
  if (status && status !== previousStatus) {
    const user = await User.findById(complaint.userId);
    if (user) {
      sendStatusUpdateEmail({
        to: user.email,
        name: user.name,
        complaintTitle: complaint.title,
        newStatus: status,
      });
    }
  }

  res.json({ success: true, complaint: populatedComplaint });
};

const deleteComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    return res.status(404).json({ success: false, message: 'Complaint not found.' });
  }

  await complaint.deleteOne();
  invalidateCache('complaints');

  res.json({ success: true, message: 'Complaint deleted.' });
};

const getComplaintStats = async (req, res) => {
  const stats = await Complaint.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const totalComplaints = await Complaint.countDocuments();
  const thisMonth = await Complaint.countDocuments({
    createdAt: { $gte: new Date(new Date().setDate(1)) },
  });
  const resolved = await Complaint.countDocuments({ status: 'resolved' });

  res.json({
    success: true,
    stats: {
      byStatus: stats,
      total: totalComplaints,
      thisMonth,
      resolved,
      resolutionRate: totalComplaints > 0 ? Math.round((resolved / totalComplaints) * 100) : 0,
    },
  });
};

module.exports = { createComplaint, getComplaints, getComplaint, updateComplaint, deleteComplaint, getComplaintStats };
