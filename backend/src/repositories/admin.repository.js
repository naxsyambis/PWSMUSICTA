const { Admin } = require('../../models'); // Menggunakan model Sequelize

exports.findByEmail = async (email) => {
  // Mencari admin berdasarkan email menggunakan Sequelize
  return Admin.findOne({
    where: { email: email }
  });
};

exports.create = async ({ email, password }) => {
  // Membuat data admin baru
  return Admin.create({
    email,
    password
  });
};