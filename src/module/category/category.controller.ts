import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CategoryService } from './category.service';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
@ApiTags('category')
@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @Post()
  create(@Body() data: CreateCategoryDto) {
    return this.categoryService.create(data);
  }
  @Pagination()
  @Get()
  findAll(@Query() data: PaginationDto) {
    return this.categoryService.findAll(data);
  }
}
