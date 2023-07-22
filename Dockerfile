# Use the official PyTorch base image from Docker Hub
FROM pytorch/pytorch:latest

# Install additional Python packages using pip:
RUN pip install ultralytics


# Copy Python files to the container
COPY ../model-training /workspace