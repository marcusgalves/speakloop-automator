
import React from 'react';
import { Header } from '@/components/Header';
import { UploadForm } from '@/components/UploadForm';
import { UploadProvider } from '@/context/UploadContext';

const Index = () => {
  return (
    <UploadProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-block mb-3">
              <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                YouTube Automator
              </span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight mb-3 sm:text-4xl">
              Streamline Your English Practice Videos
            </h1>
            <p className="max-w-lg mx-auto text-muted-foreground">
              Upload your English practice videos to YouTube with pre-configured settings—no more repetitive tasks.
            </p>
          </div>
          
          <UploadForm />
          
          <div className="mt-20 text-center">
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Your videos are uploaded directly to YouTube. We don't store or process your video files on our servers.
            </p>
          </div>
        </main>
        
        <footer className="py-6 border-t">
          <div className="container max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-xs text-center text-muted-foreground">
              SpeakLoop Automator • Streamline your language learning journey
            </p>
          </div>
        </footer>
      </div>
    </UploadProvider>
  );
};

export default Index;
