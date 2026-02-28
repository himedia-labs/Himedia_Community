import { useEffect, useMemo, useRef, useState } from 'react';
import { IoIosArrowDown, IoMdCheckmark } from 'react-icons/io';

import styles from '../PostCreate.module.css';

import type { PostDetailsFormProps } from '@/app/shared/types/post';

/**
 * 게시물 상세 폼
 * @description 카테고리, 태그 입력 영역을 렌더링
 */
export default function PostDetailsForm({ category, tag }: PostDetailsFormProps) {
  // 카테고리
  const { categoryId, categories, isLoading, onCategoryChange } = category;
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const selectedCategoryLabel = useMemo(
    () => categories?.find(item => String(item.id) === categoryId)?.name ?? '카테고리를 선택하세요',
    [categories, categoryId],
  );

  // 태그
  const {
    tagInput,
    tags,
    tagLengthError,
    hasTagSuggestions,
    tagSuggestions,
    onTagChange,
    onTagKeyDown,
    onTagBlur,
    onTagCompositionStart,
    onTagCompositionEnd,
    onRemoveTag,
    onTagSuggestionMouseDown,
  } = tag;

  useEffect(() => {
    if (!isCategoryOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!categoryRef.current) return;
      if (categoryRef.current.contains(event.target as Node)) return;
      setIsCategoryOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryOpen]);

  return (
    <>
      <div className={styles.metaRow}>
        <div className={styles.metaField}>
          <label className={styles.metaLabel} htmlFor="post-category">
            카테고리
          </label>
          <div className={styles.selectWrapper} ref={categoryRef}>
            <button
              id="post-category"
              type="button"
              className={styles.categoryTrigger}
              onClick={() => setIsCategoryOpen(prev => !prev)}
              disabled={isLoading}
              aria-haspopup="listbox"
              aria-expanded={isCategoryOpen}
            >
              <span className={styles.categoryTriggerText}>{selectedCategoryLabel}</span>
              <IoIosArrowDown className={styles.selectIcon} aria-hidden />
            </button>
            {isCategoryOpen ? (
              <div className={styles.categoryMenu} role="listbox" aria-label="카테고리 목록">
                <button
                  type="button"
                  className={!categoryId ? `${styles.categoryOption} ${styles.categoryOptionActive}` : styles.categoryOption}
                  onClick={() => {
                    onCategoryChange('');
                    setIsCategoryOpen(false);
                  }}
                >
                  카테고리를 선택하세요
                </button>
                {(categories ?? []).map(category => {
                  const isActive = String(category.id) === categoryId;
                  const className = isActive ? `${styles.categoryOption} ${styles.categoryOptionActive}` : styles.categoryOption;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      className={className}
                      onClick={() => {
                        onCategoryChange(String(category.id));
                        setIsCategoryOpen(false);
                      }}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.metaField}>
          <label className={styles.metaLabel} htmlFor="post-tags">
            태그
          </label>
          <div className={`${styles.metaControl} ${styles.tagInput} ${tagLengthError ? styles.tagInputError : ''}`}>
            {tags.map(tag => (
              <button
                key={tag}
                type="button"
                className={styles.tagChip}
                onClick={() => onRemoveTag(tag)}
                aria-label={`태그 삭제: ${tag}`}
              >
                #{tag}
              </button>
            ))}
            <input
              id="post-tags"
              className={styles.tagInputField}
              type="text"
              placeholder="태그 입력 후 스페이스/엔터"
              value={tagInput}
              onChange={onTagChange}
              onKeyDown={onTagKeyDown}
              onBlur={onTagBlur}
              onCompositionStart={onTagCompositionStart}
              onCompositionEnd={onTagCompositionEnd}
            />
          </div>
          {hasTagSuggestions ? (
            <div className={styles.tagSuggestions} role="listbox" aria-label="태그 추천">
              {tagSuggestions.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className={styles.tagSuggestionItem}
                  onMouseDown={onTagSuggestionMouseDown(tag.name)}
                >
                  <span className={styles.tagSuggestionName}>#{tag.name}</span>
                  <span className={styles.tagSuggestionCount}>게시물 {tag.postCount.toLocaleString()}개</span>
                  <span className={styles.tagSuggestionIcon} aria-hidden="true">
                    <IoMdCheckmark />
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
