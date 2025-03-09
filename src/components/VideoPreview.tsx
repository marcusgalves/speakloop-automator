
import React from 'react';
import { useUpload } from '@/context/UploadContext';
import { Progress } from '@/components/ui/progress';
import { X, Upload, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VideoPreview() {
  const { 
    videoPreviewUrl, 
    videoMetadata, 
    isUploading, 
    uploadProgress,
    uploadVideo,
    resetUpload
  } = useUpload();

  if (!videoPreviewUrl) return null;

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-xl overflow-hidden shadow-sm border animate-fade-up">
      <div className="relative">
        <video 
          src={videoPreviewUrl} 
          className="w-full h-48 object-cover" 
          controls 
        />
        
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all"
          onClick={resetUpload}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-sm mb-1 truncate">{videoMetadata.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Size: {(videoMetadata.file?.size || 0) / (1024 * 1024) < 1 
            ? `${Math.round((videoMetadata.file?.size || 0) / 1024)} KB` 
            : `${((videoMetadata.file?.size || 0) / (1024 * 1024)).toFixed(2)} MB`}
        </p>
        
        {isUploading ? (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-1.5 bg-secondary" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Uploading...</span>
              <span className="text-xs font-medium">{uploadProgress}%</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              disabled
            >
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Processing...
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full text-xs"
            onClick={uploadVideo}
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload to YouTube
          </Button>
        )}
      </div>
    </div>
  );
}
