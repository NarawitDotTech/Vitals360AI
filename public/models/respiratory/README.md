# Respiratory Analysis Model

This directory should contain the ONNX model for respiratory sound analysis.

## Required File

- **Filename**: `ast-icbhi-int8.onnx`
- **Size**: 86.6 MB
- **Model**: Audio Spectrogram Transformer (AST) trained on ICBHI 2017 dataset
- **Format**: ONNX (quantized to INT8)

## Installation

Place the model file in this directory:

```
public/models/respiratory/ast-icbhi-int8.onnx
```

The application will check for this file on the respiratory analysis page. If the model is not found, users will see an error message with instructions.

## Model Details

- **Input**: Mel spectrogram (128 bins × time steps)
- **Output**: 4-class classification (Normal, Crackles, Wheezes, Both)
- **Inference**: Runs entirely in browser via ONNX Runtime Web (WebAssembly)

## Note

This file is excluded from version control (see `.gitignore`) due to its large size. Each deployment must add the model file manually.
