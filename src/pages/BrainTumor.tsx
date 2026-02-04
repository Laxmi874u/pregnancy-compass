import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Upload, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import brainScanImage from '@/assets/brain-scan.jpg';
import { predictBrainTumor, BrainTumorResult } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  age: string;
  pregnancyWeek: string;
  symptoms: string;
  medicalHistory: string;
}

export default function BrainTumor() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    pregnancyWeek: '',
    symptoms: '',
    medicalHistory: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BrainTumorResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      toast({
        title: "Image Required",
        description: "Please upload an MRI/CT scan image for analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await predictBrainTumor({
        age: parseInt(formData.age) || 0,
        gestationalWeek: parseInt(formData.pregnancyWeek) || 0,
        symptoms: formData.symptoms,
        medicalHistory: formData.medicalHistory,
        image: imageFile,
      });

      setResult(response);
      
      toast({
        title: "Analysis Complete",
        description: `Prediction: ${response.prediction}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze image. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const isFormValid = formData.age !== '' && formData.pregnancyWeek !== '' && imageFile !== null;

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Brain Tumor Prediction</h1>
          <p className="text-muted-foreground">AI-powered MRI analysis for pregnant women (CNN Model)</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Patient Information
                </CardTitle>
                <CardDescription>Enter your health data and upload MRI scan for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pregnancyWeek">Pregnancy Week *</Label>
                    <Input
                      id="pregnancyWeek"
                      type="number"
                      placeholder="Week number"
                      value={formData.pregnancyWeek}
                      onChange={(e) => handleInputChange('pregnancyWeek', e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe any symptoms (headaches, vision changes, etc.)"
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    className="bg-muted/50 min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalHistory">Medical History</Label>
                  <Textarea
                    id="medicalHistory"
                    placeholder="Any relevant medical history"
                    value={formData.medicalHistory}
                    onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                    className="bg-muted/50 min-h-[80px]"
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Upload MRI/CT Scan *</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="mri-upload"
                    />
                    <label htmlFor="mri-upload" className="cursor-pointer">
                      {uploadedImage ? (
                        <img src={uploadedImage} alt="Uploaded scan" className="max-h-40 mx-auto rounded-lg" />
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                          <p className="text-muted-foreground">Click to upload MRI/CT scan image</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, JPEG supported</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!isFormValid || isAnalyzing}
                  variant="hero"
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing MRI Image...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Analyze Scan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Result Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            {/* Preview Image */}
            <Card className="glass-card border-none overflow-hidden">
              <img src={brainScanImage} alt="Brain Analysis" className="w-full h-64 object-cover" />
            </Card>

            {/* Results */}
            {result ? (
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    {!result.has_tumor ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-warning" />
                    )}
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-xl ${
                    !result.has_tumor ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    <p className={`text-lg font-semibold ${
                      !result.has_tumor ? 'text-success' : 'text-warning'
                    }`}>
                      {result.prediction}
                    </p>
                    {result.tumor_type && (
                      <p className="text-sm opacity-80">Type: {result.tumor_type}</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                    <Progress value={result.confidence} className="h-3" />
                    <p className="text-right text-sm font-medium mt-1 text-foreground">{result.confidence.toFixed(1)}%</p>
                  </div>

                  {/* Pregnancy Risk */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">Pregnancy Risk Level: {result.pregnancy_risk_level}</p>
                    {result.pregnancy_risk_factors.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {result.pregnancy_risk_factors.map((factor, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">• {factor}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div>
                    <p className="font-medium text-foreground mb-2">Recommendations:</p>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <p className="text-xs text-muted-foreground italic">{result.disclaimer}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-none">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-info mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">How it works</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Upload an MRI/CT scan image and fill in your health information. Our AI (CNN model) will analyze the image 
                        and provide a preliminary assessment. This is not a substitute for professional medical advice.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
