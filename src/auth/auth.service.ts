import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UserService, private jwtService: JwtService) {}

    async login(userName: string, password: string ) {
        const user = await this.usersService.findOneByUserName(userName);
        if (!user) {
            throw new UnauthorizedException();
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (user && user.password === password) {
            return user;
        }
        if (!isPasswordValid) {
            throw new UnauthorizedException();
        }
        const payload = { sub: user.id, username: user.username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

}
