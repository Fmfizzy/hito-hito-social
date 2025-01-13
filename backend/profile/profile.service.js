const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateUserProfile(userId, data) {
  try {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        image: data.image
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        image: true
      }
    });
  } catch (error) {
    if (error.code === 'P2025' || error.message.includes('Record to update not found')) {
      const notFoundError = new Error('User not found');
      notFoundError.code = 'P2025';
      throw notFoundError;
    }
    throw error;
  }
}

module.exports = {
  updateUserProfile
};
