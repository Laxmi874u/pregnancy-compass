from app import db
from datetime import datetime
import bcrypt

class User(db.Model):
    """User model for authentication"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    avatar_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    predictions = db.relationship('PredictionHistory', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Verify password"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'avatarUrl': self.avatar_url,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

class PredictionHistory(db.Model):
    """Store prediction history for users"""
    __tablename__ = 'prediction_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    prediction_type = db.Column(db.String(50), nullable=False)  # 'brain_tumor', 'fetal_health', 'pregnancy_risk'
    input_data = db.Column(db.JSON, nullable=True)
    result = db.Column(db.JSON, nullable=False)
    confidence = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'predictionType': self.prediction_type,
            'inputData': self.input_data,
            'result': self.result,
            'confidence': self.confidence,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
