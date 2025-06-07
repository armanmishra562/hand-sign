import torch
from torchvision import models, transforms
from PIL import Image
from fastapi import UploadFile
import io, json, os
from PIL import Image
from rembg import remove
from app.preprocessing import crop_to_hand, mild_blur

class RemoveBg:
    def __call__(self, img: Image.Image) -> Image.Image:
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        result = remove(buf.getvalue())
        return Image.open(io.BytesIO(result)).convert("RGB")
    
bg_remover = RemoveBg()


# Load label map
with open("models/label_map.json", "r") as f:
    label_map = json.load(f)
    label_map = {int(k): v for k, v in label_map.items()}

# Load GoogLeNet model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.googlenet(pretrained=False, aux_logits=False)
model.fc = torch.nn.Linear(model.fc.in_features, len(label_map))
model.load_state_dict(torch.load("models/googlenet_asl.pth", map_location=device))
model.eval()
model.to(device)

# Preprocessing pipeline (same as training)
transform = transforms.Compose([
    # 1) Auto-crop to hand contour
    transforms.Lambda(lambda img: crop_to_hand(img)),
    # 2) Mild blur to simulate real-world softness
    transforms.Lambda(lambda img: mild_blur(img)),
    # 2) Remove background
    transforms.Lambda(lambda img: bg_remover(img)),
    # 3) Resize / CenterCrop / ToTensor / Normalize
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Classification function
async def classify_image(file: UploadFile):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        _, predicted = torch.max(outputs, 1)
        label = label_map[predicted.item()]

    return { "prediction": label }
