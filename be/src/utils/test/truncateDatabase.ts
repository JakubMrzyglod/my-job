import { PrismaClient } from '@prisma/client';

export default async () => {
  const prisma = new PrismaClient();
  const tables = await prisma.$queryRaw<{ tableName: string }[]>`
    SELECT table_name AS "tableName"
    FROM information_schema.tables
    WHERE
      table_schema = DATABASE()
      AND table_name != '_prisma_migrations'
  `;

  const tableNames = tables.map(({ tableName }) =>
    tableName.toLocaleLowerCase(),
  );

  const clearTablePromises = tableNames.map((name) =>
    prisma[name]?.deleteMany(),
  );

  await Promise.all(clearTablePromises);
};
