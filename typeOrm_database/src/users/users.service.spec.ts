import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { Users } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo: jest.Mocked<Repository<Users>>;

  beforeEach(async () => {
    usersRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Users>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: usersRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch the requested user by id', async () => {
    const expectedUser: Users = {
      id: 42,
      name: 'Test User',
      gender: 'male',
      email: 'test@example.com',
      age: 28,
      isBangladeshi: true,
      profilePic: 'uploads/test.png',
      createDate: new Date(),
      updateDate: new Date(),
    };

    usersRepo.findOne.mockResolvedValue(expectedUser);

    const result = await service.getUserById(42);

    expect(usersRepo.findOne).toHaveBeenCalledWith({ where: { id: 42 } });
    expect(result).toEqual(expectedUser);
  });
});
