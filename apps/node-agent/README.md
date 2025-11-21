# Node Agent

Python FastAPI service for executing LLM and OCR inference tasks.

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt
```

## Configuration

Set environment variables (see `.env.example`):
- `NODE_AGENT_ID`: Unique node identifier
- `NODE_AGENT_PORT`: Port to run on (default: 8001)
- `OLLAMA_HOST`: Ollama service URL
- `OLLAMA_MODEL`: Model to use (default: llama3:8b)

## Run

```bash
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8001
```

## Endpoints

- `POST /exec/llm-summary`: Execute LLM summarization
- `POST /exec/ocr-image`: Execute OCR on image
- `GET /health`: Health check
- `GET /metrics`: Prometheus metrics

