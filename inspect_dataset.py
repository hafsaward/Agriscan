import tensorflow_datasets as tfds
import os

# Load the PlantVillage dataset
try:
    dataset, info = tfds.load('plant_village', with_info=True, data_dir='data')
    # Display dataset information
    print(info)
except Exception as e:
    print(f"Error: {e}")
