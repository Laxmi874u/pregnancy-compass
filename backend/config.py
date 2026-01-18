import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-in-production'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///pregai.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload folder for images
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    
    # Model paths
    BRAIN_TUMOR_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'brain_tumor_model.h5')
    FETAL_HEALTH_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'fetal_health_model.pkl')
    PREGNANCY_RISK_MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'pregnancy_risk_model.pkl')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
