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
import { Detection, BoundingBox } from '@/types';
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

      // Process with API
      const detection = await api.uploadImage(file);
      
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: 'completed', detection }
          : f
      ));

      toast({
        title: 'Detection Complete',
        description: `Found ${detection.boundingBoxes?.length || 0} text regions with ${detection.confidence} confidence.`
      });

    } catch (error) {
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
        return 'status-authorized';
      case 'Unauthorized':
        return 'status-unauthorized';
      case 'Pending':
        return 'status-pending';
      default:
        return 'bg-muted';
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