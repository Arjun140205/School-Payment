// src/auth/auth.service.ts

import {
  ConflictException,
  Injectable,
  UnauthorizedException, // Import UnauthorizedException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto'; // Import LoginDto
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService, // Inject JwtService
  ) {}

  // --- Sign Up Logic ---
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { email, password } = signUpDto;

    // 1. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Create and save the user
    try {
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      // Handle duplicate email error
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  // --- Login Logic ---
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // 1. Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare passwords
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT
    const payload = { id: user._id, email: user.email };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
