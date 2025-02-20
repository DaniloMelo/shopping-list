import { InternalServerError, LoginServiceError, TokenServiceError } from "@/lib/CustomErrors";
import { IHasher } from "@/lib/Hasher";
import { ITokenService } from "@/lib/TokenService";
import { IAuthRepository } from "@/repository/AuthRepository";
import { IUserRepository } from "@/repository/UserRepository";

export class LoginService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authRepository: IAuthRepository,
    private readonly hasher: IHasher,
    private readonly tokenService: ITokenService,
  ) {}

  async login(email: string, password: string) {
    try {
      const isUserExists = await this.userRepository.findUserByEmail(email);
      if (!isUserExists) {
        throw new LoginServiceError("Usuário não encontrado.", "Verifique suas credenciais.", 404, true);
      }

      const isValidPassword = await this.hasher.decrypt(password, isUserExists.password);
      if (!isValidPassword) {
        throw new LoginServiceError("Credenciais inválidas.", "Verifique suas credenciais.", 400, true);
      }

      const sessionToken = await this.tokenService.generate({ userId: isUserExists.id });
      const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
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
}
