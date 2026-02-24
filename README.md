# AgriScan - Plant Disease Diagnosis System

AgriScan is a Computer Vision operational system designed to diagnose plant diseases from leaf images. It utilizes Transfer Learning (MobileNetV2/ResNet50) on the PlantVillage dataset and exposes the model via a fast and efficient FastAPI backend.

## Features

- **Plant Disease Diagnosis**: Detects 38 different plant disease classes.
- **Treatment Recommendations**: Provides actionable advice for treating detected diseases.
- **REST API**: Simple `POST /predict` endpoint for easy integration.
- **Transfer Learning**: Uses pre-trained MobileNetV2 for efficiency (or ResNet50 for accuracy).

## Project Structure

```
agriscan/
├── data/                   # Dataset directory (managed by TFDS)
├── models/                 # Saved models and class indices
├── src/
│   ├── api/                # FastAPI application
│   │   ├── main.py         # Entry point
│   │   └── schemas.py      # Pydantic models
│   ├── model/              # Model training logic
│   │   ├── train.py        # Training script
│   │   └── dataset.py      # Data loading pipeline
│   └── utils/              # Helper functions
│       └── treatment.py    # Treatment advice logic
├── tests/                  # Unit tests
└── requirements.txt        # Dependencies
```

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Prepare Dataset**:
   The system uses TensorFlow Datasets (TFDS) to download the 'plant_village' dataset automatically on first run/training.

## Training

To train the model:

```bash
python src/model/train.py --epochs 10 --batch_size 32 --model mobilenetv2
```

Arguments:
- `--epochs`: Number of training epochs (default: 10).
- `--model`: Architecture to use (`mobilenetv2` or `resnet50`).
- `--data_dir`: Directory to store dataset (default: `../../data` relative).
- `--output_dir`: Directory to save model (default: `../../models` relative).

## Running the API

Start the FastAPI server:

```bash
cd src/api
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

## API Documentation

- **Swagger UI**: Visit `http://localhost:8000/docs` to test endpoints interactively.
- **Endpoint**: `POST /predict`
  - **Input**: Image file (multipart/form-data).
  - **Output**: JSON with plant name, disease, confidence, and treatment.

## Testing

Run unit tests:

```bash
pytest tests/
```
