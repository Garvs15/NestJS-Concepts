import { Injectable } from '@nestjs/common';
import { HelloService } from 'src/hello/hello.service';

@Injectable()
export class UserService {
    // Injecting services from other module
    // hello module must export export hello service
    // user module must import HelloModule

    constructor(private  readonly helloService: HelloService) {}

    getAllUsers() {
        return [
            {
                id: 1, name: 'Garv Singla'
            },
            {
                id: 2, name: 'John',
            },
            {
                id: 3, name: 'Victor'
            }
        ]
    }

    getUserById(id: number) {
        const user = this.getAllUsers().find(user => user.id === id);
        return user;
    }

    getWelcomeMessage(userId: number) {
        const user = this.getUserById(userId);

        if (!user) {
            return 'User not found!';
        }

        return this.helloService.getHelloWithName(user?.name);
    }
}
