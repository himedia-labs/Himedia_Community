declare module 'react-lines-ellipsis' {
  import type { ComponentType } from 'react';

  export type LinesEllipsisProps = {
    text: string;
    maxLine?: number | string;
    ellipsis?: string;
    trimRight?: boolean;
    basedOn?: 'letters' | 'words';
    className?: string;
  };

  const LinesEllipsis: ComponentType<LinesEllipsisProps>;
  export default LinesEllipsis;
}
