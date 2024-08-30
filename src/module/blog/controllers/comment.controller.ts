import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogCommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/comment.dto';
import { authguard } from 'src/module/auth/guards/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
@ApiTags('blog-comment')
@UseGuards(authguard)
@ApiBearerAuth('Authorization')
@Controller('blog-comment')
export class BlogCommentController {
  constructor(private readonly commentService: BlogCommentService) {}
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @Post('/create')
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(createCommentDto);
  }

  @Get('/')
  @Pagination()
  find(@Query() data: PaginationDto) {
    return this.commentService.find(data);
  }

  @Put('/accept/:id')
  accept(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.accept(id);
  }
  @Put('/reject/:id')
  reject(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.reject(id);
  }
}
