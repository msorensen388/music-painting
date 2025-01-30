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
    // default color intensities
    // setting these will create a monochromatic image
    colorIntensity: {
      red: 1,
      green: 1,
      blude: 1,
    },
    // this will override colorIntensity if true
    randomColorIntensity: true,
    backgroundColor: "#000000",
  };

  await drawMonochromaticV1(data, options);
  stop();
});
