const { db } = require('../utilities/admin');
const { validateNetworthForm } = require('../utilities/validators');

exports.getNetworthHistory = (req, res) => {
  db.collection('networth')
    .get()
    .then(data => {
      let networthHistory = [];
      data.forEach(doc => {
        if (doc.data().user === req.user.uid) {
          networthHistory.push({
            snapshotId: doc.id,
            date: doc.data().date,
            networth: doc.data().networth,
            notes: doc.data().notes,
            user: doc.data().user
          });
        }
      });
      return res.json(networthHistory);
    })
    .catch(err => console.error(err));
};

exports.getNetworth = (req, res) => {
  let networthData = {};
  db.doc(`/networth/${req.params.snapshotId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Networth entry not found' });
      }
      networthData = doc.data();
      networthData.snapshotId = doc.id;
      return db
        .collection('networth')
        .where('snapshotId', '==', req.params.snapshotId)
        .get();
    })
    .then(() => {
      return res.json(networthData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.addNetworth = (req, res) => {
  const newSnapshot = {
    date: req.body.date,
    networth: req.body.networth,
    notes: req.body.notes,
    user: req.user.uid
  };

  const { valid, snapshotErrors } = validateNetworthForm(newSnapshot);
  if (!valid) return res.status(400).json(snapshotErrors);

  db.collection('networth')
    .add(newSnapshot)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: 'something went wrong' });
      console.error(err);
    });
};

exports.deleteNetworth = (req, res) => {
  const document = db.doc(`/networth/${req.params.snapshotId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Networth entry not found' });
      }
      if (doc.data().uid !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'Networth entry deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.updateNetworth = (req, res) => {
  const updateSnapshot = {
    date: req.body.date,
    networth: req.body.networth,
    notes: req.body.notes,
  };

  const { valid, snapshotErrors } = validateNetworthForm(updateSnapshot);
  if (!valid) return res.status(400).json(snapshotErrors);

  const document = db.doc(`/networth/${req.params.snapshotId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'Networth entry not found' });
      }
      if (doc.data().uid !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.update(updateSnapshot);
      }
    })
    .then(() => {
      res.json({ message: 'Networth entry updated successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}
