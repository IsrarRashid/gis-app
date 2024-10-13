import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the file path
  const filePath = path.resolve("./public/images/projectPdfFile/Picture1.jpg");

  // Read the image file
  const image = fs.readFileSync(filePath);

  // Convert the image to Base64
  const base64Image = image.toString("base64");

  // Respond with the Base64 string
  res
    .status(200)
    .json({ base64Image: `data:image/jpeg;base64,${base64Image}` });
}
