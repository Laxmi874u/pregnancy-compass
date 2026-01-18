# PregAI Backend Setup Guide

Complete step-by-step instructions to run the PregAI backend in VS Code.

## Prerequisites

1. **Python 3.9+** - Download from https://www.python.org/downloads/
2. **VS Code** - Download from https://code.visualstudio.com/
3. **VS Code Python Extension** - Install from VS Code Extensions marketplace

## Step-by-Step Setup

### Step 1: Open Backend Folder in VS Code

1. Open VS Code
2. Go to `File` → `Open Folder`
3. Navigate to and select the `backend` folder
4. Click `Select Folder`

### Step 2: Create Virtual Environment

Open the terminal in VS Code (`Ctrl + `` ` or `View → Terminal`) and run:

**Windows (PowerShell):**
```powershell
python -m venv venv
```

**Windows (Command Prompt):**
```cmd
python -m venv venv
```

**macOS/Linux:**
```bash
python3 -m venv venv
```

### Step 3: Activate Virtual Environment

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

If you get an execution policy error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal line.

### Step 4: Install Dependencies

With the virtual environment activated, run:

```bash
pip install -r requirements.txt
```

This may take a few minutes as it installs TensorFlow and other packages.

### Step 5: Create Environment File

Copy the example environment file:

**Windows:**
```cmd
copy .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

### Step 6: Run the Server

```bash
python run.py
```

You should see:
```
============================================================
  PregAI Backend Server
============================================================
  Starting development server...
  API Base URL: http://localhost:5000/api
  ...
============================================================
 * Running on http://0.0.0.0:5000
```

### Step 7: Test the API

Open a new terminal and test:

```bash
curl http://localhost:5000/api/chatbot/suggestions
```

Or open in browser: http://localhost:5000/api/chatbot/suggestions

## Connecting React Frontend

Update your React app to connect to the Flask backend:

1. Create `src/config/api.ts`:
```typescript
export const API_BASE_URL = 'http://localhost:5000/api';
```

2. Update API calls in your components to use the backend.

## Troubleshooting

### "python is not recognized"
- Make sure Python is installed and added to PATH
- Try `python3` instead of `python`

### "pip is not recognized"
- Use `python -m pip install -r requirements.txt`

### Permission denied on Windows
- Run PowerShell as Administrator
- Or use Command Prompt instead

### TensorFlow installation issues
If TensorFlow fails to install:
```bash
pip install tensorflow-cpu
```

### Port 5000 already in use
Change the port in `run.py`:
```python
app.run(host='0.0.0.0', port=5001, debug=True)
```

## Dataset Downloads

### Fetal Health Dataset
Already included in `data/fetal_health.csv`

### Brain Tumor Dataset (Optional)
1. Go to: https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset
2. Download and extract to `brain_tumor_dataset/` folder
3. Run: `python train_brain_tumor_model.py`

## Running Both Frontend and Backend

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   source venv/bin/activate  # or .\venv\Scripts\activate on Windows
   python run.py
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend  # or your React app folder
   npm run dev
   ```

Now your React app at `http://localhost:5173` can communicate with Flask at `http://localhost:5000`.

## Production Deployment

For production, use Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 "app:create_app('production')"
```
