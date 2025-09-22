// src/auth/auth.controller.ts

import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto'; // Import LoginDto
import { User } from 'src/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.signUp(signUpDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Get('/profile')
  @UseGuards(AuthGuard()) // This is the guard that protects the route
  getProfile(@Req() req): User {
    // The user object is attached to the request by our JwtStrategy's validate method
    return req.user;
  }
}
