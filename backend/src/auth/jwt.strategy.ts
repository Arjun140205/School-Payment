// src/auth/jwt.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from '../schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    
    super({
      // 1. Tell the strategy where to find the token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2. Do not allow expired tokens
      ignoreExpiration: false,
      
      // 3. Provide the secret to verify the token's signature
      secretOrKey: jwtSecret,
    });
  }

  // This method is called after the token is verified
  async validate(payload: { id: string; email: string }): Promise<User> {
    const { id } = payload;
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UnauthorizedException('Please log in to access this endpoint.');
    }

    return user;
  }
}