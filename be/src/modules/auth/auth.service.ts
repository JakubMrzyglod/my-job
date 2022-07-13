import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@modules/user/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  createAccessToken({ id: sub }: User) {
    const payload = { sub };
    const token = this.jwtService.sign(payload);
    return token;
  }
}
