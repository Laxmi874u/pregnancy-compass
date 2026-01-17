import { motion } from 'framer-motion';
import { FileText, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/layout/MainLayout';

const results = [
  {
    id: 1,
    type: 'Fetal Health Analysis',
    date: '2024-01-15',
    status: 'completed',
    result: 'Normal',
    details: 'All parameters within healthy range. Fetal heart rate: 140 bpm',
  },
  {
    id: 2,
    type: 'Brain Tumor Screening',
    date: '2024-01-10',
    status: 'completed',
    result: 'No Issues Detected',
    details: 'MRI analysis shows no abnormalities. All regions appear normal.',
  },
  {
    id: 3,
    type: 'Pregnancy Risk Assessment',
    date: '2024-01-08',
    status: 'completed',
    result: 'Low Risk',
    details: 'Based on current health metrics, pregnancy is progressing normally.',
  },
  {
    id: 4,
    type: 'Weekly Health Check',
    date: '2024-01-05',
    status: 'pending',
    result: 'Awaiting',
    details: 'Scheduled checkup pending. Please complete the questionnaire.',
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-5 h-5 text-success" />;
    case 'pending':
      return <Clock className="w-5 h-5 text-warning" />;
    default:
      return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-success/10 text-success border-success/20">Completed</Badge>;
    case 'pending':
      return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function Results() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Results</h1>
          <p className="text-muted-foreground">View your prediction and analysis results</p>
        </motion.div>

        {/* Results List */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <Card className="glass-card border-none hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{result.type}</h3>
                          {getStatusBadge(result.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(result.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <p className="text-muted-foreground">{result.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                      {getStatusIcon(result.status)}
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Result</p>
                        <p className="font-semibold text-foreground">{result.result}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
