// import script in worker file
importScripts("ort.min.js");


onmessage = async (event) => {
    const input = event.data;
    const output = await run_model(input);
    postMessage(output);
}

async function run_model(input) {

    const model = await ort.InferenceSession.create("./boxes_model.onnx");
    input = new ort.Tensor(Float32Array.from(input), [1, 3, 640, 640]);
    const outputs = await model.run({images: input});
    return outputs["output0"].data;
}
