"""
Brain Tumor Model Training Script

This script trains a CNN model for brain tumor classification.
You need to download a brain tumor dataset and organize it properly.

Dataset sources:
1. Kaggle Brain Tumor MRI Dataset:
   https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset

2. Kaggle Brain Tumor Classification:
   https://www.kaggle.com/datasets/sartajbhuvaji/brain-tumor-classification-mri

Dataset structure:
brain_tumor_dataset/
├── Training/
│   ├── glioma/
│   ├── meningioma/
│   ├── notumor/
│   └── pituitary/
└── Testing/
    ├── glioma/
    ├── meningioma/
    ├── notumor/
    └── pituitary/

Usage:
1. Download dataset from Kaggle
2. Extract to 'brain_tumor_dataset' folder
3. Run: python train_brain_tumor_model.py
"""

import os
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
import matplotlib.pyplot as plt

# Configuration
DATASET_PATH = 'brain_tumor_dataset'
MODEL_SAVE_PATH = 'models/brain_tumor_model.h5'
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 20

def create_model():
    """Create CNN model for brain tumor classification"""
    
    # Use transfer learning with MobileNetV2
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers
    base_model.trainable = False
    
    # Create new model
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(4, activation='softmax')  # 4 classes
    ])
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

def train_model():
    """Train the brain tumor classification model"""
    
    # Check if dataset exists
    train_dir = os.path.join(DATASET_PATH, 'Training')
    test_dir = os.path.join(DATASET_PATH, 'Testing')
    
    if not os.path.exists(train_dir):
        print(f"Error: Training data not found at {train_dir}")
        print("\nPlease download the brain tumor dataset from Kaggle:")
        print("https://www.kaggle.com/datasets/masoudnickparvar/brain-tumor-mri-dataset")
        print("\nExtract it to 'brain_tumor_dataset' folder with this structure:")
        print("brain_tumor_dataset/")
        print("├── Training/")
        print("│   ├── glioma/")
        print("│   ├── meningioma/")
        print("│   ├── notumor/")
        print("│   └── pituitary/")
        print("└── Testing/")
        print("    └── ...")
        return
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2
    )
    
    test_datagen = ImageDataGenerator(rescale=1./255)
    
    # Load training data
    print("Loading training data...")
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training'
    )
    
    # Load validation data
    print("Loading validation data...")
    validation_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'
    )
    
    # Load test data
    print("Loading test data...")
    test_generator = test_datagen.flow_from_directory(
        test_dir,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    # Print class indices
    print("\nClass indices:", train_generator.class_indices)
    
    # Create model
    print("\nCreating model...")
    model = create_model()
    model.summary()
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Callbacks
    checkpoint = ModelCheckpoint(
        MODEL_SAVE_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )
    
    early_stopping = EarlyStopping(
        monitor='val_accuracy',
        patience=5,
        restore_best_weights=True,
        verbose=1
    )
    
    # Train model
    print("\nTraining model...")
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=validation_generator,
        callbacks=[checkpoint, early_stopping],
        verbose=1
    )
    
    # Evaluate on test set
    print("\nEvaluating on test set...")
    test_loss, test_accuracy = model.evaluate(test_generator, verbose=1)
    print(f"\nTest Accuracy: {test_accuracy:.2%}")
    print(f"Test Loss: {test_loss:.4f}")
    
    # Save final model
    model.save(MODEL_SAVE_PATH)
    print(f"\nModel saved to {MODEL_SAVE_PATH}")
    
    # Plot training history
    plot_history(history)
    
    return model, history

def plot_history(history):
    """Plot training history"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    
    # Accuracy
    ax1.plot(history.history['accuracy'], label='Training')
    ax1.plot(history.history['val_accuracy'], label='Validation')
    ax1.set_title('Model Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.set_ylabel('Accuracy')
    ax1.legend()
    
    # Loss
    ax2.plot(history.history['loss'], label='Training')
    ax2.plot(history.history['val_loss'], label='Validation')
    ax2.set_title('Model Loss')
    ax2.set_xlabel('Epoch')
    ax2.set_ylabel('Loss')
    ax2.legend()
    
    plt.tight_layout()
    plt.savefig('models/training_history.png')
    print("Training history plot saved to models/training_history.png")
    plt.show()

if __name__ == '__main__':
    print("=" * 60)
    print("  Brain Tumor Classification Model Training")
    print("=" * 60)
    train_model()
