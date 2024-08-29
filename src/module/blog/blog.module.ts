import { Module } from '@nestjs/common';
import { BlogService } from './services/blog.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entity/blog.entity';
import { BlogCategoryEntity } from './entity/blog-category.entity';
import { BlogLikesEntity } from './entity/like.entity';
import { BlogBookmarkEntity } from './entity/bookmark.entity';
import { BlogCommentEntity } from './entity/comment.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { CategoryService } from '../category/category.service';
import { BlogController } from './controllers/blog.controller';
import { BlogCommentService } from './services/comment.service';
import { BlogCommentController } from './controllers/comment.controller';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogCategoryEntity,
      BlogLikesEntity,
      BlogBookmarkEntity,
      BlogCommentEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [BlogController, BlogCommentController],
  providers: [BlogService, CategoryService, BlogCommentService],
})
export class BlogModule {}
