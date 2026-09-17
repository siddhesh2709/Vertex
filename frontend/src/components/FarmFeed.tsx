import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Heart, MessageCircle, Upload, Loader2, MapPin, Send, AlertCircle } from 'lucide-react';
import api from '../services/api';

interface FarmFeedProps {
  user: any;
}

export function FarmFeed({ user }: FarmFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [postError, setPostError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/social/feed');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !selectedFile) return;

    // The post model requires caption text even when a photo is attached.
    if (selectedFile && !newPostContent.trim()) {
      setPostError('Please add a short caption for your photo before posting.');
      return;
    }

    setLoading(true);
    setPostError(null);
    const formData = new FormData();
    formData.append('content', newPostContent);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const response = await api.post('/social/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts([response.data, ...posts]);
      setNewPostContent('');
      setSelectedFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to create post:', error);
      setPostError('Could not publish your post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await api.post(`/social/posts/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? response.data : p));
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      const response = await api.post(`/social/posts/${postId}/comment`, { text });
      setPosts(posts.map(p => p._id === postId ? response.data : p));
      setCommentText(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Failed to comment:', error);
    }
  };

  const getInitials = (name: string) => {
    return (name || 'Farmer').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-900">FarmFeed 🌾</h1>
        <p className="text-green-700 mt-1">Connect with farmers, share your journey</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback className="bg-green-600 text-white">
                {getInitials(user?.name || user?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Share your farming experience..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-20 resize-none"
              />
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-64 rounded-lg" />
                  <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}>Remove</Button>
                </div>
              )}
              {postError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>{postError}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Add Photo
                </Button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <Button onClick={handleCreatePost} disabled={loading || (!newPostContent.trim() && !selectedFile)}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post._id}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={post.userPhoto} />
                  <AvatarFallback className="bg-green-600 text-white">
                    {getInitials(post.userName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                      {post.userLocation && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {post.userLocation}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatTimestamp(post.createdAt)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {post.content && <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>}
              {post.image && <img src={post.image} alt="Post" className="w-full rounded-lg max-h-96 object-cover" />}
              <div className="flex items-center gap-6 pt-2 border-t">
                <button onClick={() => handleLike(post._id)} className={`flex items-center gap-2 transition-colors ${post.likes.includes(user.firebaseUid) ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}>
                  <Heart className={`h-5 w-5 ${post.likes.includes(user.firebaseUid) ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                </button>
                <button onClick={() => setShowComments(showComments === post._id ? null : post._id)} className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                </button>
              </div>

              {showComments === post._id && (
                <div className="pt-4 border-t space-y-4">
                  <div className="space-y-3">
                    {post.comments?.map((comment: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-600 text-white text-xs">{getInitials(comment.userName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                            <span className="text-xs text-gray-500">{formatTimestamp(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[post._id] || ''}
                      onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <Button size="sm" onClick={() => handleComment(post._id)} disabled={!commentText[post._id]?.trim()}><Send className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="py-12 text-center text-gray-500">No posts yet. Share your journey!</div>
        )}
      </div>
    </div>
  );
}
