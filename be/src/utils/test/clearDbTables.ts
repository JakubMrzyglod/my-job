import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const clearDbTables = async (app: INestApplication) => {
  const dataSource = app.get(DataSource);

  const tables = await dataSource.query(`
  SELECT table_name AS "tableName"
  FROM information_schema.tables
  WHERE
    table_schema = DATABASE()
    AND table_name != 'migrations'
`);
  const truncatePromises = tables.map(({ tableName }) =>
    dataSource.query(`TRUNCATE ${tableName}`),
  );

  await Promise.all(truncatePromises);
};
