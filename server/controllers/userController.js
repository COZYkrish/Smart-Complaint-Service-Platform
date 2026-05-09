const User = require('../models/User');

const getAllUsers = async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;
  const filter = {};
  if (role) filter.role = role;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({ success: true, users, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user });
};

const updateUser = async (req, res) => {
  const { name, role, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

  if (name) user.name = name;
  if (role && ['user', 'admin'].includes(role)) user.role = role;
  if (typeof isActive === 'boolean') user.isActive = isActive;

  await user.save();
  res.json({ success: true, user });
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  await user.deleteOne();
  res.json({ success: true, message: 'User deleted.' });
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
