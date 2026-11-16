import prisma from '../../lib/prisma';
import type { AdminRole, UpdateUserDto } from './users.schema';

export const adminUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
} as const;

export interface AdminUserRecord {
  id: number;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
  role: AdminRole;
  hashPassword: string;
}

export interface IUserRepository {
  findAdmins(): Promise<AdminUserRecord[]>;
  findById(id: number): Promise<AdminUserRecord | null>;
  emailExists(email: string): Promise<boolean>;
  countActiveSuperAdmins(): Promise<number>;
  create(data: CreateUserData): Promise<AdminUserRecord>;
  update(id: number, data: UpdateUserDto): Promise<AdminUserRecord>;
}

export class UserRepository implements IUserRepository {
  async findAdmins(): Promise<AdminUserRecord[]> {
    return prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      orderBy: { createdAt: 'asc' },
      select: adminUserSelect,
    });
  }

  async findById(id: number): Promise<AdminUserRecord | null> {
    return prisma.user.findUnique({ where: { id }, select: adminUserSelect });
  }

  async emailExists(email: string): Promise<boolean> {
    return (await prisma.user.count({ where: { email } })) > 0;
  }

  async countActiveSuperAdmins(): Promise<number> {
    return prisma.user.count({ where: { role: 'SUPER_ADMIN', isActive: true } });
  }

  async create(data: CreateUserData): Promise<AdminUserRecord> {
    return prisma.user.create({ data, select: adminUserSelect });
  }

  async update(id: number, data: UpdateUserDto): Promise<AdminUserRecord> {
    return prisma.user.update({ where: { id }, data, select: adminUserSelect });
  }
}
