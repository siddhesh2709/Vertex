"""Local inference worker for the crop disease model.

Binds to 127.0.0.1 only and is called server-to-server by the Express API,
which owns authentication. It is never reachable from the browser.

Run:  python backend/ml/serve.py [port]
"""
import json
import io
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

import torch
from PIL import Image
from torchvision import transforms

HERE = Path(__file__).parent
MODEL_DIR = HERE.parent / "model"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5001

meta = json.loads((MODEL_DIR / "model_meta.json").read_text())
CLASSES = meta["classes"]
IMG_SIZE = meta["imgSize"]

model = torch.jit.load(str(MODEL_DIR / "plant_disease.ts.pt"), map_location="cpu")
model.eval()
torch.set_num_threads(2)

preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(meta["mean"], meta["std"]),
])


def predict(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    tensor = preprocess(image).unsqueeze(0)
    with torch.no_grad():
        probs = torch.softmax(model(tensor)[0], dim=0)
    ranked = sorted(
        ({"className": CLASSES[i], "probability": float(p)} for i, p in enumerate(probs)),
        key=lambda r: r["probability"],
        reverse=True,
    )
    return {"top": ranked[0], "ranked": ranked[:5]}


class Handler(BaseHTTPRequestHandler):
    def _send(self, code, payload):
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/health":
            self._send(200, {
                "status": "ok",
                "classes": len(CLASSES),
                "testAccuracy": meta["metrics"]["testAccuracy"],
                "architecture": meta["metrics"]["architecture"],
            })
        else:
            self._send(404, {"error": "not found"})

    def do_POST(self):
        if self.path != "/predict":
            self._send(404, {"error": "not found"})
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            if length <= 0:
                self._send(400, {"error": "empty body"})
                return
            self._send(200, predict(self.rfile.read(length)))
        except Exception as exc:  # noqa: BLE001 - surface any failure to the caller
            self._send(500, {"error": str(exc)})

    def log_message(self, fmt, *args):
        pass  # keep the Express log readable


if __name__ == "__main__":
    print(f"disease model worker listening on 127.0.0.1:{PORT} "
          f"({len(CLASSES)} classes, test acc {meta['metrics']['testAccuracy']})", flush=True)
    HTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
