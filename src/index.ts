import fs from "fs";
import util from "util";
import { getManifest } from "./api";

const readFile = util.promisify(fs.readFile);

const baseLang = "en";

interface LastRun {
  id: string;
}

async function getLastRun(): Promise<LastRun> {
  const lastRun = JSON.parse((await readFile("./lastrun.json")).toString());

  return lastRun;
}

async function main() {
  const data = await getManifest();

  const currentUrl = data.mobileWorldContentPaths[baseLang];
  const lastRun = await getLastRun();

  console.log("currentUrl:", currentUrl);
  console.log("   lastRun:", lastRun.id);

  if (currentUrl === lastRun.id) {
    console.log("URLs are the same, quitting");
    return;
  }

  console.log("go time");
}

main();
