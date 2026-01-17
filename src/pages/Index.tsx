import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Baby, 
  MessageCircle, 
  AlertTriangle, 
  ArrowRight, 
  Heart,
  Activity,
  Shield,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import heroImage from '@/assets/hero-pregnancy.jpg';

const features = [
  {
    icon: Brain,
    title: 'Brain Tumor Prediction',
    description: 'AI-powered analysis to detect potential brain abnormalities during pregnancy',
    path: '/brain-tumor',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Baby,
    title: 'Fetal Health Analysis',
    description: 'Comprehensive fetal health assessment using cardiotocography data',
    path: '/fetal-health',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: MessageCircle,
    title: 'AI Pregnancy Chatbot',
    description: 'Get instant answers to your pregnancy questions from our AI assistant',
    path: '/chatbot',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: AlertTriangle,
    title: 'Pregnancy Difficulty',
    description: 'Predict and assess potential pregnancy complications and risks',
    path: '/pregnancy-difficulty',
    color: 'from-violet-500 to-purple-500',
  },
];

const stats = [
  { icon: Heart, label: 'Predictions Made', value: '10,000+' },
  { icon: Activity, label: 'Accuracy Rate', value: '95%' },
  { icon: Shield, label: 'Data Secured', value: '100%' },
  { icon: TrendingUp, label: 'Happy Users', value: '5,000+' },
];

export default function Index() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
          
          <div className="relative z-10 p-8 lg:p-12 text-primary-foreground">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl lg:text-5xl font-display font-bold mb-4"
            >
              Welcome to <span className="text-accent">PregAI</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg lg:text-xl text-primary-foreground/80 max-w-2xl mb-6"
            >
              Your AI-powered companion for pregnancy health prediction and monitoring. 
              Get accurate insights about your health and your baby's wellbeing.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Button variant="hero" size="lg" asChild>
                <Link to="/chatbot">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chat
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/health">
                  View Health Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            >
              <Card className="glass-card border-none hover:shadow-card transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 gradient-primary rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-display font-bold text-foreground">Our Services</h2>
            <p className="text-muted-foreground">Explore our AI-powered health prediction tools</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
              >
                <Link to={feature.path}>
                  <Card className="h-full glass-card border-none hover:shadow-card hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-xl font-display text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground text-base">
                        {feature.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-primary font-medium">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
