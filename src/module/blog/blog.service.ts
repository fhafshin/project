import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entity/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blogDto';
import { createSlug } from 'src/common/utils/function.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogStatus } from './enum/status.enum';
import { PublicMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}

  async create(data: CreateBlogDto) {
    const { id: authorId } = this.req.user;
    const { title, slug, content, description, image, time_for_study } = data;
    let newSlug = slug ?? title;
    newSlug = createSlug(newSlug);
    BlogStatus.Draft;
    const blog = this.blogRepository.create({
      title,
      slug: newSlug,
      content,
      image,
      time_for_study,
      description,
      authorId,
      status: BlogStatus.Draft,
    });

    await this.blogRepository.save(blog);
    return {
      message: PublicMessage.Created,
    };
  }
}
