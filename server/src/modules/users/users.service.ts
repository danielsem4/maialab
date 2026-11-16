import bcrypt from 'bcrypt';
import { AppError } from '../../shared/errors/AppError';
import { recordAudit } from '../../shared/utils/audit';
import type { AdminUserRecord, IUserRepository } from './users.repository';
import type { AdminRole, CreateUserDto, UpdateUserDto } from './users.schema';

const SALT_ROUNDS = 10;

export interface AdminUserDto {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
}

function toAdminUserDto(user: AdminUserRecord): AdminUserDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? '',
    role: user.role as AdminRole,
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  async list(): Promise<AdminUserDto[]> {
    const users = await this.repository.findAdmins();
    return users.map(toAdminUserDto);
  }

  async create(actorId: number, dto: CreateUserDto): Promise<AdminUserDto> {
    const email = dto.email.toLowerCase();
    if (await this.repository.emailExists(email)) {
      throw new AppError('A user with this email already exists', 409);
    }
    const hashPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.repository.create({ email, name: dto.name, role: dto.role, hashPassword });
    await recordAudit(actorId, 'CREATE', 'User', user.id, { title: user.name, email: user.email, role: user.role });
    return toAdminUserDto(user);
  }

  async update(actorId: number, id: number, dto: UpdateUserDto): Promise<AdminUserDto> {
    const existing = await this.repository.findById(id);
    if (!existing || (existing.role !== 'ADMIN' && existing.role !== 'SUPER_ADMIN')) {
      throw new AppError('User not found', 404);
    }

    const isSelf = actorId === id;
    if (isSelf && dto.isActive === false) {
      throw new AppError('You cannot deactivate your own account', 400);
    }
    if (isSelf && dto.role && dto.role !== existing.role) {
      throw new AppError('You cannot change your own role', 400);
    }

    const losesSuperAdmin =
      existing.role === 'SUPER_ADMIN' &&
      existing.isActive &&
      ((dto.role !== undefined && dto.role !== 'SUPER_ADMIN') || dto.isActive === false);
    if (losesSuperAdmin && (await this.repository.countActiveSuperAdmins()) <= 1) {
      throw new AppError('At least one active super admin is required', 400);
    }

    const user = await this.repository.update(id, dto);
    await recordAudit(actorId, 'UPDATE', 'User', id, { title: user.name, ...dto });
    return toAdminUserDto(user);
  }
}
