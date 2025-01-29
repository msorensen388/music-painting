import fs from "node:fs";
import { drawMonochromaticV1 } from "./drawMonochromatic/drawMonochromaticV1.js";
import CLILoadingAnimation from "cli-loading-animation";

const { loading } = CLILoadingAnimation;

const fileName = "Sensoren_Technology_Is_Magic_2496.wav";

const { start, stop } = loading("Generating image...");

start();

fs.readFile(`./${fileName}`, async (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const options = {
    fileName,
    offset: 4000,
    maxSize: 1000,
    csv: false,
  };

  await drawMonochromaticV1(data, options);
  stop();
});
