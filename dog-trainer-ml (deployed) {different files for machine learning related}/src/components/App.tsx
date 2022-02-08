import React, {useCallback, useEffect, useState} from 'react';
import Camera from './camera/Camera';
import Prediction from './prediction/Prediction';
import ImageSelectorButton from './staticImage/ImageSelectorButton';
import StaticImage from './staticImage/StaticImage';

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import ModelWorker from "workerize-loader!../model/worker";

// create our web worker instance for running the tfjs model without blocking the UI thread
const modelWorker = ModelWorker();
const modelWorker2 = ModelWorker();
// the filepaths to our exported signature.json and model.json files (in the public/model folder)
const signatureFile = process.env.PUBLIC_URL + `/model/emotion/signature.json`;
const modelFile = process.env.PUBLIC_URL + `/model/emotion/model.json`;

const signatureFile2 = process.env.PUBLIC_URL + `/model/posture/signature.json`;
const modelFile2 = process.env.PUBLIC_URL + `/model/posture/model.json`;


function App() {
    // state for keeping track of our predictions -- map of {label: confidence} from running the model on an image
    const [predictions, setPredictions] = useState<{[key: string]: number} | undefined>(undefined);
    // state for using a static image from file picker
    const [imageFile, setImageFile] = useState<File | null>(null);
    // state for keeping track of our predictions -- map of {label: confidence} from running the model on an image
    const [predictions2, setPredictions2] = useState<{[key: string]: number} | undefined>(undefined);

    // useEffect callback to load our model
    useEffect(() => {
        modelWorker.loadModel(signatureFile, modelFile);
        modelWorker2.loadModel(signatureFile2, modelFile2);
        
        document.querySelectorAll('.prediction-container')[0].classList.add('sus');
        return () => {
            modelWorker.disposeModel();
            modelWorker2.disposeModel();
        };

    }, []);

    // function to run the image from an html canvas element through our model
    const predictCanvas = useCallback((canvas: HTMLCanvasElement) => {
        // get the canvas context
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // get the pixel data from the full canvas
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // run the async predict function and set the values to our state
            modelWorker.predict(imageData).then((results: {Confidences: {[label: string]: number}}) => {
                if (results) {
                    setPredictions(results.Confidences);
                }
            });

            modelWorker2.predict(imageData).then((results: {Confidences: {[label: string]: number}}) => {
                if (results) {
                    setPredictions2(results.Confidences);
                }
            });
        }
    }, []);

    return (
        <div style={{position: 'relative'}}>
            <ImageSelectorButton setImageFile={setImageFile} imageFile={imageFile} />
            {
                !imageFile ? 
                <Camera predictCanvas={predictCanvas} predictions={predictions} /> :
                <StaticImage predictCanvas={predictCanvas} image={imageFile} setImageFile={setImageFile} />
            }
            <Prediction predictions={predictions}/>
            <Prediction predictions={predictions2}/>
        </div>
    );
}

export default App;
