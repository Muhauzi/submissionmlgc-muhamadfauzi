const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        const tensor = tf.node
            .decodeJpeg(image, 3) 
            .resizeNearestNeighbor([224, 224]) 
            .expandDims()
            .toFloat();

        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = score[0] * 100; 

        
        const label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';

        let explanation, suggestion;

        if (label === 'Cancer') {
            explanation = "Segera periksa ke dokter!";
            suggestion = "Segera konsultasi dengan dokter terdekat untuk mengetahui detail terkait tingkat bahaya penyakit.";
            
        } else {
            explanation = "Penyakit kanker tidak terdeteksi.";
            suggestion = "Tetap jaga kesehatan dan lakukan pemeriksaan rutin.";
        }

        return { confidenceScore, label, explanation, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;