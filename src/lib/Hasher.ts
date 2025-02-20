import bcrypt from "bcrypt";

export interface IHasher {
  encrypt(data: string): Promise<string>;
  decrypt(data: string, hashedData: string): Promise<boolean>;
}

export default class Hasher implements IHasher {
  async encrypt(data: string): Promise<string> {
    return await bcrypt.hash(data, 12);
  }

  async decrypt(data: string, hashedData: string): Promise<boolean> {
    return await bcrypt.compare(data, hashedData);
  }
}
