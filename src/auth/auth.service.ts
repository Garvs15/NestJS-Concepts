import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserEventsService } from 'src/events/user-events.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository : Repository<User>,
        private jwtService: JwtService,
        private readonly userEventService: UserEventsService
    ){
        bcrypt.hash('123456', 10).then(console.log);
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: registerDto.email }
        })

        if (existingUser) {
            throw new ConflictException('Email already in use! Please try with a different email');
        }

        const hashedPassword = await this.hashPassword(registerDto.password);

        const newlyCreatedUser = this.usersRepository.create({
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: UserRole.USER,
        });

        const saveUser = await this.usersRepository.save(newlyCreatedUser);

        // Emit the user registered event
        this.userEventService.emitUserRegistered(newlyCreatedUser);

        const {password, ...result} = saveUser;
        return {
            user: result,
            message: 'Registration Successfully Completed! Please login to continue!'
        };
    }

    async createAdmin(registerDto: RegisterDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: registerDto.email }
        })

        if (existingUser) {
            throw new ConflictException('Email already in use! Please try with a different email');
        }

        const hashedPassword = await this.hashPassword(registerDto.password);

        const newlyCreatedUser = this.usersRepository.create({
            email: registerDto.email,
            name: registerDto.name,
            password: hashedPassword,
            role: UserRole.ADMIN,
        });

        const saveUser = await this.usersRepository.save(newlyCreatedUser);

        const {password, ...result} = saveUser;
        return {
            user: result,
            message: 'Admin Registration Completed successfully! Please login to continue!'
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email }
        });

        if (!user || !(await this.verifyPassword(loginDto.password, user.password))) {
            throw new UnauthorizedException('Invalid Credentials or Account not exists yet!');
        }

        // Generate Tokens
        const tokens = await this.generateTokens(user)
        const { password, ...result } = user;
        return {
            user: result,
            ...tokens
        }
    }

    // Find the Current User By ID
    async getUserById(userId: number) {
        const user = await this.usersRepository.findOne({
            where: { id: userId }
        })
        if (!user) {
            throw new UnauthorizedException('User not found!');
        }

        const { password, ...result } = user;

        return result;
    }
    
    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: 'refresh_token',
            });

            const user = await this.usersRepository.findOne({
                where: { id: payload.sub }
            });

            if (!user) {
                throw new UnauthorizedException('Invalid token!');
            }

            const accessToken = this.generateAccessToken(user);

            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid Token!');
        }
    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    private generateTokens(user: User) {
        return {
            accessToken: this.generateAccessToken(user),
            refreshToken: this.generateRefreshToken(user),

        }
    }

    private generateAccessToken(user: User) : string {
         const payload = {
            email: user.email,
            sub: user.id,
            role: user.role,
        };

        return this.jwtService.sign(payload, {
            secret: 'jwt_secret',    // optional
            expiresIn: '15m',
        });
    }

    private generateRefreshToken(user: User): string {
        const payload = {
            sub: user.id,
        };

        return this.jwtService.sign(payload, {
            secret: 'refresh_secret',    // optional
            expiresIn: '7d',
        });
    }
}

