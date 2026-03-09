// 문서 데이터
export interface PolicyDocument {
  type: 'terms' | 'privacy';
  title: string;
  announcedDate: string;
  revisionHistory: string;
  markdownContent: string;
}
