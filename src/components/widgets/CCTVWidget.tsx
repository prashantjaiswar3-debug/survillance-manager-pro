"use client";

import { useEffect, useRef, useState } from 'react';
import { Widget } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '../ui/skeleton';

export function CCTVWidget({ widget }: { widget: Widget }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        toast({
            variant: 'destructive',
            title: 'Unsupported Browser',
            description: 'Your browser does not support camera access.',
        });
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();
    
    // Clean up function to stop the stream.
    return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-black rounded-md overflow-hidden">
      {hasCameraPermission === null && (
        <Skeleton className="w-full h-full" />
      )}

      {hasCameraPermission === false && (
         <div className="p-4">
            <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access to use this feature.
                </AlertDescription>
            </Alert>
         </div>
      )}

      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline style={{ display: hasCameraPermission ? 'block' : 'none' }} />
    </div>
  );
}