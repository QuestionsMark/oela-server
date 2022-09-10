import { Injectable } from '@nestjs/common';
import { hashPassword } from '../utils/hash-password.util';
import { ServerResponse } from '../types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { getServerResponse } from '../utils/response.util';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<ServerResponse> {
    const { email, login, password } = createUserDto;

    const newUser = new User();
    newUser.passwordHash = await hashPassword(password);
    newUser.email = email;
    newUser.login = login;
    
    await newUser.save();
    
    return getServerResponse('User has been successfully created!');
  }

  async checkIsAdminAccount(): Promise<boolean> {
    const user = await User.findOne({ where: {} });
    return user !== null;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
