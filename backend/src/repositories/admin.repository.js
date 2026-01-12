const { Admin } = require('../../models'); 

exports.findByEmail = async (email) => {
  return await Admin.findOne({
    where: { email: email }
  });
};

exports.create = async ({ email, password }) => {
  return Admin.create({
    email,
    password
  });
};