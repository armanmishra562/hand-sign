import cv2
import numpy as np
from PIL import Image
from PIL import ImageFilter

def mild_blur(pil_img: Image.Image) -> Image.Image:
    return pil_img.filter(ImageFilter.GaussianBlur(radius=1))


def crop_to_hand(pil_img: Image.Image) -> Image.Image:
    # Convert PIL image to OpenCV BGR array
    arr = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(arr, cv2.COLOR_BGR2GRAY)
    # Threshold to isolate hand (white bg → darker hand)
    _, thresh = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
    # Find contours
    cnts, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if not cnts:
        return pil_img
    # Take the largest contour
    c = max(cnts, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(c)
    cropped = arr[y : y + h, x : x + w]
    # Convert back to PIL RGB
    cropped_rgb = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB)
    return Image.fromarray(cropped_rgb)
