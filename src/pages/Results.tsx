import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, CheckCircle, AlertCircle, Clock, Brain, Baby, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { getPredictionHistory, PredictionHistoryItem } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'brain_tumor':
      return <Brain className="w-6 h-6 text-primary-foreground" />;
    case 'fetal_health':
      return <Baby className="w-6 h-6 text-primary-foreground" />;
    case 'pregnancy_risk':
      return <AlertTriangle className="w-6 h-6 text-primary-foreground" />;
    default:
      return <FileText className="w-6 h-6 text-primary-foreground" />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'brain_tumor':
      return 'Brain Tumor Analysis';
    case 'fetal_health':
      return 'Fetal Health Analysis';
    case 'pregnancy_risk':
      return 'Pregnancy Risk Assessment';
    default:
      return type;
  }
};

const getResultBadge = (result: Record<string, unknown>) => {
  const prediction = result.prediction as string;
  
  if (!prediction) return <Badge variant="outline">Unknown</Badge>;
  
  if (prediction.includes('Normal') || prediction.includes('No Tumor') || prediction.includes('Low')) {
    return <Badge className="bg-success/10 text-success border-success/20">{prediction}</Badge>;
  } else if (prediction.includes('Suspect') || prediction.includes('Mid') || prediction.includes('Medium')) {
    return <Badge className="bg-warning/10 text-warning border-warning/20">{prediction}</Badge>;
  } else {
    return <Badge className="bg-destructive/10 text-destructive border-destructive/20">{prediction}</Badge>;
  }
};

export default function Results() {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await getPredictionHistory();
      setHistory(response.history);
    } catch (error) {
      // Show mock data if backend is unavailable
      setHistory([
        {
          id: 1,
          prediction_type: 'fetal_health',
          input_data: {},
          result: { prediction: 'Normal', confidence: 92.5 },
          confidence: 92.5,
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          prediction_type: 'brain_tumor',
          input_data: {},
          result: { prediction: 'No Tumor', confidence: 95.8 },
          confidence: 95.8,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          prediction_type: 'pregnancy_risk',
          input_data: {},
          result: { prediction: 'Low Risk', confidence: 88.3 },
          confidence: 88.3,
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
      
      toast({
        title: "Backend Offline",
        description: "Showing sample results. Start the Flask backend for real data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Results History</h1>
            <p className="text-muted-foreground">View your prediction and analysis results from the database</p>
          </div>
          <Button variant="secondary" onClick={fetchHistory} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Results List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="glass-card border-none">
              <CardContent className="p-12 text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading prediction history...</p>
              </CardContent>
            </Card>
          ) : history.length === 0 ? (
            <Card className="glass-card border-none">
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Results Yet</h3>
                <p className="text-muted-foreground">
                  Your prediction results will appear here after you run analyses.
                </p>
              </CardContent>
            </Card>
          ) : (
            history.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <Card className="glass-card border-none hover:shadow-card transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                          {getTypeIcon(item.prediction_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="text-lg font-semibold text-foreground">
                              {getTypeLabel(item.prediction_type)}
                            </h3>
                            {getResultBadge(item.result)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {item.result.recommendations 
                              ? (item.result.recommendations as string[])[0] 
                              : `Analysis completed with ${item.confidence.toFixed(1)}% confidence`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Confidence</p>
                          <p className="font-semibold text-foreground">{item.confidence.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
