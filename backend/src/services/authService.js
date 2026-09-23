const { User } = require('../models');

class AuthService {
  async signup({ name, email, password }) {
    const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      const error = new Error('An account with this email address already exists');
      error.statusCode = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    // Always set role = "PLAYER" for newly registered users.
    // Client-provided role is completely ignored to prevent privilege escalation.
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: 'PLAYER'
    });

    return user.toSafeJSON();
  }

  async signin({ email, password }) {
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isValid = await user.validPassword(password);
    if (!isValid) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    return user.toSafeJSON();
  }

  async getCurrentUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return user.toSafeJSON();
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const isValid = await user.validPassword(currentPassword);
    if (!isValid) {
      const error = new Error('Current password does not match');
      error.statusCode = 400;
      error.code = 'INVALID_CURRENT_PASSWORD';
      throw error;
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  async getAllUsers() {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'avatar']
    });
    return users;
  }
}

module.exports = new AuthService();
