import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs'
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) { }

    async register(body: RegisterDto): Promise<any> {

        const thisUser = await this.userRepository.findOne({
            where: { email: body.email, username: body.username },
        });

        if (thisUser) {
            throw new BadRequestException('User with this data already exists')
        }

        const saltRounds = 10;
        const salt = await genSalt(saltRounds);

        const hashedPassword = await hash(body.password, salt);

        const user = this.userRepository.create({
            username: body.username,
            email: body.email,
            password: hashedPassword,
        });

        const payload = { username: user.username, email: user.email };

        const accessToken = jwt.sign(payload, process.env.SECRET, { expiresIn: '10h' });

        await this.userRepository.save(user)

        return { token: accessToken };

    }

    async login(body: LoginDto) {

        const user = await this.userRepository.findOne({
            where: { email: body.email }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isValidPassword = await bcrypt.compare(body.password, user.password);

        if (!isValidPassword) {
            throw new BadRequestException('Invalid password');
        }

        const payload = { username: user.username, email: user.email };

        const accessToken = jwt.sign(payload, process.env.SECRET, { expiresIn: '10h' });

        return { token: accessToken }

    }

}

