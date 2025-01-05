import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './entity/task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { TransformInterceptor } from '../interceptors/transform.interceptor';

@Controller('tasks')
@UseGuards(AuthGuard())
@UseInterceptors(new TransformInterceptor())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.log('Retrieving all tasks');
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getById(id, user);
  }

  @Post()
  create(@Body() task: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.tasksService.create(task, user);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.delete(id, user);
  }

  @Patch('/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() { status }: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateStatus(id, status, user);
  }
}
