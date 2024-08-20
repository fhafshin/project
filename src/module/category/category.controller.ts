import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category-dto';
import { CategoryService } from './category.service';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { Delete } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category-dto';
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

  @Get('/:id')
  findOne(@Param('id') id: number) {
    console.log(id);
    return this.categoryService.findOne(id);
  }
  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }

  @Patch('/:id')
  update(@Param('id') id: number, @Body() data: UpdateCategoryDto) {
    return this.categoryService.update(id, data);
  }
}
