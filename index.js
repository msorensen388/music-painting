import fs from "node:fs";
import { drawMonochromaticV1 } from "./drawMonochromatic/drawMonochromaticV1.js";
import CLILoadingAnimation from "cli-loading-animation";

const { loading } = CLILoadingAnimation;

const fileName = "Krankenwagen (JM Master A).wav";

const { start, stop } = loading("Generating image...");

start();

fs.readFile(`./${fileName}`, async (err, data) => {
  if (err) {
    stop();
    console.error(err);
    return;
  }

  const options = {
    fileName,
    maxSize: 1000,
    csv: false,
    colorModifiers: [Math.random(), Math.random(), Math.random()],
    backgroundColor: "#000000",
  };

  await drawMonochromaticV1(data, options);
  stop();
});
