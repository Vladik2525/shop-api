import { Controller, Post, Body, Param, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.userService.register(body)
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.userService.login(body)
  }
}
