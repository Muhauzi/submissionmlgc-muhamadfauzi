const predictClassification = require("../services/inferenceService");
const simpanData = require("../services/simpanData");
const getRiwayat = require("../services/getRiwayat");
const crypto = require("crypto");

const postPredictHandler = async (request, h) => {
  try {
    const { image } = request.payload;

    if (!image || !image._data) {
      throw new Error("Gambar tidak ditemukan dalam payload");
    }

    console.log("Tipe gambar:", typeof image);
    console.log("Detail gambar:", image.hapi.filename);

    const id = crypto.randomUUID();
    const model = request.server.app.model;

    // Pastikan data gambar dalam format buffer
    const buffer = image._data;
    console.log("Ukuran buffer:", buffer.length);

    const { confidenceScore, label, explanation, suggestion } =
      await predictClassification(model, buffer);

    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      explanation: explanation,
      suggestion: suggestion,
      confidenceScore: confidenceScore,
      createdAt: createdAt,
    };

    await simpanData(data);

    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data: {
        id: data.id,
        result: data.result,
        suggestion: data.suggestion,
        createdAt: data.createdAt,
      },
    });
    response.code(201);

    return response;
  } catch (error) {
    console.error("Error pada prediksi:", error.message);
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
    response.code(400);
    return response;
  }
};

const getRiwayatHandler = async (request, h) => {
  try {
    const histories = await getRiwayat();
    const response = h.response({
      status: "success",
      data: histories,
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: "fail",
      message: "Terjadi kesalahan dalam mengambil data riwayat prediksi",
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  postPredictHandler,
  getRiwayatHandler,
};
