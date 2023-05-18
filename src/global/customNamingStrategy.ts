import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
import { createHash } from 'crypto';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class CustomNamingStrategy
  extends SnakeNamingStrategy
  implements NamingStrategyInterface
{
  foreignKeyName(
    tableOrName: Table | string,
    columnNames: string[],
    referencedTablePath?: string,
    // referencedColumnNames?: string[]
  ): string {
    tableOrName =
      typeof tableOrName === 'string' ? tableOrName : tableOrName.name;

    const name = columnNames.reduce(
      (name, column) => `${name}_${column}`,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${tableOrName}_${referencedTablePath}`,
    );

    //   '@@ name : ',
    //   `fk_${crypto.createHash('md5').update(name).digest('hex')}`
    // );

    return `fk_${createHash('md5').update(name).digest('hex')}`;
    // return name;
  }
}
