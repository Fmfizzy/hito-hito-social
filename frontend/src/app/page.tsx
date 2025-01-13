'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth/context';

interface Post {
  id: string;
  imageUrl: string;
  author: {
    name: string;
    image: string;
  };
  likes: {
    user: {
      name: string;
      image: string;
    }
  }[];
  createdAt: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) return `${weeks}w`;
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  if (minutes > 0) return `${minutes}m`;
  return 'now';
}

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="bg-zinc-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-[250px_1fr_250px] gap-6">
        {/* Left sidebar with logo */}
        <div className="sticky top-0 h-screen pt-10 flex items-start justify-center">
          <div className="text-3xl font-bold">HitoHito</div>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center pt-10">
          <h1 className="text-3xl font-bold mb-5">Feed</h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-gray-600">Loading posts...</div>
          ) : (
            <div className="space-y-6 w-full">
              {posts.length === 0 ? (
                <div className="text-gray-600 text-center">No posts available</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-[500px] overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <button className="hover:text-red-500">
                          ❤️ {post.likes.length}
                        </button>
                        <span className="font-semibold">{post.author.name}</span>
                        <span className="text-gray-500 text-sm">
                          {formatTimeAgo(post.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
        <div className="sticky top-0 h-screen pt-10 flex items-start">
          <div className="w-full flex flex-col items-center gap-3">
            <img
              src={user?.image || defaultAvatar}
              alt={user?.name || 'User'}
              className="w-16 h-16 rounded-full"
            />
            <div className="text-center">
              <div className="font-semibold text-lg">{user?.name}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}