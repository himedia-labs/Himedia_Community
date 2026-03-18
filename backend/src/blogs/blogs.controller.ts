import { Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { BlogsService } from './blogs.service';

/**
 * 블로그 컨트롤러
 * @description 기술 블로그 글 목록 조회 및 조회수 관리
 */
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  /**
   * 피드 소스 목록
   * @description 등록된 블로그 피드 소스 목록 반환
   */
  @Get('sources')
  getSources() {
    return this.blogsService.getSources();
  }

  /**
   * 블로그 글 목록
   * @description 수집된 기술 블로그 글을 커서 기반 페이지네이션으로 반환
   */
  @Get()
  getEntries(@Query('cursor') cursor?: string) {
    return this.blogsService.getEntries(cursor);
  }

  /**
   * 조회수 증가
   * @description 블로그 글 클릭 시 조회수를 1 증가
   */
  @Patch(':entryId/views')
  incrementViews(@Param('entryId') entryId: string) {
    return this.blogsService.incrementViews(entryId);
  }
}
