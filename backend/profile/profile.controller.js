const profileService = require('./profile.service');

async function updateProfile(req, res) {
  try {
    const { userId } = req.params;
    const { fullName, image } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!fullName) {
      return res.status(400).json({ error: 'Full name is required' });
    }

    const updatedUser = await profileService.updateUserProfile(userId, { 
      fullName, 
      image: image || null 
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
}

module.exports = {
  updateProfile
};
