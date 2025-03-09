
import React, { useRef } from 'react';
import { useUpload } from '@/context/UploadContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { VideoPreview } from '@/components/VideoPreview';
import { UploadCloud, FileVideo } from 'lucide-react';
import { toast } from 'sonner';

export function UploadForm() {
  const { 
    videoMetadata, 
    updateMetadata, 
    setFile, 
    videoPreviewUrl,
    isAuthenticated 
  } = useUpload();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if it's a video file
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }
    
    // Check file size (limit to 2GB for example)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast.error('File is too large. Please select a file under 2GB');
      return;
    }
    
    setFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if it's a video file
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }
    
    // Check file size (limit to 2GB for example)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      toast.error('File is too large. Please select a file under 2GB');
      return;
    }
    
    setFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (videoPreviewUrl) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <VideoPreview />
        
        <div className="space-y-4 bg-card rounded-xl p-5 shadow-sm border animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={videoMetadata.title}
              onChange={(e) => updateMetadata({ title: e.target.value })}
              placeholder="Enter video title"
              className="bg-background"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={videoMetadata.description}
              onChange={(e) => updateMetadata({ description: e.target.value })}
              placeholder="Enter video description"
              className="bg-background"
            />
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isPrivate" 
                checked={videoMetadata.isPrivate}
                onCheckedChange={(checked) => 
                  updateMetadata({ isPrivate: checked === true })
                }
              />
              <Label htmlFor="isPrivate" className="text-sm font-normal cursor-pointer">
                Set as private video
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="notForKids" 
                checked={videoMetadata.notForKids}
                onCheckedChange={(checked) => 
                  updateMetadata({ notForKids: checked === true })
                }
              />
              <Label htmlFor="notForKids" className="text-sm font-normal cursor-pointer">
                This video is not made for kids
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="acknowledgeAI" 
                checked={videoMetadata.acknowledgeAI}
                onCheckedChange={(checked) => 
                  updateMetadata({ acknowledgeAI: checked === true })
                }
              />
              <Label htmlFor="acknowledgeAI" className="text-sm font-normal cursor-pointer">
                This content contains AI-generated material
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="acknowledgeRights" 
                checked={videoMetadata.acknowledgeRights}
                onCheckedChange={(checked) => 
                  updateMetadata({ acknowledgeRights: checked === true })
                }
              />
              <Label htmlFor="acknowledgeRights" className="text-sm font-normal cursor-pointer">
                I have all necessary rights to upload this content
              </Label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="border-2 border-dashed border-muted rounded-xl p-10 text-center cursor-pointer transition-all hover:border-muted-foreground/50 hover:bg-accent/50"
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="sr-only"
        />
        
        <div className="mx-auto w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
          <UploadCloud className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <h3 className="text-lg font-medium mb-2">Upload Your Video</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Drag and drop your MP4 file here, or click to browse
        </p>
        
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            <FileVideo className="h-4 w-4" />
            <span>Select video</span>
          </Button>
        </div>
        
        {!isAuthenticated && (
          <p className="text-xs text-muted-foreground mt-6">
            Remember to connect your YouTube account before uploading
          </p>
        )}
      </div>
    </div>
  );
}
