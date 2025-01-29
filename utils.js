import fs from "node:fs";

const imagePath = "./output/images/";
const csvPath = "./output/csv/";

export const getMinMax = (values) => {
  let min = values[0];
  let max = 0;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > max) max = values[i];
    if (values[i] < min) min = values[i];
  }
  return [min, max];
};

// linear interpolation
export const convertRange = (value, r1, r2) =>
  ((value - r1[0]) * (r2[1] - r2[0])) / (r1[1] - r1[0]) + r2[0];

export const timestampFileName = (fileName) => {
  const date = new Date().toUTCString().replace(/ /g, "_");
  return `${fileName}-${date}`;
};

const createOutputFolders = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const exportCanvasToPng = (canvas, fileName, start, end) =>
  new Promise((resolve, reject) => {
    // Write the image to file
    const buffer = canvas.toBuffer("image/png");

    const fullPath = `${imagePath}/${fileName}`;

    createOutputFolders(fullPath);

    fs.writeFile(`${fullPath}/${start}_${end}.png`, buffer, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

export const exportToCsv = (rows, fileName) => {
  let csvContent = "";
  rows.forEach((rowItems, index) => {
    var dataString = rowItems.join(",");
    csvContent += index < rows.length ? dataString + "\n" : dataString;
  });

  createOutputFolders(csvPath);

  fs.writeFile(
    `${csvPath}${timestampFileName(fileName)}.csv`,
    csvContent,
    (err) => {
      if (err) console.error(err);
    }
  );
};
