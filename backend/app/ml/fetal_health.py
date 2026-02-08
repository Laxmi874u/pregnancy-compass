import numpy as np
import pandas as pd
import os
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

class FetalHealthPredictor:
    """
    Fetal Health Prediction based on CTG (Cardiotocography) data
    
    Uses the Fetal Health Classification dataset from UCI/Kaggle.
    Classes:
    1 = Normal
    2 = Suspect
    3 = Pathological
    """
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.model_loaded = False
        self.feature_names = [
            'baseline_value', 'accelerations', 'fetal_movement',
            'uterine_contractions', 'light_decelerations', 'severe_decelerations',
            'prolongued_decelerations', 'abnormal_short_term_variability',
            'mean_value_of_short_term_variability',
            'percentage_of_time_with_abnormal_long_term_variability',
            'mean_value_of_long_term_variability', 'histogram_width',
            'histogram_min', 'histogram_max', 'histogram_number_of_peaks',
            'histogram_number_of_zeroes', 'histogram_mode', 'histogram_mean',
            'histogram_median', 'histogram_variance', 'histogram_tendency'
        ]
        self.classes = {1: 'Normal', 2: 'Suspect', 3: 'Pathological'}
        self._load_or_train_model()
    
    def _load_or_train_model(self):
        """Load existing model or train new one"""
        model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'fetal_health_model.pkl')
        scaler_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'fetal_health_scaler.pkl')
        
        try:
            if os.path.exists(model_path) and os.path.exists(scaler_path):
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                self.model_loaded = True
                print("Fetal health model loaded successfully")
            else:
                print("Model not found. Training new model...")
                self._train_model()
        except Exception as e:
            print(f"Error loading model: {e}. Training new model...")
            self._train_model()
    
    def _train_model(self):
        """Train the model using the fetal health dataset"""
        try:
            # Look for dataset in multiple locations
            possible_paths = [
                os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'fetal_health.csv'),
                os.path.join(os.path.dirname(__file__), '..', '..', 'fetal_health.csv'),
                'data/fetal_health.csv',
                'fetal_health.csv'
            ]
            
            data_path = None
            for path in possible_paths:
                if os.path.exists(path):
                    data_path = path
                    break
            
            if data_path is None:
                print("Dataset not found. Using fallback prediction.")
                self.model_loaded = False
                return
            
            # Load and prepare data
            df = pd.read_csv(data_path)
            
            # Map CSV column names to expected feature names (handle space vs underscore)
            column_mapping = {
                'baseline value': 'baseline_value',
                'prolongued_decelerations': 'prolongued_decelerations'
            }
            df = df.rename(columns=column_mapping)
            
            # Features and target
            X = df[self.feature_names].values
            y = df['fetal_health'].values
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Scale features
            self.scaler = StandardScaler()
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            self.model.fit(X_train_scaled, y_train)
            
            # Calculate accuracy
            accuracy = self.model.score(X_test_scaled, y_test)
            print(f"Model trained with accuracy: {accuracy:.2%}")
            
            # Save model
            models_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'models')
            os.makedirs(models_dir, exist_ok=True)
            
            with open(os.path.join(models_dir, 'fetal_health_model.pkl'), 'wb') as f:
                pickle.dump(self.model, f)
            with open(os.path.join(models_dir, 'fetal_health_scaler.pkl'), 'wb') as f:
                pickle.dump(self.scaler, f)
            
            self.model_loaded = True
            print("Model saved successfully")
            
        except Exception as e:
            print(f"Error training model: {e}")
            self.model_loaded = False
    
    def predict(self, data):
        """
        Predict fetal health from CTG data
        
        Args:
            data: Dictionary containing CTG measurements
        
        Returns:
            Dictionary with prediction results
        """
        try:
            # Extract features in correct order
            features = []
            for feature_name in self.feature_names:
                value = data.get(feature_name, 0)
                features.append(float(value))
            
            features = np.array(features).reshape(1, -1)
            
            if self.model_loaded and self.model is not None:
                # Scale features
                features_scaled = self.scaler.transform(features)
                
                # Make prediction
                prediction = int(self.model.predict(features_scaled)[0])
                probabilities = self.model.predict_proba(features_scaled)[0]
                confidence = float(max(probabilities)) * 100
            else:
                # Fallback prediction based on key indicators
                prediction, confidence = self._fallback_prediction(data)
            
            # Get class name
            class_name = self.classes.get(prediction, 'Unknown')
            
            # Generate detailed analysis
            analysis = self._analyze_indicators(data)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(prediction, analysis)
            
            return {
                'prediction': prediction,
                'class': class_name,
                'confidence': round(confidence, 2),
                'risk_level': self._get_risk_level(prediction),
                'analysis': analysis,
                'recommendations': recommendations,
                'disclaimer': "This is an AI-assisted analysis of CTG data. Please consult a qualified healthcare professional for diagnosis and medical decisions."
            }
            
        except Exception as e:
            raise ValueError(f"Prediction error: {e}")
    
    def _fallback_prediction(self, data):
        """Fallback prediction when model is not available"""
        # Key indicators for fetal health
        baseline = data.get('baseline_value', 140)
        accelerations = data.get('accelerations', 0)
        severe_decelerations = data.get('severe_decelerations', 0)
        prolongued_decelerations = data.get('prolongued_decelerations', 0)
        abnormal_stv = data.get('abnormal_short_term_variability', 0)
        
        risk_score = 0
        
        # Baseline fetal heart rate
        if baseline < 110 or baseline > 160:
            risk_score += 2
        
        # Lack of accelerations
        if accelerations < 0.001:
            risk_score += 1
        
        # Severe decelerations
        if severe_decelerations > 0:
            risk_score += 3
        
        # Prolonged decelerations
        if prolongued_decelerations > 0:
            risk_score += 2
        
        # High abnormal short-term variability
        if abnormal_stv > 50:
            risk_score += 2
        
        if risk_score >= 5:
            return 3, 75.0  # Pathological
        elif risk_score >= 2:
            return 2, 70.0  # Suspect
        else:
            return 1, 85.0  # Normal
    
    def _analyze_indicators(self, data):
        """Analyze individual indicators"""
        analysis = {}
        
        # Baseline heart rate analysis
        baseline = data.get('baseline_value', 0)
        if 110 <= baseline <= 160:
            analysis['baseline_heart_rate'] = {'status': 'Normal', 'value': baseline, 'normal_range': '110-160 bpm'}
        elif baseline < 110:
            analysis['baseline_heart_rate'] = {'status': 'Low (Bradycardia)', 'value': baseline, 'normal_range': '110-160 bpm'}
        else:
            analysis['baseline_heart_rate'] = {'status': 'High (Tachycardia)', 'value': baseline, 'normal_range': '110-160 bpm'}
        
        # Accelerations
        accelerations = data.get('accelerations', 0)
        if accelerations > 0:
            analysis['accelerations'] = {'status': 'Present (Good sign)', 'value': accelerations}
        else:
            analysis['accelerations'] = {'status': 'Absent (Needs attention)', 'value': accelerations}
        
        # Decelerations
        severe_dec = data.get('severe_decelerations', 0)
        prolonged_dec = data.get('prolongued_decelerations', 0)
        
        if severe_dec > 0 or prolonged_dec > 0:
            analysis['decelerations'] = {'status': 'Concerning', 'severe': severe_dec, 'prolonged': prolonged_dec}
        else:
            analysis['decelerations'] = {'status': 'Normal', 'severe': severe_dec, 'prolonged': prolonged_dec}
        
        # Variability
        stv = data.get('mean_value_of_short_term_variability', 0)
        ltv = data.get('mean_value_of_long_term_variability', 0)
        
        if 5 <= stv <= 25:
            analysis['variability'] = {'status': 'Normal', 'short_term': stv, 'long_term': ltv}
        else:
            analysis['variability'] = {'status': 'Abnormal', 'short_term': stv, 'long_term': ltv}
        
        return analysis
    
    def _get_risk_level(self, prediction):
        """Get risk level from prediction"""
        risk_levels = {
            1: 'Low',
            2: 'Moderate',
            3: 'High'
        }
        return risk_levels.get(prediction, 'Unknown')
    
    def _generate_recommendations(self, prediction, analysis):
        """Generate recommendations based on prediction"""
        recommendations = []
        
        if prediction == 1:  # Normal
            recommendations = [
                "Continue routine prenatal monitoring",
                "Maintain regular fetal kick counts",
                "Follow up with scheduled appointments",
                "Report any changes in fetal movement to your provider"
            ]
        elif prediction == 2:  # Suspect
            recommendations = [
                "Increased monitoring recommended",
                "Consider non-stress test (NST) follow-up",
                "Stay hydrated and rest on your left side",
                "Report any decreased fetal movement immediately",
                "Schedule follow-up within 24-48 hours"
            ]
        else:  # Pathological
            recommendations = [
                "URGENT: Immediate medical evaluation required",
                "Contact your healthcare provider or go to labor & delivery",
                "Continuous fetal monitoring may be needed",
                "Prepare for possible early delivery if condition persists",
                "Do not delay seeking medical care"
            ]
        
        return recommendations
