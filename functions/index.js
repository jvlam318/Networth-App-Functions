const functions = require('firebase-functions');

const app = require('express')();

const FBAuth = require('./utilities/fbAuth');

const { getNetworthHistory, addNetworth, getNetworth, updateNetworth, deleteNetworth } = require('./routes/networth');
const { signup, login, addUserDetails, getAuthenticatedUser } = require('./routes/users');

// networth routes
app.get('/networthHistory', FBAuth, getNetworthHistory);
app.get('/networth/:snapshotId', FBAuth, getNetworth);
app.post('/networth', FBAuth, addNetworth);
app.patch('/networth/:snapshotId', FBAuth, updateNetworth);
app.delete('/networth/:snapshotId', FBAuth, deleteNetworth);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.region('asia-northeast1').https.onRequest(app);
