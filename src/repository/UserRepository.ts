import { prisma } from "@/lib/prisma";

export interface IDbUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface INewUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserRepository {
  createUser(newUserObj: INewUser): Promise<void>;
  findUserByEmail(email: string): Promise<IDbUser | null>;
  findUserById(userId: string): Promise<IDbUser | null>;
  updatePassword(userId: string, newPassword: string): Promise<void>;
}

export default class UserRepository implements IUserRepository {
  async createUser(newUserObj: INewUser): Promise<void> {
    await prisma.user.create({
      data: { ...newUserObj, email: newUserObj.email.toLowerCase() },
    });
  }

  async findUserByEmail(email: string): Promise<IDbUser | null> {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findUserById(userId: string): Promise<IDbUser | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }
}
