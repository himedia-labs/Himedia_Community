import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from '../auth/entities/user.entity';
import { Follow } from './entities/follow.entity';

import { ERROR_CODES } from '../constants/error/error-codes';
import { FOLLOW_ERROR_MESSAGES } from '../constants/message/follow.messages';

import type { ErrorCode } from '../constants/error/error-codes';
import type { FollowStatusResponse, MutualLookupMode } from './follows.types';

@Injectable()
export class FollowsService {
  /**
   * 팔로우 서비스
   * @description 팔로우 도메인 로직을 처리
   */
  constructor(
    @InjectRepository(Follow)
    private readonly followsRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * 팔로우
   * @description 대상 사용자를 팔로우 처리
   */
  async followUser(targetUserId: string, userId: string): Promise<FollowStatusResponse> {
    // 입력/검증
    const { followerId, followingId } = this.normalizeFollowIds(targetUserId, userId);
    this.assertNotSelfFollow(followerId, followingId);

    // 대상/조회
    await this.ensureTargetUserExists(followingId);

    // 팔로우/저장
    const existing = await this.followsRepository.findOne({ where: { followerId, followingId } });
    if (existing) return { following: true };

    const follow = this.followsRepository.create({ followerId, followingId });
    await this.followsRepository.save(follow);

    return { following: true };
  }

  /**
   * 언팔로우
   * @description 대상 사용자 팔로우를 해제
   */
  async unfollowUser(targetUserId: string, userId: string): Promise<FollowStatusResponse> {
    // 입력/검증
    const { followerId, followingId } = this.normalizeFollowIds(targetUserId, userId);
    this.assertNotSelfFollow(followerId, followingId);

    // 팔로우/삭제
    const existing = await this.followsRepository.findOne({ where: { followerId, followingId } });
    if (!existing) return { following: false };

    await this.followsRepository.delete({ followerId, followingId });

    return { following: false };
  }

  /**
   * 팔로워 조회
   * @description 내 팔로워 목록과 맞팔 여부를 반환
   */
  async getFollowers(userId: string) {
    // 목록/조회
    const followers = await this.followsRepository.find({
      where: { followingId: userId },
      relations: { follower: true },
      order: { createdAt: 'DESC' },
    });

    // 맞팔/확인
    const followerIds = followers.map(follow => follow.followerId);
    const mutualSet = await this.findMutualSet(userId, followerIds, 'followers');

    // 응답/매핑
    return followers.map(follow => ({
      id: follow.follower.id,
      name: follow.follower.name,
      role: follow.follower.role,
      isMutual: mutualSet.has(follow.followerId),
    }));
  }

  /**
   * 팔로잉 조회
   * @description 내 팔로잉 목록과 맞팔 여부를 반환
   */
  async getFollowings(userId: string) {
    // 목록/조회
    const followings = await this.followsRepository.find({
      where: { followerId: userId },
      relations: { following: true },
      order: { createdAt: 'DESC' },
    });

    // 맞팔/확인
    const followingIds = followings.map(follow => follow.followingId);
    const mutualSet = await this.findMutualSet(userId, followingIds, 'followings');

    // 응답/매핑
    return followings.map(follow => ({
      id: follow.following.id,
      name: follow.following.name,
      role: follow.following.role,
      isMutual: mutualSet.has(follow.followingId),
    }));
  }

  /**
   * 팔로우 ID 정규화
   * @description 입력값을 트림하여 반환
   */
  private normalizeFollowIds(targetUserId: string, userId: string) {
    const followerId = userId.trim();
    const followingId = targetUserId.trim();

    return { followerId, followingId };
  }

  /**
   * 자기 팔로우 방지
   * @description 동일한 사용자 팔로우를 차단
   */
  private assertNotSelfFollow(followerId: string, followingId: string): void {
    if (followerId !== followingId) return;

    const code = ERROR_CODES.FOLLOW_SELF_NOT_ALLOWED as ErrorCode;
    throw new BadRequestException({ message: FOLLOW_ERROR_MESSAGES.SELF_FOLLOW_NOT_ALLOWED, code });
  }

  /**
   * 대상 사용자 확인
   * @description 팔로우 대상이 존재하는지 검사
   */
  private async ensureTargetUserExists(followingId: string): Promise<void> {
    const targetUser = await this.usersRepository.findOne({ where: { id: followingId } });
    if (targetUser) return;

    const code = ERROR_CODES.FOLLOW_USER_NOT_FOUND as ErrorCode;
    throw new NotFoundException({ message: FOLLOW_ERROR_MESSAGES.USER_NOT_FOUND, code });
  }

  /**
   * 맞팔 셋 조회
   * @description 팔로워/팔로잉 기준 맞팔 아이디를 반환
   */
  private async findMutualSet(userId: string, candidateIds: string[], mode: MutualLookupMode): Promise<Set<string>> {
    if (!candidateIds.length) return new Set<string>();

    if (mode === 'followers') {
      const mutuals = await this.followsRepository.find({
        where: { followerId: userId, followingId: In(candidateIds) },
      });
      return new Set(mutuals.map(follow => follow.followingId));
    }

    const mutuals = await this.followsRepository.find({
      where: { followingId: userId, followerId: In(candidateIds) },
    });
    return new Set(mutuals.map(follow => follow.followerId));
  }
}
