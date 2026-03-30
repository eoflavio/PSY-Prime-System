import { UserRepository } from '../repositories/user.repository';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  cep: z.string().optional(),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
});

const loginSchema = z.object({
  identifier: z.string(),
  password: z.string()
});

export class AuthService {
  private userRepository = new UserRepository();

  async register(data: any) {
    const validated = registerSchema.parse(data);

    const existingUser = await this.userRepository.findByEmail(validated.email);
    if (existingUser) {
      throw { status: 400, message: 'Email já cadastrado' };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);
    const user = await this.userRepository.create({
      ...validated,
      password: hashedPassword
    });

    const token = generateToken({ id: user.id, plan: user.plan });
    return { user: { id: user.id, name: user.name, email: user.email, plan: user.plan }, token };
  }

  async login(data: any) {
    const validated = loginSchema.parse(data);

    const isEmail = validated.identifier.includes('@');
    const cleanIdentifier = isEmail ? validated.identifier : validated.identifier.replace(/\D/g, '');

    const user = await this.userRepository.findByIdentifier(cleanIdentifier);
    if (!user) {
      throw { status: 401, message: 'Credenciais inválidas' };
    }

    const isValidPassword = await bcrypt.compare(validated.password, user.password);
    if (!isValidPassword) {
      throw { status: 401, message: 'Credenciais inválidas' };
    }

    const token = generateToken({ id: user.id, plan: user.plan });
    return { user: { id: user.id, name: user.name, email: user.email, plan: user.plan }, token };
  }
}
