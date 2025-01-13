'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth/context';
import ProfileEditor from './components/ProfileEditor';

interface Post {
  id: string;
  imageUrl: string;
  author: {
    name: string;
    image: string;
  };
  likes: {
    id: string;
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
  const { user, updateUser, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const defaultAvatar = "https://api.dicebear.com/9.x/lorelei/svg";

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

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/posts/${postId}/toggle-like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to toggle like');

      setPosts(posts.map(post => {
        if (post.id === postId) {
          const userLiked = post.likes.some(like => like.user.name === user.name);
          if (userLiked) {
            return {
              ...post,
              likes: post.likes.filter(like => like.user.name !== user.name)
            };
          } else {
            return {
              ...post,
              likes: [...post.likes, { 
                id: `temp-${Date.now()}`, 
                user: { 
                  name: user.name, 
                  image: user.image || defaultAvatar 
                } 
              }]
            };
          }
        }
        return post;
      }));
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update like status');
    }
  };

  const handleProfileUpdate = async (newName: string, newImageUrl: string) => {
    console.log('Updating profile:', newName, newImageUrl);
    console.log('User:', user);
    if (!user) return;
    
    try {
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          image: newImageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const { user: updatedUser } = await response.json();
      updateUser(updatedUser);
      console.log('Profile updated:', user.image);
      setIsProfileEditorOpen(false);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg 
      className={`w-6 h-6 transition-colors ${filled ? 'fill-red-500' : 'fill-none stroke-current'}`}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  const getUserImage = () => {
    if (!user) return defaultAvatar;
    if (user.image?.startsWith('http')) return user.image;
    return user.image ? `${API_URL}${user.image}` : defaultAvatar;
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
                        <button 
                          onClick={() => handleLike(post.id)}
                          className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        >
                          <HeartIcon filled={user ? post.likes.some(like => like.user.name === user.name) : false} />
                          <span>{post.likes.length}</span>
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
          <div 
            className="w-full flex flex-col items-center gap-3"
          >
            <div
              onClick={() => setIsProfileEditorOpen(true)}
              className="cursor-pointer flex flex-col items-center"
            >
              <img
                src={getUserImage()}
                alt={user?.name || 'User'}
                className="w-16 h-16 rounded-full hover:opacity-80 transition-opacity"
              />
              <div className="text-center">
                <div className="font-semibold text-lg hover:opacity-80 transition-opacity">
                  {user?.name}
                </div>
                <div className="text-gray-500">{user?.email}</div>
              </div>
            </div>
            {user && (
              <button
                onClick={logout}
                className="text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
      {user && (
        <ProfileEditor
          isOpen={isProfileEditorOpen}
          onClose={() => setIsProfileEditorOpen(false)}
          onSave={handleProfileUpdate}
          currentName={user.name}
          currentImage={user.image || defaultAvatar}
        />
      )}
    </main>
  );
}