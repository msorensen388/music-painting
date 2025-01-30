import { decodeWaveToFloat32Channels } from "@echogarden/wave-codec";
import { createCanvas } from "canvas";
import {
  convertRange,
  getMinMax,
  exportCanvasToPng,
  timestampFileName,
} from "../utils.js";

export const drawMonochromaticV1 = (data, userOptions) => {
  let [colors, opacities] = decodeWaveToFloat32Channels(data).audioChannels;
  const dataLength = colors.length;

  const { fileName, maxSize, colorModifiers, backgroundColor } = Object.assign(
    {
      fileName: "output-image",
      maxSize: null,
      randomColorIntensity: {
        red: 1,
        green: 1,
        blude: 1,
      },
      random: false,
    },
    userOptions
  );

  console.log("Number of bytes: ", dataLength);
  const size = maxSize || Math.floor(Math.sqrt(dataLength));
  const imageDataLength = size * size; // x * y

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

  // Color intensity adjustments
  const { red, green, blue } = useMemo(() => {});

  // while theres still data, loop through and create more images.
  let dataIndex = 0;
  while (dataIndex < colors.length) {
    let colorRows = [];
    let opacityRows = [];

    console.log(dataIndex);

    // remove a chunk of data and put it in a 2D array of dimensions {size}x{size}
    // these will be the rows and columns that represent pixel color values
    const currentImageData = colors.slice(
      dataIndex,
      dataIndex + imageDataLength
    );

    for (var i = 0; i < currentImageData.length; i++) {
      const start = i * size + dataIndex; // offset by our place in the original data
      const end = start + size;
      colorRows.push(colors.slice(start, end));
      opacityRows.push(opacities.slice(start, end));
    }

    // render the data points to a canvas
    const canvas = createCanvas(size, size);
    const context = canvas.getContext("2d");

    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    for (var i = 0; i < size; i++) {
      for (var j = 0; j < size; j++) {
        const colorValue = colorRows[i] ? colorRows[i][j] : 0;
        const opacityValue = opacityRows[i] ? opacityRows[i][j] : 1;

        // switch (colorChannel) {
        //   case 0:
        // }
        context.fillStyle = `rgba(${colorValue * colorModifiers[0]}, ${
          colorValue * colorModifiers[1]
        }, ${colorValue * colorModifiers[2]}, ${opacityValue})`;
        context.fillRect(i, j, 1, 1);
      }
    }

    exportCanvasToPng(
      canvas,
      timestampedFileName,
      dataIndex,
      dataIndex + imageDataLength
    );

    dataIndex += imageDataLength;
  }
};
