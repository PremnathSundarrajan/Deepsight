import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { 
  Upload as UploadIcon, 
  Image as ImageIcon, 
  X, 
  Loader2,
  CheckCircle,
  AlertTriangle,
  Eye,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Detection, BoundingBox, Alert, AuthorizedAd } from '@/types';
import { api } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface UploadedFile extends File {
  id: string;
  preview: string;
  detection?: Detection;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

export default function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      ...file,
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'uploading' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process each file
    newFiles.forEach(processFile);
  }, []);

  const processFile = async (file: UploadedFile) => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      }

      // Set processing status
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'processing' } : f
      ));

      // Create a simulated detection
      const isAuthorized = Math.random() > 0.5;
      const status = isAuthorized ? 'Authorized' : 'Unauthorized';
      
      // For unauthorized, assign random risk level
      let priority: 'high' | 'medium' | 'low' = 'medium';
      if (!isAuthorized) {
        const rand = Math.random();
        priority = rand < 0.33 ? 'high' : rand < 0.66 ? 'medium' : 'low';
      }

      const detection: Detection = {
        id: `det_${Date.now()}`,
        image: file.preview,
        text: isAuthorized ? 'Authorized Advertisement' : 'Potential Unauthorized Advertisement',
        confidence: `${Math.floor(Math.random() * 20 + 75)}%`,
        status: isAuthorized ? 'Authorized' : 'Unauthorized',
        timestamp: new Date().toISOString(),
        boundingBoxes: [{
          id: `bb_${Date.now()}`,
          x: Math.floor(Math.random() * 100 + 50),
          y: Math.floor(Math.random() * 100 + 50),
          width: Math.floor(Math.random() * 200 + 200),
          height: Math.floor(Math.random() * 100 + 100),
          confidence: Math.random() * 0.3 + 0.7,
          text: isAuthorized ? 'Authorized Advertisement' : 'Potential Unauthorized Advertisement',
          status: isAuthorized ? 'Authorized' : 'Unauthorized'
        }],
        location: {
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180,
          address: '123 Test Street, Sample City'
        }
      };

      try {
        // Update file status with detection
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'completed', detection }
            : f
        ));

        // Add to appropriate lists
        if (isAuthorized) {
          // Add to authorized ads
          const authorizedAd: AuthorizedAd = {
            id: Math.random().toString(36).slice(2),
            text: detection.text,
            addedBy: 'system',
            dateAdded: new Date().toISOString(),
            active: true
          };
          await api.addAuthorizedAd(authorizedAd);

          toast({
            title: 'Ad Authorized',
            description: 'Advertisement has been authorized and logged.',
            variant: 'default'
          });
        } else {
          // Create alert for unauthorized
          const alert: Alert = {
            id: Math.random().toString(36).slice(2),
            detection,
            type: 'violation',
            priority,
            timestamp: new Date().toISOString()
          };
          await api.addAlert(alert);

          toast({
            title: 'Unauthorized Ad Detected',
            description: `Unauthorized ad detected with ${priority} risk level.`,
            variant: 'destructive'
          });
        }

        // Log to detection results
        await api.addDetectionResult({
          id: Math.random().toString(36).slice(2),
          detection,
          result: status,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('Error storing results:', error);
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'error' } : f
        ));
        
        toast({
          variant: 'destructive',
          title: 'Processing Failed',
          description: 'Failed to store the detection results.'
        });
      }

    } catch (error) {
      console.error('Error processing file:', error);
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'error' } : f
      ));
      
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: 'Failed to process the uploaded image.'
      });
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Detection['status']) => {
    switch (status) {
      case 'Authorized':
        return 'bg-green-500/10 text-green-600';
      case 'Unauthorized':
        return 'bg-red-500/10 text-red-600';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 rounded-lg bg-primary/10">
          <Camera className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Upload & Detection</h1>
          <p className="text-muted-foreground">
            Upload images to detect and analyze advertisements
          </p>
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadIcon className="w-5 h-5" />
              Image Upload
            </CardTitle>
            <CardDescription>
              Drag and drop images or click to select files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                ${isDragActive 
                  ? 'border-primary bg-primary/5 scale-[1.02]' 
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }
              `}
            >
              <input {...getInputProps()} />
              <motion.div
                animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="p-4 rounded-full bg-primary/10">
                  <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    {isDragActive
                      ? 'Drop images here...'
                      : 'Drag & drop images here'
                    }
                  </p>
                  <p className="text-muted-foreground mt-1">
                    or click to select files • PNG, JPG, GIF up to 10MB
                  </p>
                </div>
                <Button variant="outline">
                  Browse Files
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <Card className="shadow-card overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(file.status)}
                        <span className="font-medium truncate">
                          {file.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {file.status !== 'completed' && (
                      <Progress value={file.progress} className="h-2" />
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Image Preview with Bounding Boxes */}
                    <div className="relative">
                      <img
                        src={file.preview}
                        alt="Upload preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      
                      {/* Bounding Boxes Overlay */}
                      {file.detection?.boundingBoxes?.map((box: BoundingBox) => (
                        <motion.div
                          key={box.id}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className="absolute border-2 border-primary rounded"
                          style={{
                            left: `${(box.x / 800) * 100}%`,
                            top: `${(box.y / 600) * 100}%`,
                            width: `${(box.width / 800) * 100}%`,
                            height: `${(box.height / 600) * 100}%`,
                          }}
                        >
                          <div className="absolute -top-6 left-0 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                            {Math.round(box.confidence * 100)}%
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Detection Results */}
                    {file.detection && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(file.detection.status)}>
                            {file.detection.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Confidence: {file.detection.confidence}
                          </span>
                        </div>
                        
                        <div>
                          <p className="font-medium text-sm mb-1">Detected Text:</p>
                          <p className="text-sm bg-muted p-2 rounded">
                            {file.detection.text}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {file.detection.boundingBoxes?.length || 0} regions detected
                          </span>
                          <span>
                            {new Date(file.detection.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Processing Status */}
                    {file.status === 'processing' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-4"
                      >
                        <div className="animate-pulse-glow p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
                          <Loader2 className="w-6 h-6 text-primary animate-spin" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Analyzing image with AI...
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
