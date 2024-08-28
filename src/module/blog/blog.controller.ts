import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto, FilterBlogDto } from './dto/blogDto';
import { authguard } from '../auth/guards/auth.guard';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { FilterBlog } from 'src/common/decorators/Filter.decorator';

@Controller('/blog')
@ApiTags('blog')
@UseGuards(authguard)
@ApiBearerAuth('Authorization')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @Post('/')
  create(@Body() data: CreateBlogDto) {
    return this.blogService.create(data);
  }
  @Get('/my')
  myBlogs() {
    return this.blogService.myBlogs();
  }
  @Get('/blogList')
  @Pagination()
  @FilterBlog()
  @SkipAuth()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterBlogDto,
  ) {
    return this.blogService.blogList(paginationDto, filterDto);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.remove(+id);
  }
}
