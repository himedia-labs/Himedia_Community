# Frontend Refactor Audit

## 현재 확인된 항목

1. `frontend/app/(routes)/(public)/main/components/postList/utils/index.ts`
- `shared/utils/date`를 route `utils/index.ts`에서 다시 export 중

2. `frontend/app/shared/utils/markdown/constants.ts`
- `*.utils.ts` 규칙 예외 파일

3. `frontend/app/shared/utils/markdown/helpers.ts`
- `*.utils.ts` 규칙 예외 파일

4. `frontend/app/(routes)/(public)/[profileId]/utils/buildFilteredPosts.utils.ts`
- `mypage/utils`의 `sortPostsByKey`를 cross-route import 중

5. `frontend/app/(routes)/(private)/mypage/components/tabs/MyPageCommentsTab.tsx`
- `posts/[postId]/utils`의 `splitCommentMentions`를 cross-route import 중

6. `frontend/app/(routes)/(private)/posts/edit/[postId]/hooks/usePostEditInitializer.ts`
- `posts/new/utils`의 `mapDraftToForm`를 cross-route import 중

7. `frontend/app/(routes)/(private)/posts/edit/[postId]/utils/createEditPreview.utils.ts`
- `posts/new/utils`의 `formatDateLabel`, `renderMarkdownPreview`를 cross-route import 중

8. `frontend/app/(routes)/(private)/posts/new/utils/renderMarkdownPreview.utils.ts`
- `shared/utils/markdown`를 그대로 재-export하는 wrapper util

9. route 레이어 인라인 `params` 타입 잔존
- `find-password`, `mypage`, `admin`, `posts/new`, `posts/[postId]` handlers/hooks 다수

## 추가 확인 항목

10. `frontend/app/shared/components/post/PostSummaryList.tsx`
- shared 컴포넌트가 public route 컴포넌트 `ListPostTagList`와 route CSS `postList.module.css`에 의존

11. `frontend/app/shared/types/admin.d.ts`
- shared type이 private route constants를 import

12. `frontend/app/(routes)/(private)/mypage/MyPage.skeleton.tsx`
- public route CSS `PostDetail.module.css`, `postList.module.css`에 의존

13. `frontend/app/(routes)/(public)/[profileId]/page.tsx`
- private route CSS `MyPage.module.css`와 public route CSS `PostDetail.module.css`를 직접 사용

14. `frontend/app/(routes)/(public)/[profileId]/ProfilePage.skeleton.tsx`
- private route skeleton `MyPage.skeleton`과 `MyPage.module.css`에 의존

15. `frontend/app/(routes)/(private)/mypage/components/MyPageDrafts.tsx`
- public route component `ListPostTagList`와 postList CSS에 의존

16. `frontend/app/(routes)/(private)/mypage/components/tabs/MyPageLikesTab.tsx`
- public route component `ListPostTagList`와 postList CSS에 의존

17. `frontend/app/(routes)/(private)/posts/edit/[postId]/page.tsx`
- `posts/new/components`, `posts/new/hooks`, `posts/new/PostCreate.module.css`에 의존

18. `frontend/app/(routes)/(private)/posts/draftId/page.tsx`
- `posts/new/page`를 그대로 re-export 하는 route alias

19. `frontend/app/(routes)/(private)/mypage/hooks/useMyPageData.ts`
- 페이지 통합 훅 성격이 강함 (`useXxxPage` 금지 규칙 취지 위반)

20. `frontend/app/(routes)/(private)/mypage/hooks/useMyPageTab.ts`
- 페이지 전용 탭 상태 훅으로 `useXxxPage` 금지 규칙 취지와 가까움

21. 큰 파일 후보
- `admin/page.tsx` 831줄
- `mypage/page.tsx` 791줄
- `main/components/postList/postList.tsx` 715줄
- `posts/[postId]/hooks/usePostDetailComments.ts` 681줄
- `posts/[postId]/components/PostDetailCommentsSection.tsx` 573줄
- `register/page.tsx` 560줄
## Pass 1

22. `frontend/app/(routes)/(public)/main/components/postList/utils/index.ts`
- shared `date` 재수출 잔존

23. `frontend/app/(routes)/(public)/register/page.tsx`
- `setStep`, `setEmailCode`, `setIsEmailVerified`, `setIsEmailCodeSent` 같은 page 내부 로컬 setter wrapper 함수 잔존

24. `frontend/app/(routes)/(private)/mypage/page.tsx`
- `handleSortToggle` 로컬 핸들러 잔존

25. `frontend/app/(routes)/(private)/mypage/components/MyPageDrafts.tsx`
- `formatDraftDate` 로컬 포맷 함수 잔존

26. `frontend/app/(routes)/(private)/posts/new/components/PostDetailsForm.tsx`
- `handleClickOutside` 로컬 이벤트 함수 잔존

27. `frontend/app/(routes)/(public)/main/components/postList/components/ListPostTagList.tsx`
- `measureTagWidth`, `handleResize` 로컬 유틸/이벤트 함수 잔존

28. `frontend/app/(routes)/(public)/posts/[postId]/components/PostDetailCommentsSection.tsx`
- `renderMentionLabel`, `renderMentionRole`, `renderCommentItem` 로컬 렌더 helper 잔존
