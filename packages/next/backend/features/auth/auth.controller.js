const argon2 = require("argon2");
const { HttpError } = require("../../exc");
const validator = require("validator");

class AuthController {
  async signup(ctx) {
    const { username, email, password } = ctx.request.body;

    if (!username) {
      throw new HttpError(400, { username: ["Username is missing"] });
    }

    if (!email) {
      throw new HttpError(400, { email: ["Email is missing"] });
    }

    if (!password) {
      throw new HttpError(400, { password: ["Password is missing"] });
    }

    if (!username.match(/^[a-z][a-z0-9_]{2,15}$/)) {
      throw new HttpError(400, {
        username: [
          "Invalid username. It should start with alpha, and only contains alpha, numeric and underscore. The length must between 3 to 16",
        ],
      });
    }

    if (!validator.isEmail(email)) {
      throw new HttpError(400, { email: ["Invalid email"] });
    }
  }
}

module.exports = new AuthController();
