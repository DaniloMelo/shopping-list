import {
  InternalServerError,
  LoginServiceError,
  LogoutServiceError,
  ModelValidationError,
  RegisterServiceError,
  TokenServiceError,
} from "@/lib/CustomErrors";
import { IHasher } from "@/lib/Hasher";
import { ITokenService } from "@/lib/TokenService";
import Email from "@/models/Email";
import Name from "@/models/Name";
import Password from "@/models/Password";
import User from "@/models/User";
import { IAuthRepository } from "@/repository/AuthRepository";
import { IUserRepository } from "@/repository/UserRepository";

interface INewUserData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export default class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authRepository: IAuthRepository,
    private readonly hasher: IHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async register({ name, email, password, passwordConfirmation }: INewUserData): Promise<void> {
    try {
      const userName = new Name(name);
      const userEmail = new Email(email);
      const userPassword = new Password(password, passwordConfirmation);
      const user = new User(userName, userEmail, userPassword);
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
      if (error instanceof ModelValidationError || error instanceof RegisterServiceError) {
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

  async login(email: string, password: string): Promise<string> {
    try {
      const isUserExists = await this.userRepository.findUserByEmail(email);
      if (!isUserExists) {
        throw new LoginServiceError("Usuário não encontrado.", "Verifique suas credenciais.", 404, true);
      }

      const isValidPassword = await this.hasher.decrypt(password, isUserExists.password);
      if (!isValidPassword) {
        throw new LoginServiceError("Credenciais inválidas.", "Verifique suas credenciais.", 400, true);
      }

      await this.authRepository.deleteAllSessionTokens(isUserExists.id);

      const sessionToken = await this.tokenService.generate({ userId: isUserExists.id });
      const expirationTime = new Date(Date.now() + 1440 * 60 * 1000);
      await this.authRepository.createSessionToken({
        token: sessionToken,
        userId: isUserExists.id,
        expiresAt: expirationTime,
      });

      return sessionToken;
    } catch (error) {
      if (error instanceof LoginServiceError || error instanceof TokenServiceError) {
        throw error;
      }

      console.error("Error during user login: ", error);

      throw new InternalServerError(
        "Ocorreu um Erro inesperado ao tentar realizar o login",
        "Tente novamente mais tarde",
        500,
        true,
      );
    }
  }

  async logout(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new LogoutServiceError("User not found.", "Check email or id provided.", 404, false);
      }

      await this.authRepository.deleteAllSessionTokens(user.id);
    } catch (error) {
      console.error("Error during user logout: ", error);

      throw new InternalServerError(
        "Ocorreu um Erro inesperado ao tentar realizar o logout",
        "Tente novamente mais tarde",
        500,
        true,
      );
    }
  }

  async findSessionToken(token: string) {
    try {
      const sessionToken = await this.authRepository.findToken(token);
      if (!sessionToken) {
        throw new Error("Session token not found");
      }

      return sessionToken;
    } catch (error) {
      console.error("Error during find session token service: ", error);
    }
  }
}
