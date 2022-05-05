import { Document as BaseDocument } from '@rizefinance/rize-js/types/lib/core/typedefs/document.typedefs';
export type Document = BaseDocument;

interface BaseViewableDoc {
  base_64: string;
}

export type ViewableDoc = BaseViewableDoc;
