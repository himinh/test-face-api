// face.service.ts
import { Injectable } from '@nestjs/common';
import * as faceapi from 'face-api.js';

import canvas, { Image, loadImage } from 'canvas';

import { join } from 'path';
import { readFileSync } from 'fs';
const modelPath = join(process.cwd(), 'public', 'models');

async function LoadModels() {
  // Load the models
  // __dirname gives the root directory of the server
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
}

@Injectable()
export class FaceService {
  constructor() {}

  async uploadLabeledImages(imagePath: string, label: string) {
    await LoadModels();

    try {
      const descriptions = [];
      // const img = await faceapi.fetchImage(imagePath);
      const img = new Image();
      img.src = readFileSync(imagePath);

      img.onload = () => {
        console.log('Image loaded successfully');
      };
      const newPath: any = await loadImage(imagePath);
      const detections = await faceapi
        .detectSingleFace(newPath)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections?.descriptor) {
        descriptions.push(detections.descriptor);
      }

      console.log({
        label,
        descriptions,
      });

      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async detectFace(imagePath: string) {
    this.uploadLabeledImages(join(process.cwd(), 'public', 'b.png'), 'new');

    // const MODEL_URL = join(process.cwd(), 'src', 'route', 'app');
    // // Load models (you might need to adjust the paths)
    // faceapi.nets.faceRecognitionNet.loadFromUri(
    //   join(MODEL_URL, 'face_recognition'),
    // );
    // faceapi.nets.faceLandmark68Net.loadFromUri(
    //   join(MODEL_URL, 'face_landmark_68'),
    // );
    // faceapi.nets.ssdMobilenetv1.loadFromUri(join(MODEL_URL, 'ssd_mobilenetv1'));

    // // Load image
    // const img = await faceapi.fetchImage(imagePath);

    // // Detect face
    // const detections = await faceapi
    //   .detectAllFaces(img)
    //   .withFaceLandmarks()
    //   .withFaceDescriptors();

    // // Return detected faces
    // return detections;
  }
}
