// check if input is empty
const isEmpty = (string) => {
  if (string.trim() === '') return true;
  else return false;
}

// check if email is valid
const isEmail = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) return true;
  else return false;
}

exports.validateSignupData = (newUser) => {
  // signup validations

  let signUpErrors = {};

  if (isEmpty(newUser.email)) {
    signUpErrors.email = 'Must not be empty'
  } else if (!isEmail(newUser.email)) {
    signUpErrors.email = 'Must be a valid email address'
  }
  if (isEmpty(newUser.password)) signUpErrors.password = 'Must not be empty';
  if (newUser.password !== newUser.confirmPassword) signUpErrors.confirmPassword = 'Passwords must match';
  if (isEmpty(newUser.userName)) signUpErrors.userName = 'Must not be empty';

  return {
    signUpErrors,
    valid: Object.keys(signUpErrors).length === 0 ? true : false
  }
}

exports.validateLoginData = (data) => {
  let loginErrors = {}

  if (isEmpty(data.email)) loginErrors.email = 'Must not be empty';
  if (isEmpty(data.password)) loginErrors.password = 'Must not be empty';

  return {
    loginErrors,
    valid: Object.keys(loginErrors).length === 0 ? true : false
  }
}

exports.validateNetworthForm = (newSnapshot) => {
  let snapshotErrors = {};
  if (isEmpty(newSnapshot.date)) snapshotErrors.date = 'Must not be empty';
  if (isEmpty(newSnapshot.networth)) snapshotErrors.networth = 'Must not be empty';

  return {
    snapshotErrors,
    valid: Object.keys(snapshotErrors).length === 0 ? true : false
  }
}

exports.reduceUserDetails = (data) => {
  let userDetails = {};
  if (!isEmpty(data.goal.trim())) userDetails.goal = data.goal;

  return userDetails;
}
