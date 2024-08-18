import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { Repository } from 'typeorm';
import { PublicMessage } from 'src/common/enums/message.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(data: CreateCategoryDto) {
    const { title, priority } = data;
    const category = this.categoryRepository.create({ title, priority });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Created,
    };
  }
}
