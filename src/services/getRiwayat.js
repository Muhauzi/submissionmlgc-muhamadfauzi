const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

async function getRiwayat() {
    const snapshot = await firestore.collection('predictions').get();
    const histories = [];
    snapshot.forEach(doc => {
      histories.push({
        id: doc.id,
        history: doc.data()
      });
    });
    return histories;
  }
  
  module.exports = getRiwayat;