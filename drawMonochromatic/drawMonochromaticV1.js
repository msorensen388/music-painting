import { decodeWaveToFloat32Channels } from "@echogarden/wave-codec";
import { createCanvas } from "canvas";

export const drawMonochromaticV1 = (data, maxSize) => {
  let [colors, opacities] = decodeWaveToFloat32Channels(data).audioChannels;
  const dataLength = colors.length;
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

  let colorRows = [];
  let opacityRows = [];

  // divide values into rows
  for (var i = 0; i < size; i++) {
    const start = i * size;
    const end = start + size;
    colorRows.push(colors.slice(start, end));
    opacityRows.push(opacities.slice(start, end));
  }

  const canvas = createCanvas(size, size);
  const context = canvas.getContext("2d");

  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      context.fillStyle = `rgba(255, ${colorRows[i][j]}, 255, ${opacityRows[i][j]})`;
      context.fillRect(i, j, 1, 1);
    }
  }

  return canvas;
};

const getMinMax = (values) => {
  let min = values[0];
  let max = 0;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > max) {
      max = values[i];
    }
    if (values[i] < min) {
      min = values[i];
    }
  }
  return [min, max];
};

// linear interpolation
function convertRange(value, r1, r2) {
  return ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];
}
