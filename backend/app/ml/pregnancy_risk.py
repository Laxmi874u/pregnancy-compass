import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import os
import pickle

class PregnancyRiskPredictor:
    """
    Pregnancy Risk/Difficulty Prediction
    
    Predicts maternal health risk level based on various health indicators.
    Risk levels: Low, Medium, High
    """
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.model_loaded = False
        self.feature_names = [
            'age', 'blood_pressure_systolic', 'blood_pressure_diastolic',
            'blood_sugar', 'body_temperature', 'heart_rate'
        ]
        self.risk_levels = {0: 'Low Risk', 1: 'Medium Risk', 2: 'High Risk'}
        self._load_or_create_model()
    
    def _load_or_create_model(self):
        """Load existing model or create a rule-based one"""
        model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'pregnancy_risk_model.pkl')
        scaler_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'pregnancy_risk_scaler.pkl')
        
        try:
            if os.path.exists(model_path) and os.path.exists(scaler_path):
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                self.model_loaded = True
                print("Pregnancy risk model loaded successfully")
            else:
                print("Model not found. Creating synthetic model...")
                self._create_synthetic_model()
        except Exception as e:
            print(f"Error loading model: {e}. Creating synthetic model...")
            self._create_synthetic_model()
    
    def _create_synthetic_model(self):
        """Create a model trained on synthetic data based on medical guidelines"""
        np.random.seed(42)
        n_samples = 1000
        
        # Generate synthetic training data based on medical knowledge
        # Age: 18-45
        # Systolic BP: 90-180
        # Diastolic BP: 60-120
        # Blood Sugar: 70-200
        # Body Temp: 97-102°F
        # Heart Rate: 60-120 bpm
        
        X = []
        y = []
        
        for _ in range(n_samples):
            age = np.random.uniform(18, 45)
            systolic = np.random.uniform(90, 180)
            diastolic = np.random.uniform(60, 120)
            blood_sugar = np.random.uniform(70, 200)
            temp = np.random.uniform(97, 102)
            heart_rate = np.random.uniform(60, 120)
            
            # Calculate risk based on medical guidelines
            risk_score = 0
            
            # Age risk
            if age < 20 or age > 35:
                risk_score += 1
            if age > 40:
                risk_score += 1
            
            # Blood pressure risk (Hypertension)
            if systolic >= 140 or diastolic >= 90:
                risk_score += 2
            if systolic >= 160 or diastolic >= 100:
                risk_score += 2
            
            # Blood sugar risk (Gestational Diabetes)
            if blood_sugar >= 140:
                risk_score += 1
            if blood_sugar >= 180:
                risk_score += 2
            
            # Temperature risk
            if temp >= 100.4:
                risk_score += 1
            
            # Heart rate risk
            if heart_rate < 60 or heart_rate > 100:
                risk_score += 1
            
            # Classify risk level
            if risk_score >= 4:
                risk_level = 2  # High
            elif risk_score >= 2:
                risk_level = 1  # Medium
            else:
                risk_level = 0  # Low
            
            X.append([age, systolic, diastolic, blood_sugar, temp, heart_rate])
            y.append(risk_level)
        
        X = np.array(X)
        y = np.array(y)
        
        # Train model
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.model.fit(X_scaled, y)
        
        # Save model
        models_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        with open(os.path.join(models_dir, 'pregnancy_risk_model.pkl'), 'wb') as f:
            pickle.dump(self.model, f)
        with open(os.path.join(models_dir, 'pregnancy_risk_scaler.pkl'), 'wb') as f:
            pickle.dump(self.scaler, f)
        
        self.model_loaded = True
        print("Synthetic pregnancy risk model created and saved")
    
    def predict(self, data):
        """
        Predict pregnancy risk level
        
        Args:
            data: Dictionary containing health indicators
                - age: Patient's age
                - blood_pressure_systolic: Systolic BP (mmHg)
                - blood_pressure_diastolic: Diastolic BP (mmHg)
                - blood_sugar: Blood glucose level (mg/dL)
                - body_temperature: Body temperature (°F)
                - heart_rate: Heart rate (bpm)
        
        Returns:
            Dictionary with prediction results
        """
        try:
            # Extract features
            features = []
            for feature_name in self.feature_names:
                value = data.get(feature_name, 0)
                features.append(float(value))
            
            features = np.array(features).reshape(1, -1)
            
            # Analyze individual risk factors
            risk_factors = self._analyze_risk_factors(data)
            
            if self.model_loaded and self.model is not None:
                features_scaled = self.scaler.transform(features)
                prediction = int(self.model.predict(features_scaled)[0])
                probabilities = self.model.predict_proba(features_scaled)[0]
                confidence = float(max(probabilities)) * 100
            else:
                prediction, confidence = self._fallback_prediction(risk_factors)
            
            # Get risk level name
            risk_level = self.risk_levels.get(prediction, 'Unknown')
            
            # Generate recommendations
            recommendations = self._generate_recommendations(prediction, risk_factors)
            
            # Lifestyle advice
            lifestyle_advice = self._get_lifestyle_advice(prediction, risk_factors)
            
            return {
                'prediction': prediction,
                'risk_level': risk_level,
                'confidence': round(confidence, 2),
                'risk_factors': risk_factors,
                'recommendations': recommendations,
                'lifestyle_advice': lifestyle_advice,
                'vital_signs_analysis': self._analyze_vital_signs(data),
                'disclaimer': "This is an AI-assisted risk assessment. Please consult a qualified healthcare professional for medical advice and decisions."
            }
            
        except Exception as e:
            raise ValueError(f"Prediction error: {e}")
    
    def _analyze_risk_factors(self, data):
        """Analyze individual risk factors"""
        risk_factors = []
        
        age = data.get('age', 0)
        systolic = data.get('blood_pressure_systolic', 0)
        diastolic = data.get('blood_pressure_diastolic', 0)
        blood_sugar = data.get('blood_sugar', 0)
        temp = data.get('body_temperature', 0)
        heart_rate = data.get('heart_rate', 0)
        
        # Age assessment
        if age < 20:
            risk_factors.append({
                'factor': 'Young Maternal Age',
                'value': age,
                'severity': 'Moderate',
                'description': 'Pregnancy under 20 may have increased complications'
            })
        elif age > 35:
            risk_factors.append({
                'factor': 'Advanced Maternal Age',
                'value': age,
                'severity': 'High' if age > 40 else 'Moderate',
                'description': 'Pregnancy after 35 carries increased risks for chromosomal abnormalities'
            })
        
        # Blood pressure assessment
        if systolic >= 160 or diastolic >= 100:
            risk_factors.append({
                'factor': 'Severe Hypertension',
                'value': f'{systolic}/{diastolic} mmHg',
                'severity': 'High',
                'description': 'Severely elevated blood pressure requires immediate medical attention'
            })
        elif systolic >= 140 or diastolic >= 90:
            risk_factors.append({
                'factor': 'Hypertension',
                'value': f'{systolic}/{diastolic} mmHg',
                'severity': 'Moderate',
                'description': 'Elevated blood pressure needs monitoring and management'
            })
        
        # Blood sugar assessment
        if blood_sugar >= 180:
            risk_factors.append({
                'factor': 'High Blood Sugar',
                'value': f'{blood_sugar} mg/dL',
                'severity': 'High',
                'description': 'Very high blood sugar may indicate uncontrolled diabetes'
            })
        elif blood_sugar >= 140:
            risk_factors.append({
                'factor': 'Elevated Blood Sugar',
                'value': f'{blood_sugar} mg/dL',
                'severity': 'Moderate',
                'description': 'May indicate gestational diabetes, glucose tolerance test recommended'
            })
        
        # Temperature assessment
        if temp >= 100.4:
            risk_factors.append({
                'factor': 'Fever',
                'value': f'{temp}°F',
                'severity': 'Moderate',
                'description': 'Fever during pregnancy should be evaluated for infection'
            })
        
        # Heart rate assessment
        if heart_rate > 100:
            risk_factors.append({
                'factor': 'Elevated Heart Rate',
                'value': f'{heart_rate} bpm',
                'severity': 'Low',
                'description': 'Mildly elevated heart rate is common in pregnancy but should be monitored'
            })
        elif heart_rate < 60:
            risk_factors.append({
                'factor': 'Low Heart Rate',
                'value': f'{heart_rate} bpm',
                'severity': 'Moderate',
                'description': 'Bradycardia should be evaluated'
            })
        
        return risk_factors
    
    def _fallback_prediction(self, risk_factors):
        """Fallback prediction based on risk factors"""
        if not risk_factors:
            return 0, 85.0  # Low risk
        
        high_severity = sum(1 for rf in risk_factors if rf['severity'] == 'High')
        moderate_severity = sum(1 for rf in risk_factors if rf['severity'] == 'Moderate')
        
        if high_severity >= 2 or (high_severity >= 1 and moderate_severity >= 2):
            return 2, 80.0  # High risk
        elif high_severity >= 1 or moderate_severity >= 2:
            return 1, 75.0  # Medium risk
        else:
            return 0, 80.0  # Low risk
    
    def _analyze_vital_signs(self, data):
        """Provide detailed vital signs analysis"""
        return {
            'blood_pressure': {
                'value': f"{data.get('blood_pressure_systolic', 0)}/{data.get('blood_pressure_diastolic', 0)} mmHg",
                'normal_range': '90-120/60-80 mmHg',
                'pregnancy_range': 'May normally increase slightly'
            },
            'blood_sugar': {
                'value': f"{data.get('blood_sugar', 0)} mg/dL",
                'fasting_normal': '70-95 mg/dL',
                'post_meal_normal': 'Less than 140 mg/dL (1hr) or 120 mg/dL (2hr)'
            },
            'temperature': {
                'value': f"{data.get('body_temperature', 0)}°F",
                'normal_range': '97-99°F'
            },
            'heart_rate': {
                'value': f"{data.get('heart_rate', 0)} bpm",
                'normal_range': '60-100 bpm',
                'pregnancy_note': 'May increase 10-20 bpm during pregnancy'
            }
        }
    
    def _generate_recommendations(self, prediction, risk_factors):
        """Generate recommendations based on risk level"""
        base_recommendations = [
            "Attend all scheduled prenatal appointments",
            "Take prescribed prenatal vitamins",
            "Stay hydrated and maintain balanced nutrition"
        ]
        
        if prediction == 0:  # Low risk
            return base_recommendations + [
                "Continue healthy lifestyle habits",
                "Engage in regular, moderate exercise as approved by your provider",
                "Get adequate rest and sleep"
            ]
        elif prediction == 1:  # Medium risk
            return [
                "Schedule more frequent prenatal check-ups",
                "Monitor blood pressure at home if recommended",
                "Maintain a pregnancy health diary",
                "Discuss risk factors with your healthcare provider",
                "Consider dietary modifications based on risk factors",
                "Reduce stress and prioritize rest"
            ]
        else:  # High risk
            return [
                "IMMEDIATE consultation with healthcare provider recommended",
                "You may need specialist referral (MFM - Maternal Fetal Medicine)",
                "Close monitoring and possible additional testing",
                "Strict adherence to medication regimen if prescribed",
                "Prepare for possibility of bed rest or modified activity",
                "Know warning signs that require emergency care",
                "Consider hospital proximity for delivery"
            ]
    
    def _get_lifestyle_advice(self, prediction, risk_factors):
        """Get lifestyle advice based on risk factors"""
        advice = {
            'nutrition': [
                "Eat a balanced diet rich in fruits, vegetables, and whole grains",
                "Include lean proteins and healthy fats",
                "Limit processed foods and added sugars"
            ],
            'exercise': [
                "30 minutes of moderate activity daily if approved",
                "Walking, swimming, and prenatal yoga are excellent options",
                "Avoid high-impact and contact sports"
            ],
            'rest': [
                "Aim for 7-9 hours of sleep nightly",
                "Rest on your left side to improve circulation",
                "Take breaks throughout the day"
            ]
        }
        
        # Add specific advice based on risk factors
        for rf in risk_factors:
            if 'Hypertension' in rf['factor']:
                advice['blood_pressure'] = [
                    "Reduce sodium intake",
                    "Avoid caffeine and stress",
                    "Monitor blood pressure regularly",
                    "Practice relaxation techniques"
                ]
            if 'Blood Sugar' in rf['factor']:
                advice['blood_sugar'] = [
                    "Follow a low-glycemic diet",
                    "Eat small, frequent meals",
                    "Monitor blood sugar as directed",
                    "Avoid sugary drinks and refined carbs"
                ]
        
        return advice
