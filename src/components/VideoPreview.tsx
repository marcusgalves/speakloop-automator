
import React from 'react';
import { useUpload } from '@/context/UploadContext';
import { Progress } from '@/components/ui/progress';
import { X, Upload, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function VideoPreview() {
  const { 
    videoPreviewUrl, 
    videoMetadata, 
    isUploading, 
    uploadProgress,
    uploadVideo,
    resetUpload,
    transcribeUploadedVideo,
    isTranscribing,
    isGeneratingFlashcards
  } = useUpload();

  if (!videoPreviewUrl) return null;

  const isProcessing = isTranscribing || isGeneratingFlashcards;

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
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={transcribeUploadedVideo}
            disabled={isProcessing || isUploading}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <FileText className="h-3 w-3 mr-1" />
                Transcribe
              </>
            )}
          </Button>
          
          {isUploading ? (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              disabled
            >
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              Uploading...
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="text-xs"
              onClick={uploadVideo}
              disabled={isProcessing}
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload
            </Button>
          )}
        </div>
        
        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-1.5 bg-secondary" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Uploading...</span>
              <span className="text-xs font-medium">{uploadProgress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
