import { Body, Controller, Post, ConflictException, UnauthorizedException} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string }
  ): Promise<{ token: string }> {
    const user = await this.authService.validateUser(
      body.username,
      body.password
    );
    return this.authService.login(user);
  }
}
