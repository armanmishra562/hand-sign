from fastapi import UploadFile
import uuid

async def classify_image(file: UploadFile):
    filename = f"{uuid.uuid4()}.jpg"
    contents = await file.read()
    with open(filename, "wb") as f:
        f.write(contents)
    
    # TODO: preprocessing, model loading, prediction
    return {
        "prediction": "A",
        "filename": filename
    }
