const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

async function simpanData(data) {
  try {
    const docRef = firestore.collection('predictions').doc(data.id);
    await docRef.set({
      id: data.id,
      result: data.result,
      suggestion: data.suggestion,
      createdAt: data.createdAt
    });
    console.log('Data successfully saved to Firestore');
  } catch (error) {
    console.error('Error saving data to Firestore:', error);
    throw new Error('Failed to save data to Firestore');
  }
}

module.exports = simpanData;