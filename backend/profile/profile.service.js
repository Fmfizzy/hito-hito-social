const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUserProfile(userId, data) {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        image: data.image
      }
    });
  } catch (error) {
    console.error('Profile service error:', error);
    throw error;
  }
}

module.exports = {
  updateUserProfile
};
