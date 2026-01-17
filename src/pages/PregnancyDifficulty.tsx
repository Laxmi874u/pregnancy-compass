import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import MainLayout from '@/components/layout/MainLayout';

interface RiskData {
  age: string;
  systolicBP: string;
  diastolicBP: string;
  bloodSugar: string;
  bodyTemp: string;
  heartRate: string;
  previousPregnancies: string;
  previousComplications: string;
  diabetes: string;
  hypertension: string;
  familyHistory: string;
}

const initialData: RiskData = {
  age: '',
  systolicBP: '',
  diastolicBP: '',
  bloodSugar: '',
  bodyTemp: '',
  heartRate: '',
  previousPregnancies: '',
  previousComplications: 'no',
  diabetes: 'no',
  hypertension: 'no',
  familyHistory: 'no',
};

export default function PregnancyDifficulty() {
  const [formData, setFormData] = useState<RiskData>(initialData);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    riskLevel: 'Low' | 'Medium' | 'High';
    score: number;
    factors: string[];
    advice: string;
  } | null>(null);

  const handleInputChange = (field: keyof RiskData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Calculate risk based on input data
    let riskScore = 0;
    const riskFactors: string[] = [];

    // Age factor
    const age = parseInt(formData.age);
    if (age < 18 || age > 35) {
      riskScore += 15;
      riskFactors.push(`Age factor (${age} years)`);
    }

    // Blood pressure
    const systolic = parseInt(formData.systolicBP);
    const diastolic = parseInt(formData.diastolicBP);
    if (systolic > 140 || diastolic > 90) {
      riskScore += 20;
      riskFactors.push('Elevated blood pressure');
    }

    // Blood sugar
    const bloodSugar = parseFloat(formData.bloodSugar);
    if (bloodSugar > 140) {
      riskScore += 15;
      riskFactors.push('Elevated blood sugar levels');
    }

    // Heart rate
    const heartRate = parseInt(formData.heartRate);
    if (heartRate > 100 || heartRate < 60) {
      riskScore += 10;
      riskFactors.push('Abnormal heart rate');
    }

    // Medical history
    if (formData.previousComplications === 'yes') {
      riskScore += 15;
      riskFactors.push('History of pregnancy complications');
    }
    if (formData.diabetes === 'yes') {
      riskScore += 15;
      riskFactors.push('Diabetes');
    }
    if (formData.hypertension === 'yes') {
      riskScore += 15;
      riskFactors.push('Hypertension');
    }
    if (formData.familyHistory === 'yes') {
      riskScore += 10;
      riskFactors.push('Family history of complications');
    }

    // Normalize score
    riskScore = Math.min(riskScore, 100);

    let riskLevel: 'Low' | 'Medium' | 'High';
    let advice: string;

    if (riskScore < 30) {
      riskLevel = 'Low';
      advice = 'Your pregnancy appears to be progressing normally with low risk factors. Continue regular prenatal care and maintain a healthy lifestyle.';
    } else if (riskScore < 60) {
      riskLevel = 'Medium';
      advice = 'Some risk factors have been identified. More frequent monitoring and lifestyle modifications may be recommended. Discuss these findings with your healthcare provider.';
    } else {
      riskLevel = 'High';
      advice = 'Multiple risk factors have been identified. Immediate consultation with your healthcare provider is recommended for a comprehensive evaluation and care plan.';
    }

    if (riskFactors.length === 0) {
      riskFactors.push('No significant risk factors identified');
    }

    setResult({ riskLevel, score: riskScore, factors: riskFactors, advice });
    setIsAnalyzing(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-success bg-success/10 border-success/20';
      case 'Medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'High':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      default:
        return '';
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
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Pregnancy Difficulty Prediction</h1>
          <p className="text-muted-foreground">Assess potential pregnancy complications and risks</p>
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
                <CardDescription>Enter your health information for risk analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
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
                    <Label htmlFor="previousPregnancies">Previous Pregnancies</Label>
                    <Input
                      id="previousPregnancies"
                      type="number"
                      placeholder="Number"
                      value={formData.previousPregnancies}
                      onChange={(e) => handleInputChange('previousPregnancies', e.target.value)}
                      className="bg-muted/50"
                    />
                  </div>
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
                    <div className="space-y-2">
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

                {/* Medical History */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Medical History</h4>
                  
                  <div className="space-y-3">
                    <Label>Previous pregnancy complications?</Label>
                    <RadioGroup
                      value={formData.previousComplications}
                      onValueChange={(value) => handleInputChange('previousComplications', value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="complications-no" />
                        <Label htmlFor="complications-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="complications-yes" />
                        <Label htmlFor="complications-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Diabetes?</Label>
                    <RadioGroup
                      value={formData.diabetes}
                      onValueChange={(value) => handleInputChange('diabetes', value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="diabetes-no" />
                        <Label htmlFor="diabetes-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="diabetes-yes" />
                        <Label htmlFor="diabetes-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Hypertension?</Label>
                    <RadioGroup
                      value={formData.hypertension}
                      onValueChange={(value) => handleInputChange('hypertension', value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="hypertension-no" />
                        <Label htmlFor="hypertension-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="hypertension-yes" />
                        <Label htmlFor="hypertension-yes">Yes</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label>Family history of pregnancy complications?</Label>
                    <RadioGroup
                      value={formData.familyHistory}
                      onValueChange={(value) => handleInputChange('familyHistory', value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="family-no" />
                        <Label htmlFor="family-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="family-yes" />
                        <Label htmlFor="family-yes">Yes</Label>
                      </div>
                    </RadioGroup>
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
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel === 'Low' ? (
                        <CheckCircle className="w-12 h-12" />
                      ) : (
                        <AlertCircle className="w-12 h-12" />
                      )}
                    </div>
                    <h2 className={`text-3xl font-display font-bold ${
                      result.riskLevel === 'Low' ? 'text-success' :
                      result.riskLevel === 'Medium' ? 'text-warning' : 'text-destructive'
                    }`}>
                      {result.riskLevel} Risk
                    </h2>
                    <div className="mt-6">
                      <p className="text-sm text-muted-foreground mb-2">Risk Score</p>
                      <Progress value={result.score} className="h-4" />
                      <p className="text-right text-sm font-medium mt-1 text-foreground">{result.score}%</p>
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
                      {result.factors.map((factor, index) => (
                        <li key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
                            result.riskLevel === 'Low' ? 'text-success' :
                            result.riskLevel === 'Medium' ? 'text-warning' : 'text-destructive'
                          }`} />
                          <span className="text-foreground">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Advice */}
                <Card className="glass-card border-none">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{result.advice}</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="glass-card border-none h-full flex items-center justify-center">
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="w-20 h-20 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Risk Assessment</h3>
                  <p className="text-muted-foreground">
                    Fill in your health information to receive a personalized pregnancy risk assessment.
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
