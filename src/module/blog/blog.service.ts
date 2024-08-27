import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entity/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blogDto';
import { createSlug, randomId } from 'src/common/utils/function.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogStatus } from './enum/status.enum';
import { PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  PaginationGenerator,
  PaginationSolver,
} from 'src/common/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}

  async create(data: CreateBlogDto) {
    const { id: authorId } = this.req.user;
    const { title, content, description, image, time_for_study } = data;
    let { slug } = data;
    let newSlug = slug ?? title;
    newSlug = createSlug(newSlug);
    const isExist = await this.checkBlogBySlug(newSlug);
    if (isExist) {
      slug += `-${randomId}`;
    }
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

  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return !!blog;
  }

  async myBlogs() {
    const { id: authorId } = this.req.user;
    const blogs = await this.blogRepository.find({
      where: { authorId },
      order: { id: 'desc' },
    });
    return blogs;
  }

  async blogList(data: PaginationDto) {
    const { page, limit, skip } = PaginationSolver(data);
    const [blogs, count] = await this.blogRepository.findAndCount({
      where: {},
      order: { id: 'desc' },
      skip,
      take: limit,
    });

    return {
      pagination: PaginationGenerator(count, page, limit),
      blogs,
    };
  }
}
