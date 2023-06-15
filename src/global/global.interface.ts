export interface CustomNode {
  id: number;
  name: string;
  child?: CustomNode[];
}

export interface CustomDataNode {
  id: number;
  name: string;
  parentId?: number;
}

export interface NestedNode {
  id: number;
  name: string;
  children?: NestedNode[];
}
