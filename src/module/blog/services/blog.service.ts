import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entity/blog.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blogDto';
import { createSlug, randomId } from 'src/common/utils/function.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogStatus } from '../enum/status.enum';
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  PaginationGenerator,
  PaginationSolver,
} from 'src/common/utils/pagination.util';
import { CategoryService } from '../../category/category.service';
import { isArray } from 'class-validator';
import { BlogCategoryEntity } from '../entity/blog-category.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { BlogLikesEntity } from '../entity/like.entity';
import { BlogBookmarkEntity } from '../entity/bookmark.entity';
import { BlogCommentService } from './comment.service';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private req: Request,
    private categoryService: CategoryService,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikesEntity)
    private blogLikeRepository: Repository<BlogLikesEntity>,
    @InjectRepository(BlogBookmarkEntity)
    private blogBookmarkRepository: Repository<BlogBookmarkEntity>,
    private commentService: BlogCommentService,
    private dataSource: DataSource,
  ) {}

  async create(data: CreateBlogDto) {
    const { id: authorId } = this.req.user;
    const { title, content, description, image, time_for_study } = data;

    let { categories } = data;

    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories.split(',');
    } else if (!categories) {
      throw new BadRequestException(BadRequestMessage.invalidCategory);
    }

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

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.createByTitle(categoryTitle);
      }

      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }

    return {
      message: PublicMessage.Created,
    };
  }

  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return blog;
  }

  async myBlogs() {
    const { id: authorId } = this.req.user;
    const blogs = await this.blogRepository.find({
      where: { authorId },
      order: { id: 'desc' },
    });
    return blogs;
  }

  async blogList(data: PaginationDto, filterDto: FilterBlogDto) {
    const { page, limit, skip } = PaginationSolver(data);
    let { category, search } = filterDto;
    // const where: FindOptionsWhere<BlogEntity> = {};
    let where = '';
    if (category) {
      // where['categories'] = {
      //   category: { title: category },
      // };
      category = category.toLowerCase();
      if (where.length > 0) where += ' AND ';
      where += 'category.title=LOWER(:category)';
    }
    if (search) {
      if (where.length > 0) where += ' AND ';
      search = `%${search}%`;
      where += 'CONCAT(blog.title,blog.description,blog.content) ILIKE :search';
    }
    const [blogs, count] = await this.blogRepository
      .createQueryBuilder(EntityNames.Blog)

      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'profile.nik_name',
      ])
      .where(where, { category, search })
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .loadRelationCountAndMap(
        'blog.comments',
        'blog.comments',
        'comments',
        (qb) => qb.where('comments.accepted= :accepted', { accepted: true }),
      )
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // const [blogs, count] = await this.blogRepository.findAndCount({
    //   relations: { categories: { category: true } },
    //   where,
    //   order: { id: 'desc' },
    //   skip,
    //   take: limit,

    //   select: {
    //     id: true,
    //     title: true,
    //     categories: { id: true, category: { title: true } },
    //   },
    // });

    return {
      pagination: PaginationGenerator(count, page, limit),
      blogs,
    };
  }

  async remove(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost);
    await this.blogRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }

  async update(id: number, data: UpdateBlogDto) {
    const { title, content, description, image, time_for_study } = data;
    const blog = await this.blogRepository.findOneBy({ id });

    let { categories, slug } = data;

    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories.split(',');
    } else if (!categories) {
      throw new BadRequestException(BadRequestMessage.invalidCategory);
    }
    if (description) blog.description = description;

    let slugData = null;
    if (title) {
      slugData = title;
      blog.title = title;
    }
    if (slug) slugData = slug;

    if (slugData) {
      slug = createSlug(slugData);
      const isExist = await this.checkBlogBySlug(slug);
      if (isExist && isExist.id !== id) {
        slug += `${randomId()}`;
      }
    }

    blog.slug = slug;

    if (content) blog.content = content;
    if (time_for_study) blog.time_for_study = time_for_study;
    if (image) blog.image = image;
    await this.blogRepository.save(blog);
    if (categories && isArray(categories) && categories.length > 0) {
      await this.blogCategoryRepository.delete({ blogId: blog.id });
    }

    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.createByTitle(categoryTitle);
      }

      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }

    return {
      message: PublicMessage.Updated,
    };
  }

  async checkExistBlogById(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost);
    return blog;
  }

  async likeToggle(blogId: number) {
    await this.checkExistBlogById(blogId);
    const { id: userId } = this.req.user;
    let message = PublicMessage.Like;
    const like = await this.blogLikeRepository.findOneBy({
      blogId,
      userId,
    });
    if (!like) {
      this.blogLikeRepository.insert({ blogId, userId });
    } else {
      await this.blogLikeRepository.delete({ blogId });
      message = PublicMessage.Dislike;
    }

    return {
      message,
    };
  }

  async bookmarkToggle(blogId: number) {
    await this.checkExistBlogById(blogId);
    const { id: userId } = this.req.user;
    const idBookmarked = await this.blogBookmarkRepository.findOneBy({
      blogId,
      userId,
    });
    let message = PublicMessage.bookmark;
    if (idBookmarked) {
      await this.blogBookmarkRepository.delete({ id: idBookmarked.id });
      message = PublicMessage.UnBookmark;
    } else {
      await this.blogBookmarkRepository.insert({ blogId, userId });
    }
    return {
      message,
    };
  }

  async findOneBySlug(slug: string, paginationDto: PaginationDto) {
    const userId = this.req?.user?.id;
    const blog = await this.blogRepository
      .createQueryBuilder(EntityNames.Blog)

      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .addSelect([
        'categories.id',
        'category.title',
        'author.username',
        'profile.nik_name',
      ])
      .where({ slug })
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .leftJoinAndSelect('blog.comments', 'comments')

      .getOne();

    if (!blog) throw new NotFoundException(NotFoundMessage.NotFoundPost);

    const comments = await this.commentService.findCommentsByBlog(
      paginationDto,
      blog.id,
    );

    let isLiked = false,
      isBookmarked = false;
    if (userId && !isNaN(userId) && userId > 0) {
      isLiked = !!(await this.blogLikeRepository.findOneBy({
        userId,
        blogId: blog.id,
      }));
      isBookmarked = !!(await this.blogBookmarkRepository.findOneBy({
        userId,
        blogId: blog.id,
      }));
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const suggestBlogs = await queryRunner.query(`
      WITH suggested_blogs as (
      SELECT 
          blog.*,
          json_build_object(
                   'username',u.username,
                   'author_name',p.nik_name
           ) as other,
            array_agg(DISTINCT c.title),
          (
          SELECT COUNT(*) FROM blog_likes 
          WHERE blog_likes."blogId" = blog.id
          ) as likes,
              (
          SELECT COUNT(*) FROM blog_bookmarks 
          WHERE blog_bookmarks."blogId" = blog.id
          ) as bookmarks,
              (
          SELECT COUNT(*) FROM blog_comments
          WHERE blog_comments."blogId" = blog.id
          ) as comments

          FROM blog
          LEFT JOIN public.user u ON blog."authorId"=u.id 
          LEFT JOIN public.profile p ON u.id=p."userId"
          LEFT JOIN public.blog_category bc ON blog.id=bc."blogId"
          LEFT JOIN public.category c ON bc."categoryId"=c.id
          GROUP BY u.username,blog.id,p.nik_name
          ORDER BY RANDOM()
          LIMIT 3

      )
      SELECT * FROM suggested_blogs
      `);

    return {
      blog,
      isLiked,
      isBookmarked,
      comments,
      suggestBlogs,
    };
  }
}
