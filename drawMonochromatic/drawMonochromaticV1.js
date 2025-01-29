import { decodeWaveToFloat32Channels } from "@echogarden/wave-codec";
import { createCanvas } from "canvas";
import {
  convertRange,
  getMinMax,
  exportCanvasToPng,
  exportToCsv,
  timestampFileName,
} from "../utils.js";

export const drawMonochromaticV1 = (data, userOptions) => {
  let [colors, opacities] = decodeWaveToFloat32Channels(data).audioChannels;
  const dataLength = colors.length;

  const { fileName, offset, maxSize, csv } = Object.assign(
    {
      fileName: "output-image",
      offset: 0,
      maxSize: null,
      csv: false,
    },
    userOptions
  );

  console.log("Number of bytes: ", dataLength);
  const size = maxSize || Math.floor(Math.sqrt(dataLength));

  // Get the min and max values of everything to make calculations with later
  // min is only used to adjust value range so we need the absolute value to bring everything to min 0
  const [colorMin, colorMax] = getMinMax(colors);
  const [opacityMin, opacityMax] = getMinMax(opacities);

  // Distribute values across acceptible range
  colors = colors.map((color) =>
    // color values within range of 0 - 255
    convertRange(color, [colorMin, colorMax], [0, 255])
  );
  opacities = opacities.map((opacity) =>
    // opacity values within range of 0 to 1
    convertRange(opacity, [opacityMin, opacityMax], [0, 1])
  );

  const timestampedFileName = timestampFileName(fileName);

  // while theres still data, loop.
  let startPoint = 0;
  while (startPoint < colors.length) {
    let colorRows = [];
    let opacityRows = [];

    const endPoint = startPoint + size;

    // divide values into rows
    for (var i = startPoint; i < endPoint; i++) {
      // const start = i * size;
      // const end = start + size;
      colorRows.push(colors.slice(startPoint, endPoint));
      opacityRows.push(opacities.slice(startPoint, endPoint));
    }

    // if (csv) exportToCsv(colorRows, fileName);

    // render the data points to a canvas
    const canvas = createCanvas(size, size);
    const context = canvas.getContext("2d");

    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        const colorValue = colorRows[i] ? colorRows[i][j] : 0;
        const opacityValue = opacityRows[i] ? opacityRows[i][j] : 1;

        // switch (colorChannel) {
        //   case 0:
        // }
        context.fillStyle = `rgba(255, ${colorValue}, 255, ${opacityValue})`;
        context.fillRect(i, j, 1, 1);
        startPoint++;
      }
    }

    exportCanvasToPng(canvas, timestampedFileName, startPoint, endPoint);
  }
};
