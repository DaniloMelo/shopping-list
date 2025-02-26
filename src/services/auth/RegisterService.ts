import User from "@/models/User";
import { IHasher } from "@/lib/Hasher";
import { IUserRepository } from "@/repository/UserRepository";
import { InternalServerError, RegisterServiceError, UserValidationsError } from "@/lib/CustomErrors";

interface INewUserData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default class RegisterService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  async register({ name, email, password, passwordConfirmation }: INewUserData): Promise<void> {
    try {
      const user = new User(name, email, password, passwordConfirmation);
      const newUser = user.getUser()!;

      const isUserExists = await this.userRepository.findUserByEmail(email);
      if (isUserExists) {
        throw new RegisterServiceError("Credenciais inválidas.", "Tente Novamente.", 400, true);
      }

      const hashedPassword = await this.hasher.encrypt(password);

      const userWithHashedPassword = {
        ...newUser,
        password: hashedPassword,
      };

      await this.userRepository.createUser(userWithHashedPassword);
    } catch (error) {
      if (error instanceof UserValidationsError || error instanceof RegisterServiceError) {
        throw error;
      }

      console.error("Error during user register: ", error);

      throw new InternalServerError(
        "Ocorreu um Erro inesperado ao tentar realizar o cadastro",
        "Tente novamente mais tarde",
        500,
        true,
      );
    }
  }
}
