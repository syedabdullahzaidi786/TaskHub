# Use Python 3.12 slim image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose the API port (Hugging Face Spaces expects 7860)
EXPOSE 7860

# Create a non-privileged user
RUN useradd -m -u 1000 user
USER user

# Start the application using uvicorn
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]
