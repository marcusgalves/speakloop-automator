
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface VideoMetadata {
  title: string;
  description: string;
  isPrivate: boolean;
  notForKids: boolean;
  acknowledgeAI: boolean;
  acknowledgeRights: boolean;
  file: File | null;
  thumbnailUrl: string | null;
}

interface UploadContextType {
  videoMetadata: VideoMetadata;
  isUploading: boolean;
  uploadProgress: number;
  isAuthenticated: boolean;
  videoPreviewUrl: string | null;
  updateMetadata: (updates: Partial<VideoMetadata>) => void;
  setFile: (file: File | null) => void;
  uploadVideo: () => Promise<void>;
  resetUpload: () => void;
  authenticate: () => void;
  logout: () => void;
}

const defaultMetadata: VideoMetadata = {
  title: '',
  description: '',
  isPrivate: true,
  notForKids: true,
  acknowledgeAI: true,
  acknowledgeRights: true,
  file: null,
  thumbnailUrl: null,
};

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function useUpload() {
  const context = useContext(UploadContext);
  if (context === undefined) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
}

export function UploadProvider({ children }: { children: ReactNode }) {
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>(defaultMetadata);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);

  const updateMetadata = (updates: Partial<VideoMetadata>) => {
    setVideoMetadata(prev => ({ ...prev, ...updates }));
  };

  const setFile = (file: File | null) => {
    if (file) {
      // Generate preview URL
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      
      // Get current date in MM/dd/yyyy format
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
      
      // Set default title with formatted date
      const defaultTitle = `English speaking training with Sesame Voice AI - ${formattedDate}`;
      
      updateMetadata({ 
        file,
        title: defaultTitle
      });
    } else {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      setVideoPreviewUrl(null);
      updateMetadata({ file: null });
    }
  };

  const uploadVideo = async () => {
    if (!videoMetadata.file) {
      toast.error('Please select a video file first');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please authenticate with YouTube first');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);

      // For now this is a mock - we'll implement the actual YouTube API integration later
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(interval);
      setUploadProgress(100);
      
      toast.success('Video uploaded successfully!');
      
      // Reset after successful upload
      setTimeout(() => {
        resetUpload();
      }, 2000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoMetadata(defaultMetadata);
    setVideoPreviewUrl(null);
    setUploadProgress(0);
  };

  const authenticate = () => {
    // Mock authentication for now
    toast.success('Successfully authenticated with YouTube');
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    toast.info('Logged out from YouTube');
  };

  return (
    <UploadContext.Provider
      value={{
        videoMetadata,
        isUploading,
        uploadProgress,
        isAuthenticated,
        videoPreviewUrl,
        updateMetadata,
        setFile,
        uploadVideo,
        resetUpload,
        authenticate,
        logout,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}
