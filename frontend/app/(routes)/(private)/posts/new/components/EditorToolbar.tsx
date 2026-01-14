import {
  HiOutlineBold,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCodeBracket,
  HiOutlineH1,
  HiOutlineH2,
  HiOutlineH3,
  HiOutlineItalic,
  HiOutlineLink,
  HiOutlineListBullet,
  HiOutlineNumberedList,
  HiOutlinePhoto,
  HiOutlineStrikethrough,
  HiOutlineUnderline,
} from 'react-icons/hi2';

import type { EditorToolbarProps, ToolbarItem } from '@/app/shared/types/post';

import styles from '../PostCreate.module.css';

export default function EditorToolbar({
  onHeading,
  onBold,
  onItalic,
  onUnderline,
  onStrike,
  onQuote,
  onCode,
  onLink,
  onImage,
  onBullet,
  onNumbered,
}: EditorToolbarProps) {
  const toolbarItems: ToolbarItem[] = [
    { id: 'h1', icon: HiOutlineH1, label: '제목 1', title: '제목 1', onClick: () => onHeading(1) },
    { id: 'h2', icon: HiOutlineH2, label: '제목 2', title: '제목 2', onClick: () => onHeading(2) },
    { id: 'h3', icon: HiOutlineH3, label: '제목 3', title: '제목 3', onClick: () => onHeading(3) },
    'separator',
    { id: 'bold', icon: HiOutlineBold, label: '굵게', title: '굵게', onClick: onBold },
    { id: 'italic', icon: HiOutlineItalic, label: '기울임', title: '기울임', onClick: onItalic },
    { id: 'underline', icon: HiOutlineUnderline, label: '밑줄', title: '밑줄', onClick: onUnderline },
    { id: 'strike', icon: HiOutlineStrikethrough, label: '취소선', title: '취소선', onClick: onStrike },
    'separator',
    { id: 'quote', icon: HiOutlineChatBubbleLeftRight, label: '인용', title: '인용', onClick: onQuote },
    { id: 'code', icon: HiOutlineCodeBracket, label: '코드', title: '코드', onClick: onCode },
    'separator',
    { id: 'link', icon: HiOutlineLink, label: '링크', title: '링크', onClick: onLink },
    { id: 'image', icon: HiOutlinePhoto, label: '이미지', title: '이미지', onClick: onImage },
    'separator',
    { id: 'bullet', icon: HiOutlineListBullet, label: '불릿 리스트', title: '불릿 리스트', onClick: onBullet },
    { id: 'numbered', icon: HiOutlineNumberedList, label: '번호 리스트', title: '번호 리스트', onClick: onNumbered },
  ];

  return (
    <div className={styles.headingToolbar} role="group" aria-label="서식 도구">
      {toolbarItems.map((item, index) => {
        if (item === 'separator') {
          return <span key={`separator-${index}`} className={styles.headingSeparator} aria-hidden="true" />;
        }

        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            className={styles.headingButton}
            aria-label={item.label}
            title={item.title}
            onClick={item.onClick}
          >
            <Icon aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
