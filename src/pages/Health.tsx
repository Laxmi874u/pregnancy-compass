import { motion } from 'framer-motion';
import { Heart, Activity, Thermometer, Droplets, Scale, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/components/layout/MainLayout';

const healthMetrics = [
  { icon: Heart, label: 'Heart Rate', value: '72', unit: 'bpm', progress: 72, status: 'normal' },
  { icon: Activity, label: 'Blood Pressure', value: '120/80', unit: 'mmHg', progress: 80, status: 'normal' },
  { icon: Thermometer, label: 'Temperature', value: '98.6', unit: '°F', progress: 65, status: 'normal' },
  { icon: Droplets, label: 'Blood Sugar', value: '95', unit: 'mg/dL', progress: 55, status: 'normal' },
  { icon: Scale, label: 'Weight', value: '65', unit: 'kg', progress: 70, status: 'normal' },
  { icon: Calendar, label: 'Pregnancy Week', value: '24', unit: 'weeks', progress: 60, status: 'normal' },
];

const tips = [
  "Stay hydrated - drink at least 8 glasses of water daily",
  "Take prenatal vitamins as recommended by your doctor",
  "Get regular exercise - 30 minutes of walking is beneficial",
  "Maintain a balanced diet rich in iron and folic acid",
  "Get adequate rest - aim for 7-9 hours of sleep",
];

export default function Health() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Health Dashboard</h1>
          <p className="text-muted-foreground">Monitor your pregnancy health metrics</p>
        </motion.div>

        {/* Health Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {healthMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <Card className="glass-card border-none hover:shadow-card transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                      <metric.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium capitalize">
                      {metric.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-3xl font-display text-foreground mb-1">
                    {metric.value}
                    <span className="text-lg text-muted-foreground ml-1">{metric.unit}</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mb-3">
                    {metric.label}
                  </CardDescription>
                  <Progress value={metric.progress} className="h-2" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="text-xl font-display text-foreground">Daily Health Tips</CardTitle>
              <CardDescription>Recommendations for a healthy pregnancy</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-xl"
                  >
                    <div className="w-6 h-6 gradient-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-secondary-foreground">{index + 1}</span>
                    </div>
                    <span className="text-foreground">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
}
