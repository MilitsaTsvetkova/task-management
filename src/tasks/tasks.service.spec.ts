import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

const mockUser = {
  username: 'Test user',
  id: 1,
  password: 'somePassword',
  tasks: [],
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: TasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
          useFactory: mockTasksRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<TasksRepository>(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls tasksRepository.getTasks() and successfully retrieve and return the tasks', async () => {
      (repository.getTasks as jest.Mock).mockResolvedValue('someValue');
      const result = await service.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls tasksRepository.getById() and successfully retrieve and return the task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test desc',
        id: '1',
        status: TaskStatus.OPEN,
      };

      (repository.findOne as jest.Mock).mockResolvedValue(mockTask);
      const result = await service.getById('1', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls tasksRepository.getById() and handle error', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);
      expect(service.getById('1', mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
