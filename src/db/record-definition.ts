export interface RecordAttributes {
  id: number | string;
}

export interface RecordDefinition<Attributes extends RecordAttributes, Traits = {}> {
  type: string;
  attributes: (i: number) => Omit<Attributes, 'id'>;
  traits?: {
    [key in keyof Traits]: (record: Attributes, traitProp: Traits[key], server: any) => Partial<Attributes> | void
  };
}

// from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;
