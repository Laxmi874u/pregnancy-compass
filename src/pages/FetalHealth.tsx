import { useState } from 'react';
import { motion } from 'framer-motion';
import { Baby, Loader2, CheckCircle, AlertCircle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import fetalImage from '@/assets/fetal-health.jpg';

interface CTGData {
  baselineValue: string;
  accelerations: string;
  fetalMovement: string;
  uterineContractions: string;
  lightDecelerations: string;
  severeDecelerations: string;
  prolonguedDecelerations: string;
  abnormalShortTermVariability: string;
  meanShortTermVariability: string;
  abnormalLongTermVariability: string;
  meanLongTermVariability: string;
  histogramWidth: string;
  histogramMin: string;
  histogramMax: string;
  histogramPeaks: string;
  histogramZeros: string;
  histogramMode: string;
  histogramMean: string;
  histogramMedian: string;
  histogramVariance: string;
  histogramTendency: string;
}

const initialData: CTGData = {
  baselineValue: '',
  accelerations: '',
  fetalMovement: '',
  uterineContractions: '',
  lightDecelerations: '',
  severeDecelerations: '',
  prolonguedDecelerations: '',
  abnormalShortTermVariability: '',
  meanShortTermVariability: '',
  abnormalLongTermVariability: '',
  meanLongTermVariability: '',
  histogramWidth: '',
  histogramMin: '',
  histogramMax: '',
  histogramPeaks: '',
  histogramZeros: '',
  histogramMode: '',
  histogramMean: '',
  histogramMedian: '',
  histogramVariance: '',
  histogramTendency: '',
};

const fieldLabels: Record<keyof CTGData, string> = {
  baselineValue: 'Baseline FHR (bpm)',
  accelerations: 'Accelerations',
  fetalMovement: 'Fetal Movements',
  uterineContractions: 'Uterine Contractions',
  lightDecelerations: 'Light Decelerations',
  severeDecelerations: 'Severe Decelerations',
  prolonguedDecelerations: 'Prolonged Decelerations',
  abnormalShortTermVariability: 'Abnormal STV (%)',
  meanShortTermVariability: 'Mean STV',
  abnormalLongTermVariability: 'Abnormal LTV (%)',
  meanLongTermVariability: 'Mean LTV',
  histogramWidth: 'Histogram Width',
  histogramMin: 'Histogram Min',
  histogramMax: 'Histogram Max',
  histogramPeaks: 'Histogram Peaks',
  histogramZeros: 'Histogram Zeros',
  histogramMode: 'Histogram Mode',
  histogramMean: 'Histogram Mean',
  histogramMedian: 'Histogram Median',
  histogramVariance: 'Histogram Variance',
  histogramTendency: 'Histogram Tendency',
};

export default function FetalHealth() {
  const [formData, setFormData] = useState<CTGData>(initialData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    classification: 'Normal' | 'Suspect' | 'Pathological';
    confidence: number;
    details: string;
    recommendations: string[];
  } | null>(null);

  const handleInputChange = (field: keyof CTGData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock result based on form data
    const randomValue = Math.random();
    let classification: 'Normal' | 'Suspect' | 'Pathological';
    let confidence: number;
    let details: string;
    let recommendations: string[];

    if (randomValue < 0.7) {
      classification = 'Normal';
      confidence = 92 + Math.random() * 8;
      details = 'The cardiotocography (CTG) analysis indicates that the fetal health parameters are within normal range. The baseline fetal heart rate, accelerations, and variability patterns suggest healthy fetal well-being.';
      recommendations = [
        'Continue regular prenatal checkups',
        'Maintain healthy diet and hydration',
        'Monitor daily fetal movements',
        'Follow up in 2-4 weeks',
      ];
    } else if (randomValue < 0.9) {
      classification = 'Suspect';
      confidence = 75 + Math.random() * 15;
      details = 'Some CTG parameters show borderline values that warrant closer monitoring. This does not necessarily indicate a problem but suggests the need for additional observation.';
      recommendations = [
        'Schedule follow-up CTG within 1 week',
        'Monitor fetal movements closely',
        'Stay hydrated and well-rested',
        'Contact healthcare provider if concerns arise',
      ];
    } else {
      classification = 'Pathological';
      confidence = 80 + Math.random() * 15;
      details = 'The CTG analysis shows some concerning patterns that require immediate medical attention. Please consult with your healthcare provider promptly for further evaluation.';
      recommendations = [
        'Contact your healthcare provider immediately',
        'Prepare for possible hospital visit',
        'Document any symptoms or changes',
        'Do not delay seeking medical care',
      ];
    }

    setResult({ classification, confidence, details, recommendations });
    setIsAnalyzing(false);
  };

  const loadSampleData = () => {
    setFormData({
      baselineValue: '120',
      accelerations: '3',
      fetalMovement: '10',
      uterineContractions: '2',
      lightDecelerations: '0',
      severeDecelerations: '0',
      prolonguedDecelerations: '0',
      abnormalShortTermVariability: '12',
      meanShortTermVariability: '0.5',
      abnormalLongTermVariability: '8',
      meanLongTermVariability: '12',
      histogramWidth: '70',
      histogramMin: '62',
      histogramMax: '126',
      histogramPeaks: '2',
      histogramZeros: '0',
      histogramMode: '120',
      histogramMean: '137',
      histogramMedian: '121',
      histogramVariance: '73',
      histogramTendency: '1',
    });
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Normal':
        return 'text-success bg-success/10';
      case 'Suspect':
        return 'text-warning bg-warning/10';
      case 'Pathological':
        return 'text-destructive bg-destructive/10';
      default:
        return '';
    }
  };

  const requiredFields = ['baselineValue', 'accelerations', 'fetalMovement', 'uterineContractions'] as const;
  const isFormValid = requiredFields.every((field) => formData[field] !== '');

  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Fetal Health Prediction</h1>
            <p className="text-muted-foreground">CTG data analysis using machine learning</p>
          </div>
          <Button variant="secondary" onClick={loadSampleData}>
            Load Sample Data
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  CTG Data Input
                </CardTitle>
                <CardDescription>Enter cardiotocography measurements (fields with * are required)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {(Object.keys(formData) as Array<keyof CTGData>).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="text-sm">
                        {fieldLabels[field]}
                        {requiredFields.includes(field as any) && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <Input
                        id={field}
                        type="number"
                        placeholder="Enter value"
                        value={formData[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                  ))}
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
                      Analyzing CTG Data...
                    </>
                  ) : (
                    <>
                      <Baby className="w-5 h-5 mr-2" />
                      Predict Fetal Health
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
              <img src={fetalImage} alt="Fetal Health" className="w-full h-48 object-cover" />
            </Card>

            {/* Results */}
            {result ? (
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    {result.classification === 'Normal' ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <AlertCircle className={`w-6 h-6 ${result.classification === 'Pathological' ? 'text-destructive' : 'text-warning'}`} />
                    )}
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-xl ${getClassificationColor(result.classification)}`}>
                    <p className="text-lg font-semibold">{result.classification}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                    <Progress value={result.confidence} className="h-3" />
                    <p className="text-right text-sm font-medium mt-1 text-foreground">{result.confidence.toFixed(1)}%</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.details}</p>
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
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-card border-none">
                <CardContent className="p-6 text-center">
                  <Baby className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    Enter CTG data to get fetal health prediction
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
