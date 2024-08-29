import { Inject, Injectable, Scope } from '@nestjs/common';
import { CreateCommentDto } from '../dto/comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogCommentEntity } from '../entity/comment.entity';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogService } from './blog.service';
import { PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  PaginationGenerator,
  PaginationSolver,
} from 'src/common/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogCommentEntity)
    private commentRepository: Repository<BlogCommentEntity>,
    @Inject(REQUEST) private req: Request,
    private readonly blogService: BlogService,
  ) {}
  async create(commentDto: CreateCommentDto) {
    const { text, parentId, blogId } = commentDto;
    const { id: userId } = this.req.user;
    await this.blogService.checkExistBlogById(+blogId);
    let parent = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.commentRepository.findOneBy({ id: +parentId });
    }

    await this.commentRepository.insert({
      text,
      accepted: true,
      blogId,
      parentId: parent ? parentId : null,
      userId,
    });

    return {
      message: PublicMessage.Created,
    };
  }

  async find(paginationDto: PaginationDto) {
    const { page, limit, skip } = PaginationSolver(paginationDto);
    const [comments, count] = await this.commentRepository.findAndCount({
      where: {},
      relations: { blog: true, user: { profile: true } },
      select: {
        blog: { title: true },
        user: { username: true, profile: { nik_name: true } },
      },
      skip,
      take: limit,
      order: { id: 'DESC' },
    });
    return {
      pagination: PaginationGenerator(count, page, limit),
      comments,
    };
  }
}
