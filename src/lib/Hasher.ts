import bcrypt from "bcrypt";

export interface IHasher {
  encrypt(data: string): Promise<string>;
  decrypt(data: string, hashedData: string): Promise<boolean>;
}

export default class Hasher implements IHasher {
  encrypt(data: string): Promise<string> {
    return bcrypt.hash(data, 12);
  }

  decrypt(data: string, hashedData: string): Promise<boolean> {
    return bcrypt.compare(data, hashedData);
  }
}
