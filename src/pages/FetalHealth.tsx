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
import { predictFetalHealth, FetalHealthResult } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
  const [result, setResult] = useState<FetalHealthResult | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof CTGData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Map form data to API format
      const apiInput = {
        baseline_value: parseFloat(formData.baselineValue) || 0,
        accelerations: parseFloat(formData.accelerations) || 0,
        fetal_movement: parseFloat(formData.fetalMovement) || 0,
        uterine_contractions: parseFloat(formData.uterineContractions) || 0,
        light_decelerations: parseFloat(formData.lightDecelerations) || 0,
        severe_decelerations: parseFloat(formData.severeDecelerations) || 0,
        prolongued_decelerations: parseFloat(formData.prolonguedDecelerations) || 0,
        abnormal_short_term_variability: parseFloat(formData.abnormalShortTermVariability) || 0,
        mean_value_of_short_term_variability: parseFloat(formData.meanShortTermVariability) || 0,
        percentage_of_time_with_abnormal_long_term_variability: parseFloat(formData.abnormalLongTermVariability) || 0,
        mean_value_of_long_term_variability: parseFloat(formData.meanLongTermVariability) || 0,
        histogram_width: parseFloat(formData.histogramWidth) || 0,
        histogram_min: parseFloat(formData.histogramMin) || 0,
        histogram_max: parseFloat(formData.histogramMax) || 0,
        histogram_number_of_peaks: parseFloat(formData.histogramPeaks) || 0,
        histogram_number_of_zeroes: parseFloat(formData.histogramZeros) || 0,
        histogram_mode: parseFloat(formData.histogramMode) || 0,
        histogram_mean: parseFloat(formData.histogramMean) || 0,
        histogram_median: parseFloat(formData.histogramMedian) || 0,
        histogram_variance: parseFloat(formData.histogramVariance) || 0,
        histogram_tendency: parseFloat(formData.histogramTendency) || 0,
      };

      const response = await predictFetalHealth(apiInput);
      setResult(response);
      
      toast({
        title: "Analysis Complete",
        description: `Fetal health prediction: ${response.prediction}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze CTG data. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleData = () => {
    setFormData({
      baselineValue: '120',
      accelerations: '0.003',
      fetalMovement: '0.0',
      uterineContractions: '0.006',
      lightDecelerations: '0.003',
      severeDecelerations: '0.0',
      prolonguedDecelerations: '0.0',
      abnormalShortTermVariability: '17',
      meanShortTermVariability: '2.1',
      abnormalLongTermVariability: '0',
      meanLongTermVariability: '10.4',
      histogramWidth: '130',
      histogramMin: '68',
      histogramMax: '198',
      histogramPeaks: '6',
      histogramZeros: '1',
      histogramMode: '141',
      histogramMean: '136',
      histogramMedian: '140',
      histogramVariance: '12',
      histogramTendency: '0',
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
            <p className="text-muted-foreground">CTG data analysis using machine learning (Random Forest)</p>
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
                        step="any"
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
                    {result.prediction === 'Normal' ? (
                      <CheckCircle className="w-6 h-6 text-success" />
                    ) : (
                      <AlertCircle className={`w-6 h-6 ${result.prediction === 'Pathological' ? 'text-destructive' : 'text-warning'}`} />
                    )}
                    Analysis Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-4 rounded-xl ${getClassificationColor(result.prediction)}`}>
                    <p className="text-lg font-semibold">{result.prediction}</p>
                    <p className="text-sm opacity-80">Risk Level: {result.risk_level}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
                    <Progress value={result.confidence} className="h-3" />
                    <p className="text-right text-sm font-medium mt-1 text-foreground">{result.confidence.toFixed(1)}%</p>
                  </div>
                  
                  {/* Analysis Details */}
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Analysis:</p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• {result.analysis.heart_rate_assessment}</p>
                      <p>• {result.analysis.variability_assessment}</p>
                      <p>• {result.analysis.deceleration_assessment}</p>
                    </div>
                  </div>
                  
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
