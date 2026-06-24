const login = require('./onboarding/login');
const createCard = require('./card-management/create-card');
const retrieveCard = require('./card-management/retrieve-card');
const deleteCard = require('./card-management/delete-card');

module.exports = {
  login,
  createCard,
  retrieveCard,
  deleteCard,
};
