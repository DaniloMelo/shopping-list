import Name from "./Name";
import Email from "./Email";
import Password from "./Password";

export default class User {
  constructor(
    private readonly name: Name,
    private readonly email: Email,
    private readonly password: Password,
  ) {}

  getUser() {
    return {
      name: this.name.getValue(),
      email: this.email.getValue(),
      password: this.password.getValue(),
    };
  }
}
