import { verbose, Database } from "sqlite3";

const sqlite3 = verbose();

function resolveCb(resolve: Function, reject: Function) {
  return (err: Error | null, result: any) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      resolve(result);
    }
  };
}

export function querySqlite(db: Database, sql: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, resolveCb(resolve, reject));
  });
}

export function openSqlite(path: string) {
  const db = new sqlite3.Database(path);
  return db;
}
