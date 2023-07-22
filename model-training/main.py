from ultralytics import YOLO

# Load a model
model = YOLO("yolov8x.yaml")  # build a new model from scratch

# Use the model
model.train(data="datasets/data.yaml", epochs=10)  # train the model
model.export(format="onnx")  # export the model to ONNX format
