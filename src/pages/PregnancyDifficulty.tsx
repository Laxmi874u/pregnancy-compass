import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';
import { predictPregnancyRisk, PregnancyRiskResult } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface RiskData {
  age: string;
  systolicBP: string;
  diastolicBP: string;
  bloodSugar: string;
  bodyTemp: string;
  heartRate: string;
}

const initialData: RiskData = {
  age: '',
  systolicBP: '',
  diastolicBP: '',
  bloodSugar: '',
  bodyTemp: '',
  heartRate: '',
};

export default function PregnancyDifficulty() {
  const [formData, setFormData] = useState<RiskData>(initialData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PregnancyRiskResult | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof RiskData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await predictPregnancyRisk({
        age: parseInt(formData.age) || 0,
        blood_pressure_systolic: parseInt(formData.systolicBP) || 0,
        blood_pressure_diastolic: parseInt(formData.diastolicBP) || 0,
        blood_sugar: parseFloat(formData.bloodSugar) || 0,
        body_temperature: parseFloat(formData.bodyTemp) || 98.6,
        heart_rate: parseInt(formData.heartRate) || 0,
      });

      setResult(response);
      
      toast({
        title: "Analysis Complete",
        description: `Risk Level: ${response.prediction}`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze data. Make sure the backend is running.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleData = () => {
    setFormData({
      age: '28',
      systolicBP: '120',
      diastolicBP: '80',
      bloodSugar: '95',
      bodyTemp: '98.6',
      heartRate: '75',
    });
  };

  const getRiskColor = (level: string) => {
    if (level.includes('Low')) {
      return 'text-success bg-success/10 border-success/20';
    } else if (level.includes('Mid') || level.includes('Medium')) {
      return 'text-warning bg-warning/10 border-warning/20';
    } else {
      return 'text-destructive bg-destructive/10 border-destructive/20';
    }
  };

  const requiredFields = ['age', 'systolicBP', 'diastolicBP', 'bloodSugar', 'heartRate'] as const;
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
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Pregnancy Difficulty Prediction</h1>
            <p className="text-muted-foreground">Assess potential pregnancy complications and risks (Random Forest Model)</p>
          </div>
          <Button variant="secondary" onClick={loadSampleData}>
            Load Sample Data
          </Button>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  Health Assessment
                </CardTitle>
                <CardDescription>Enter your vital signs for AI-powered risk analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age (e.g., 28)"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="bg-muted/50"
                  />
                </div>

                {/* Vital Signs */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Vital Signs</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolicBP">Systolic BP (mmHg) *</Label>
                      <Input
                        id="systolicBP"
                        type="number"
                        placeholder="e.g., 120"
                        value={formData.systolicBP}
                        onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diastolicBP">Diastolic BP (mmHg) *</Label>
                      <Input
                        id="diastolicBP"
                        type="number"
                        placeholder="e.g., 80"
                        value={formData.diastolicBP}
                        onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodSugar">Blood Sugar (mg/dL) *</Label>
                      <Input
                        id="bloodSugar"
                        type="number"
                        placeholder="e.g., 95"
                        value={formData.bloodSugar}
                        onChange={(e) => handleInputChange('bloodSugar', e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heartRate">Heart Rate (bpm) *</Label>
                      <Input
                        id="heartRate"
                        type="number"
                        placeholder="e.g., 72"
                        value={formData.heartRate}
                        onChange={(e) => handleInputChange('heartRate', e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="bodyTemp">Body Temperature (°F)</Label>
                      <Input
                        id="bodyTemp"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 98.6"
                        value={formData.bodyTemp}
                        onChange={(e) => handleInputChange('bodyTemp', e.target.value)}
                        className="bg-muted/50"
                      />
                    </div>
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
                      Analyzing Risk Factors...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Predict Pregnancy Difficulty
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
            {result ? (
              <>
                {/* Risk Level Card */}
                <Card className="glass-card border-none">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getRiskColor(result.prediction)}`}>
                      {result.prediction.includes('Low') ? (
                        <CheckCircle className="w-12 h-12" />
                      ) : (
                        <AlertCircle className="w-12 h-12" />
                      )}
                    </div>
                    <h2 className={`text-3xl font-display font-bold ${
                      result.prediction.includes('Low') ? 'text-success' :
                      result.prediction.includes('Mid') ? 'text-warning' : 'text-destructive'
                    }`}>
                      {result.prediction}
                    </h2>
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                      <Progress value={result.confidence} className="h-4" />
                      <p className="text-right text-sm font-medium mt-1 text-foreground">{result.confidence.toFixed(1)}%</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Vital Signs Analysis */}
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle className="text-foreground">Vital Signs Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm"><strong>Blood Pressure:</strong> {result.vital_signs_analysis.blood_pressure}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm"><strong>Blood Sugar:</strong> {result.vital_signs_analysis.blood_sugar}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm"><strong>Heart Rate:</strong> {result.vital_signs_analysis.heart_rate}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm"><strong>Temperature:</strong> {result.vital_signs_analysis.temperature}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Factors */}
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle className="text-foreground">Identified Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.risk_factors.map((factor, index) => (
                        <li key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                            factor.status === 'Normal' ? 'text-success' :
                            factor.status === 'Elevated' ? 'text-warning' : 'text-destructive'
                          }`} />
                          <div>
                            <span className="text-foreground font-medium">{factor.factor}</span>
                            <span className="text-sm text-muted-foreground ml-2">({factor.status})</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground italic mt-4">{result.disclaimer}</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="glass-card border-none h-full flex items-center justify-center">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-violet-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Risk Assessment</h3>
                  <p className="text-muted-foreground mb-6">
                    Enter your vital signs to get an AI-powered assessment of potential pregnancy complications.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-sm">
                    <span className="px-3 py-1 bg-success/10 text-success rounded-full">Low Risk</span>
                    <span className="px-3 py-1 bg-warning/10 text-warning rounded-full">Medium Risk</span>
                    <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full">High Risk</span>
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
