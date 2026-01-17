import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Upload, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import brainScanImage from '@/assets/brain-scan.jpg';

interface FormData {
  age: string;
  pregnancyWeek: string;
  bloodPressure: string;
  headacheFrequency: string;
  visionChanges: string;
  nausea: string;
  previousConditions: string;
}

export default function BrainTumor() {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    pregnancyWeek: '',
    bloodPressure: '',
    headacheFrequency: '',
    visionChanges: '',
    nausea: '',
    previousConditions: '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ status: string; confidence: number; details: string } | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock result based on form data
    const riskScore = Math.random();
    if (riskScore < 0.7) {
      setResult({
        status: 'No Tumor Detected',
        confidence: 95 + Math.random() * 5,
        details: 'The AI analysis of the provided data indicates no signs of brain tumor. All neurological indicators appear within normal range for your pregnancy stage.',
      });
    } else {
      setResult({
        status: 'Further Consultation Recommended',
        confidence: 75 + Math.random() * 15,
        details: 'Based on the provided information, we recommend scheduling a consultation with a neurologist for additional tests. This is a precautionary measure.',
      });
    }

    setIsAnalyzing(false);
  };

  const isFormValid = Object.values(formData).every((value) => value !== '');

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Brain Tumor Prediction</h1>
          <p className="text-muted-foreground">AI-powered analysis for pregnant women</p>
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
                <CardDescription>Enter your health data for AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
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
                    <Label htmlFor="pregnancyWeek">Pregnancy Week</Label>
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
                  <Label htmlFor="bloodPressure">Blood Pressure</Label>
                  <Input
                    id="bloodPressure"
                    placeholder="e.g., 120/80"
                    value={formData.bloodPressure}
                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Headache Frequency</Label>
                  <Select
                    value={formData.headacheFrequency}
                    onValueChange={(value) => handleInputChange('headacheFrequency', value)}
                  >
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="occasional">Occasional</SelectItem>
                      <SelectItem value="frequent">Frequent</SelectItem>
                      <SelectItem value="severe">Severe/Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Vision Changes</Label>
                  <Select
                    value={formData.visionChanges}
                    onValueChange={(value) => handleInputChange('visionChanges', value)}
                  >
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No changes</SelectItem>
                      <SelectItem value="mild">Mild blurriness</SelectItem>
                      <SelectItem value="moderate">Moderate changes</SelectItem>
                      <SelectItem value="severe">Severe changes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Nausea Level</Label>
                  <Select
                    value={formData.nausea}
                    onValueChange={(value) => handleInputChange('nausea', value)}
                  >
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Previous Neurological Conditions</Label>
                  <Select
                    value={formData.previousConditions}
                    onValueChange={(value) => handleInputChange('previousConditions', value)}
                  >
                    <SelectTrigger className="bg-muted/50">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="migraine">Migraine history</SelectItem>
                      <SelectItem value="seizure">Seizure history</SelectItem>
                      <SelectItem value="other">Other conditions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Upload MRI/CT Scan (Optional)</Label>
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
                          <p className="text-muted-foreground">Click to upload scan image</p>
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
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Analyze Data
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
                    {result.status === 'No Tumor Detected' ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-warning" />
                    )}
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-xl ${
                    result.status === 'No Tumor Detected' ? 'bg-success/10' : 'bg-warning/10'
                  }`}>
                    <p className={`text-lg font-semibold ${
                      result.status === 'No Tumor Detected' ? 'text-success' : 'text-warning'
                    }`}>
                      {result.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                    <Progress value={result.confidence} className="h-3" />
                    <p className="text-right text-sm font-medium mt-1 text-foreground">{result.confidence.toFixed(1)}%</p>
                  </div>
                  <p className="text-muted-foreground">{result.details}</p>
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
                        Fill in your health information and our AI will analyze the data to provide 
                        a preliminary assessment. This is not a substitute for professional medical advice.
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
