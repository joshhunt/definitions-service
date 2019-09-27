import path from "path";
import fs from "fs";

import unzip from "unzip-stream";

export function unzipFile(
  inputFilePath: string
): Promise<{ outFilePath: string }> {
  return new Promise(resolve => {
    fs.createReadStream(inputFilePath)
      .pipe(unzip.Parse())
      .on("entry", function(entry) {
        const filePath = entry.path;
        console.log({ filePath });

        if (!filePath.match(/content$/)) {
          entry.autodrain();
          return;
        }

        const outFilePath = path.join(".", "data", filePath);
        console.log("extracting to", outFilePath);

        entry.pipe(fs.createWriteStream(outFilePath)).on("finish", () => {
          resolve({ outFilePath });
        });
      });
  });
}
