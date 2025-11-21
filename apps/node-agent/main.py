"""
@file main.py
@description Node Agent - FastAPI service for executing LLM and OCR tasks
"""

import os
import time
import hashlib
import json
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
import httpx
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from starlette.responses import Response

# ============ Configuration ============

class Settings(BaseSettings):
    node_id: str = Field(default="node-1", env="NODE_AGENT_ID")
    port: int = Field(default=8001, env="NODE_AGENT_PORT")
    ollama_host: str = Field(default="http://localhost:11434", env="OLLAMA_HOST")
    ollama_model: str = Field(default="llama3:8b", env="OLLAMA_MODEL")
    region: str = Field(default="us-east-1", env="NODE_AGENT_REGION")
    stake: str = Field(default="1000000000000000000", env="NODE_AGENT_STAKE")
    
    class Config:
        env_file = ".env"

settings = Settings()

# ============ Metrics ============

task_counter = Counter("node_tasks_total", "Total tasks executed", ["type", "status"])
task_latency = Histogram("node_task_latency_seconds", "Task execution latency", ["type"])

# ============ FastAPI App ============

app = FastAPI(title="EdgeNet Node Agent", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============ Models ============

class TaskRequest(BaseModel):
    taskId: str
    payload: str
    modelId: Optional[str] = None

class TaskResponse(BaseModel):
    output: str
    outputHash: str
    latencyMs: int
    modelHash: str
    telemetry: dict

# ============ Helper Functions ============

def hash_string(s: str) -> str:
    """SHA256 hash of string"""
    return hashlib.sha256(s.encode()).hexdigest()

def hash_model(model_id: str) -> str:
    """Hash model identifier"""
    return hash_string(model_id)

async def call_ollama(prompt: str, model: str) -> str:
    """Call Ollama API for LLM inference"""
    async with httpx.AsyncClient(timeout=300.0) as client:
        response = await client.post(
            f"{settings.ollama_host}/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
            },
        )
        response.raise_for_status()
        result = response.json()
        return result.get("response", "")

def ocr_image(image_data: str) -> str:
    """
    OCR image using PaddleOCR or rapidocr
    For MVP, we'll use a simple placeholder
    In production, use: from paddleocr import PaddleOCR
    """
    # TODO: Implement actual OCR
    # For MVP, return placeholder
    return "OCR_TEXT_PLACEHOLDER"

# ============ Routes ============

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "nodeId": settings.node_id,
        "region": settings.region,
    }

@app.get("/metrics")
async def metrics():
    """Prometheus metrics"""
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/exec/llm-summary", response_model=TaskResponse)
async def exec_llm_summary(request: TaskRequest):
    """
    Execute LLM summarization task
    """
    start_time = time.time()
    model_id = request.modelId or settings.ollama_model
    
    try:
        # Prepare prompt
        prompt = f"Summarize the following text in 2-3 sentences:\n\n{request.payload}"
        
        # Call Ollama
        output = await call_ollama(prompt, model_id)
        
        # Calculate metrics
        latency_ms = int((time.time() - start_time) * 1000)
        output_hash = hash_string(output)
        model_hash = hash_model(model_id)
        
        # Record metrics
        task_counter.labels(type="llm_summary", status="success").inc()
        task_latency.labels(type="llm_summary").observe(latency_ms / 1000.0)
        
        return TaskResponse(
            output=output,
            outputHash=output_hash,
            latencyMs=latency_ms,
            modelHash=model_hash,
            telemetry={
                "model": model_id,
                "inputLength": len(request.payload),
                "outputLength": len(output),
            },
        )
    except Exception as e:
        task_counter.labels(type="llm_summary", status="error").inc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/exec/ocr-image", response_model=TaskResponse)
async def exec_ocr_image(request: TaskRequest):
    """
    Execute OCR task on image
    """
    start_time = time.time()
    
    try:
        # Decode base64 image
        import base64
        image_bytes = base64.b64decode(request.payload)
        
        # Perform OCR (placeholder for MVP)
        output = ocr_image(request.payload)
        
        # Calculate metrics
        latency_ms = int((time.time() - start_time) * 1000)
        output_hash = hash_string(output)
        model_hash = hash_string("paddleocr")
        
        # Record metrics
        task_counter.labels(type="ocr_image", status="success").inc()
        task_latency.labels(type="ocr_image").observe(latency_ms / 1000.0)
        
        return TaskResponse(
            output=output,
            outputHash=output_hash,
            latencyMs=latency_ms,
            modelHash=model_hash,
            telemetry={
                "model": "paddleocr",
                "imageSize": len(image_bytes),
                "outputLength": len(output),
            },
        )
    except Exception as e:
        task_counter.labels(type="ocr_image", status="error").inc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.port)

