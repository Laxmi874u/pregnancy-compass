# PregAI Backend - Python Flask API

A complete backend API for the PregAI pregnancy health prediction application.

## Features

- 🔐 **User Authentication** - JWT-based authentication with signup/login
- 🧠 **Brain Tumor Prediction** - CNN-based analysis of MRI images
- 👶 **Fetal Health Prediction** - Random Forest classifier using CTG data
- 🤰 **Pregnancy Risk Assessment** - Health risk prediction based on vital signs
- 💬 **Pregnancy Chatbot** - Knowledge-based Q&A system
- 📊 **Prediction History** - Store and retrieve past predictions

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── models/
│   │   └── user.py          # Database models
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── prediction.py    # ML prediction endpoints
│   │   └── chatbot.py       # Chatbot endpoints
│   └── ml/
│       ├── brain_tumor.py   # Brain tumor predictor
│       ├── fetal_health.py  # Fetal health predictor
│       └── pregnancy_risk.py # Pregnancy risk predictor
├── data/
│   └── fetal_health.csv     # Fetal health training dataset
├── models/                   # Saved ML models (auto-generated)
├── uploads/                  # Temporary image uploads
├── config.py                # Configuration
├── requirements.txt         # Python dependencies
├── run.py                   # Entry point
└── README.md
```

## Installation

### Prerequisites
- Python 3.9 or higher
- pip (Python package manager)

### Setup Steps

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   
   Windows:
   ```bash
   venv\Scripts\activate
   ```
   
   macOS/Linux:
   ```bash
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create environment file**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

6. **Run the server**
   ```bash
   python run.py
   ```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update user profile |

### Predictions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/predict/brain-tumor` | Predict brain tumor from MRI |
| POST | `/api/predict/fetal-health` | Predict fetal health from CTG |
| POST | `/api/predict/pregnancy-risk` | Predict pregnancy risk |
| GET | `/api/predict/history` | Get prediction history |

### Chatbot

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chatbot/message` | Send message to chatbot |
| GET | `/api/chatbot/suggestions` | Get chat suggestions |

## Usage Examples

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "John Doe"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

### Fetal Health Prediction
```bash
curl -X POST http://localhost:5000/api/predict/fetal-health \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "baseline_value": 120,
    "accelerations": 0.0,
    "fetal_movement": 0.0,
    "uterine_contractions": 0.0,
    "light_decelerations": 0.0,
    "severe_decelerations": 0.0,
    "prolongued_decelerations": 0.0,
    "abnormal_short_term_variability": 73.0,
    "mean_value_of_short_term_variability": 0.5,
    "percentage_of_time_with_abnormal_long_term_variability": 43.0,
    "mean_value_of_long_term_variability": 2.4,
    "histogram_width": 64.0,
    "histogram_min": 62.0,
    "histogram_max": 126.0,
    "histogram_number_of_peaks": 2.0,
    "histogram_number_of_zeroes": 0.0,
    "histogram_mode": 120.0,
    "histogram_mean": 137.0,
    "histogram_median": 121.0,
    "histogram_variance": 73.0,
    "histogram_tendency": 1.0
  }'
```

## Machine Learning Models

### Brain Tumor Predictor
- **Model**: Convolutional Neural Network (CNN)
- **Input**: MRI brain scan images (224x224 RGB)
- **Output**: Tumor classification (No Tumor, Glioma, Meningioma, Pituitary)
- **Note**: Train with your own dataset for production use

### Fetal Health Predictor
- **Model**: Random Forest Classifier
- **Dataset**: UCI Fetal Health Classification (included)
- **Input**: 21 CTG (Cardiotocography) features
- **Output**: Health status (Normal, Suspect, Pathological)
- **Auto-training**: Model trains automatically on first run

### Pregnancy Risk Predictor
- **Model**: Random Forest Classifier
- **Input**: Maternal health indicators (age, BP, blood sugar, etc.)
- **Output**: Risk level (Low, Medium, High)
- **Trained on**: Synthetic data based on medical guidelines

## Training Your Own Brain Tumor Model

1. **Get dataset**: Download brain MRI dataset from Kaggle
2. **Prepare data**: Organize images into folders by class
3. **Train model**:

```python
import tensorflow as tf
from tensorflow.keras import layers, models

# Create CNN model
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(4, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train and save
model.fit(train_data, epochs=10, validation_data=val_data)
model.save('models/brain_tumor_model.h5')
```

## Connecting Frontend to Backend

Update your React frontend API calls:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

// Login
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Prediction with auth
const response = await fetch(`${API_BASE_URL}/predict/fetal-health`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(ctgData)
});
```

## Database

Default: SQLite (file-based, no setup required)

For production, configure MySQL or PostgreSQL in `.env`:
```
DATABASE_URL=mysql+pymysql://user:password@localhost/pregai_db
```

## Deployment

### Using Gunicorn (Production)
```bash
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app('production')"
```

### Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:create_app('production')"]
```

## Important Notes

⚠️ **Medical Disclaimer**: This is an AI-assisted tool for educational purposes. All predictions should be verified by qualified healthcare professionals. Do not use for actual medical diagnosis.

## License

MIT License - Free to use for educational and personal projects.
