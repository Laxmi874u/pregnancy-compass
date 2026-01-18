"""
PregAI Backend Server
Run this file to start the Flask development server
"""

from app import create_app

app = create_app('development')

if __name__ == '__main__':
    print("=" * 60)
    print("  PregAI Backend Server")
    print("=" * 60)
    print("  Starting development server...")
    print("  API Base URL: http://localhost:5000/api")
    print("  ")
    print("  Available Endpoints:")
    print("  - POST /api/auth/signup       - Register new user")
    print("  - POST /api/auth/login        - Login user")
    print("  - GET  /api/auth/me           - Get current user")
    print("  - POST /api/predict/brain-tumor     - Brain tumor prediction")
    print("  - POST /api/predict/fetal-health    - Fetal health prediction")
    print("  - POST /api/predict/pregnancy-risk  - Pregnancy risk prediction")
    print("  - POST /api/chatbot/message         - Chatbot message")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True)
