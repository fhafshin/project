import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blogDto';
import { authguard } from '../auth/guards/auth.guard';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

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
}
