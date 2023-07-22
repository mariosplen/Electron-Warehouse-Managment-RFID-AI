# Use the official PyTorch base image from Docker Hub
FROM pytorch/pytorch:latest

# Install additional packages:
RUN pip install ultralytics
RUN pip install tensorflowjs
RUN apt-get install -y libgl1
RUN apt-get install -y libglib2.0.0
#apt-get -y install libusb-1.0-0-dev


# Copy Python files to the container
COPY model-training /workspace