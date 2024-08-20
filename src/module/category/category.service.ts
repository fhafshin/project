import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { Repository } from 'typeorm';
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  PaginationGenerator,
  PaginationSolver,
} from 'src/common/utils/pagination.util';
import { UpdateCategoryDto } from './dto/update-category-dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(data: CreateCategoryDto) {
    let { title, priority } = data;
    title = await this.checkExistAndResolve(title);

    if (!priority) priority = null;
    const category = this.categoryRepository.create({ title, priority });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Created,
    };
  }

  async checkExistAndResolve(title: string) {
    title = title?.trim()?.toLocaleLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category) throw new ConflictException(ConflictMessage.CategoryTitle);
    return title;
  }

  async findAll(data: PaginationDto) {
    const { page, limit, skip } = PaginationSolver(data);

    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      take: limit,
      skip,
    });

    return {
      pagination: PaginationGenerator(count, page, limit),
      categories,
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(NotFoundMessage.NotFoundCategory);
    return category;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return {
      message: PublicMessage.Deleted,
    };
  }

  async update(id: number, data: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { title, priority } = data;
    if (title) category.title = title;
    if (priority) category.priority = priority;
    await this.categoryRepository.save(category);
    return { message: PublicMessage.Updated };
  }
}
