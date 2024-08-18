import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CategoryService } from './category.service';
@ApiTags('category')
@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data);
  }
}
