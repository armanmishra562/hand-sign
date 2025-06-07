from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.inference import classify_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/api/health")
def health_check():
    return {"status": "OK", "service": "inference"}

@app.post("/api/image")
async def classify(file: UploadFile = File(...)):
    result = await classify_image(file)
    return result
