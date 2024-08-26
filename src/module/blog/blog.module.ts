import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entity/blog.entity';
import { BlogCategoryEntity } from './entity/blog-category.entity';
import { BlogLikesEntity } from './entity/like.entity';
import { BlogBookmarkEntity } from './entity/bookmark.entity';
import { BlogCommentEntity } from './entity/comment.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      BlogCategoryEntity,
      BlogLikesEntity,
      BlogBookmarkEntity,
      BlogCommentEntity,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
