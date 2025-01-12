import fs from "node:fs";
import { drawMonochromaticV1 } from "./drawMonochromatic/drawMonochromaticV1";

const file = "Sensoren_Technology_Is_Magic_2496.wav";

const maxSize = 100;

fs.readFile(`./${file}`, (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const canvas = drawMonochromaticV1(data, maxSize);

  // Write the image to file
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`./${file}-${new Date().toString()}.png`, buffer);
});
