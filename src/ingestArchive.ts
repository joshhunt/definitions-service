import { eachLimit, forEach } from "async";
import { unzipFile } from "./lib/zip";
import { openSqlite, querySqlite } from "./lib/sqlite";
import { Definition, ready } from "./lib/db";
import { reject, resolve } from "bluebird";

const HASH_REGEX = /_([a-f0-9]{32})/;
const LIMIT = 10;

type DefinitionRow = { id?: number; key?: string; json: string };

function asyncForEach<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<any>
) {
  return new Promise((resolve, reject) => {
    eachLimit(
      items,
      limit,
      async (item, cb) => {
        try {
          await fn(item);
        } catch (error) {
          cb(error);
          return;
        }

        cb();
      },
      err => {
        err ? reject(err) : resolve();
      }
    );
  });
}

const archives = [
  {
    archive: "./data/world_sql_content_6a74c8e2272ec3f899cba933f5bcc04c.zip",
    originalDate: new Date("Monday, August 12, 2019")
  },
  {
    archive: "./data/world_sql_content_2908c011844663c405d1bf33635c8ca4.zip",
    originalDate: new Date("Sunday, September 1, 2019")
  },
  {
    archive: "./data/world_sql_content_ba92e715ad63581b96a3f32f0211f8b6.zip",
    originalDate: new Date("Tuesday, July 9, 2019")
  },
  {
    archive: "./data/world_sql_content_bfbac743f64c771657213215744b2e3c.zip",
    originalDate: new Date("Monday, July 22, 2019")
  },
  {
    archive: "./data/world_sql_content_d84a82d5c1fb3da3786b8dc29d6ecf07.zip",
    originalDate: new Date("Friday, July 26, 2019")
  }
];

async function doInput(input: { archive: string; originalDate: Date }) {
  await ready;

  const archivePath = input.archive;
  const match = archivePath.match(HASH_REGEX);
  const archiveHash = match && match[1];
  console.log("Current version", archiveHash);

  const out = await unzipFile(archivePath);
  const db = openSqlite(out.outFilePath);

  const tableNames: { name: string }[] = await querySqlite(
    db,
    "SELECT name FROM sqlite_master WHERE type='table';"
  );

  console.log("Got tables", tableNames);

  for (const tableNameRow of tableNames) {
    const entries: DefinitionRow[] = await querySqlite(
      db,
      `select * from ${tableNameRow.name}`
    );

    console.log(tableNameRow.name, entries.length);

    await asyncForEach(entries, LIMIT, async row => {
      const baseKey = row.id || row.key;

      if (!baseKey) {
        throw new Error("Invalid ID or key on row");
      }

      const key =
        typeof baseKey === "string" ? baseKey : (baseKey >>> 0).toString();
      console.log(tableNameRow.name, key);

      await Definition.upsert({
        version: archiveHash,
        table: tableNameRow.name,
        key,
        json: JSON.parse(row.json),
        createdAt: input.originalDate
      });
    });

    console.log("");
  }
}

async function main() {
  for (const input of archives) {
    await doInput(input);
  }
}

main();
