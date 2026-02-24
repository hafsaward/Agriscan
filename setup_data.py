import shutil
import os
import pathlib

def setup_data():
    base_dir = pathlib.Path("data")
    extracted_dir = base_dir / "downloads" / "extracted"
    target_dir = base_dir / "plant_village_raw"
    
    if target_dir.exists():
        print(f"Target directory {target_dir} already exists. Skipping move.")
        return

    # Find the source folder
    found = list(extracted_dir.glob("**/Plant_leave_diseases_dataset_without_augmentation"))
    if not found:
        print("Could not find dataset folder in extracted cache.")
        return
        
    source = found[0]
    print(f"Found source: {source}")
    print(f"Moving to: {target_dir}")
    
    try:
        shutil.move(str(source), str(target_dir))
        print("Move completed successfully.")
    except Exception as e:
        print(f"Error moving files: {e}")

if __name__ == "__main__":
    setup_data()
