const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Add dummy users
  const user1 = await prisma.user.create({
    data: {
      username: 'johndoe',
      fullName: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 10),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    }
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'janesmith',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 10),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
    }
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'alicej',
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', 10),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
    }
  });

  const user4 = await prisma.user.create({
    data: {
      username: 'bobwilson',
      fullName: 'Bob Wilson',
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 10),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    }
  });

  // Add dummy posts
  const post1 = await prisma.post.create({
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1731640275202-28a40f7edd04?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      authorId: user1.id
    }
  });

  const post2 = await prisma.post.create({
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1728847031685-102957148475?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      authorId: user2.id
    }
  });

  const post3 = await prisma.post.create({
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1730818203797-897b2838105a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      authorId: user1.id
    }
  });

  // Add likes
  await prisma.like.createMany({
    data: [
      { userId: user2.id, postId: post1.id },
      { userId: user3.id, postId: post1.id },
      { userId: user4.id, postId: post1.id },
      { userId: user1.id, postId: post2.id },
      { userId: user3.id, postId: post2.id },
      { userId: user1.id, postId: post3.id },
      { userId: user2.id, postId: post3.id },
      { userId: user3.id, postId: post3.id },
      { userId: user4.id, postId: post3.id },
    ]
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
