import assign from 'object-assign';
import { RecordDefinition, RecordAttributes } from './record-definition';

export default class DB {
  public tables: { [key: string]: Table<RecordAttributes> } = {};

  public create<A extends RecordAttributes, T>(
    recordDefinition: RecordDefinition<A, T>,
    params: Partial<A & T> = {},
  ): A {
    const table = this.getTable(recordDefinition);
    const nextId = table.reserveId();

    // 1. Base attrs with id.
    let attrs = { id: nextId } as A;

    // 2. RecordDefinition attrs
    attrs = assign(attrs, recordDefinition.attributes(nextId));

    const overrideAttrs: Partial<A> = {};

    if (recordDefinition.traits) {
      const traitKeys: string[] = [];
      for (const key in params) {
        if (key in recordDefinition.traits) {
          traitKeys.push(key);
        } else {
          overrideAttrs[key] = params[key];
        }
      }

      // 3. Trait attrs
      for (const key of traitKeys) {
        assign(attrs, recordDefinition.traits[key](attrs, params[key]!, this));
      }
    }

    // 4. Override attrs
    attrs = assign(attrs, overrideAttrs);

    table.addRecord(attrs);

    return attrs;
  }

  public find<A extends RecordAttributes>(
    recordDefinition: RecordDefinition<A>,
    id: string | number,
  ): A {
    const table = this.getTable(recordDefinition);
    return table.getRecord(id);
  }

  private getTable(recordDefinition: { 'type': string }) {
    const tableName = recordDefinition.type;
    let table = this.tables[tableName];

    if (!table) {
      table = this.tables[tableName] = new Table();
    }

    return table;
  }
}

class Table<A extends RecordAttributes> {
  public autoId: number = 1;
  public records: { [id: string]: A } = {};

  public reserveId() {
    return this.autoId++;
  }

  public addRecord(record: A) {
    this.records[record.id] = record;
  }

  public getRecord<Record extends A>(id: string | number): Record {
    return this.records[id] as Record;
  }
}

export { RecordDefinition };
export { RecordAttributes };
