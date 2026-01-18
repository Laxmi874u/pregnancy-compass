from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from app.models.user import PredictionHistory
from app.ml.brain_tumor import BrainTumorPredictor
from app.ml.fetal_health import FetalHealthPredictor
from app.ml.pregnancy_risk import PregnancyRiskPredictor
import os
import uuid

prediction_bp = Blueprint('prediction', __name__)

# Initialize predictors
brain_tumor_predictor = None
fetal_health_predictor = None
pregnancy_risk_predictor = None

def get_brain_tumor_predictor():
    global brain_tumor_predictor
    if brain_tumor_predictor is None:
        brain_tumor_predictor = BrainTumorPredictor()
    return brain_tumor_predictor

def get_fetal_health_predictor():
    global fetal_health_predictor
    if fetal_health_predictor is None:
        fetal_health_predictor = FetalHealthPredictor()
    return fetal_health_predictor

def get_pregnancy_risk_predictor():
    global pregnancy_risk_predictor
    if pregnancy_risk_predictor is None:
        pregnancy_risk_predictor = PregnancyRiskPredictor()
    return pregnancy_risk_predictor

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@prediction_bp.route('/brain-tumor', methods=['POST'])
@jwt_required()
def predict_brain_tumor():
    """Predict brain tumor from MRI image"""
    try:
        user_id = get_jwt_identity()
        
        # Check if image file is provided
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload PNG, JPG, or JPEG'}), 400
        
        # Save the file
        filename = secure_filename(f"{uuid.uuid4()}_{file.filename}")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Get additional patient data
        patient_data = {
            'age': request.form.get('age', type=int),
            'gestational_week': request.form.get('gestationalWeek', type=int),
            'symptoms': request.form.get('symptoms', ''),
            'medical_history': request.form.get('medicalHistory', '')
        }
        
        # Make prediction
        predictor = get_brain_tumor_predictor()
        result = predictor.predict(filepath, patient_data)
        
        # Save to history
        history = PredictionHistory(
            user_id=user_id,
            prediction_type='brain_tumor',
            input_data=patient_data,
            result=result,
            confidence=result.get('confidence', 0)
        )
        db.session.add(history)
        db.session.commit()
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prediction_bp.route('/fetal-health', methods=['POST'])
@jwt_required()
def predict_fetal_health():
    """Predict fetal health from CTG data"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
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
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Make prediction
        predictor = get_fetal_health_predictor()
        result = predictor.predict(data)
        
        # Save to history
        history = PredictionHistory(
            user_id=user_id,
            prediction_type='fetal_health',
            input_data=data,
            result=result,
            confidence=result.get('confidence', 0)
        )
        db.session.add(history)
        db.session.commit()
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prediction_bp.route('/pregnancy-risk', methods=['POST'])
@jwt_required()
def predict_pregnancy_risk():
    """Predict pregnancy difficulty/risk"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['age', 'blood_pressure_systolic', 'blood_pressure_diastolic',
                          'blood_sugar', 'body_temperature', 'heart_rate']
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Make prediction
        predictor = get_pregnancy_risk_predictor()
        result = predictor.predict(data)
        
        # Save to history
        history = PredictionHistory(
            user_id=user_id,
            prediction_type='pregnancy_risk',
            input_data=data,
            result=result,
            confidence=result.get('confidence', 0)
        )
        db.session.add(history)
        db.session.commit()
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@prediction_bp.route('/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    """Get user's prediction history"""
    try:
        user_id = get_jwt_identity()
        prediction_type = request.args.get('type')
        
        query = PredictionHistory.query.filter_by(user_id=user_id)
        
        if prediction_type:
            query = query.filter_by(prediction_type=prediction_type)
        
        history = query.order_by(PredictionHistory.created_at.desc()).limit(50).all()
        
        return jsonify({
            'history': [h.to_dict() for h in history]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
