const { db } = require('../utilities/admin');

const config = require('../utilities/config')
const firebase = require('firebase');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../utilities/validators');

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    userName: req.body.userName
  }

  const { valid, signUpErrors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(signUpErrors);

  // TODO validate data
  let token, userId;
  db.doc(`/users/${newUser.userName}`).get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({
          userName: 'this user name is already taken'
        })
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        userName: newUser.userName,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId
      }
      return db.doc(`/users/${newUser.userName}`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already in use' })
      } else {
        return res.status(500).json({ general: 'Something went wrong, please try again' });
      }
    });
}

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, loginErrors } = validateLoginData(user);
  if (!valid) return res.status(400).json(loginErrors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token })
    })
    .catch(err => {
      console.error(err);
      return res.status(403).json({ general: 'Incorrect credentials, please try again' })
    });
}

// add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.userName}`).update(userDetails)
    .then(() => {
      return res.json({ message: 'Details updated successfully' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code })
    })
}

// Get user credential details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.userName}`).get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return res.json(userData);
      }
    })
    .catch(err => {
      console.error(err)
      return res.status(500).json({ error: err.code })
    })
}
