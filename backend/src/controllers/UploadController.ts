import { Request, Response } from "express";
import path from "path";
import { T } from "../constants/texts";
import { generateUploadFileName } from "../utils/generateUploadFileName";

export class UploadController {
  async upload(req: Request, res: Response): Promise<void> {
    if (!req.files || !req.files.file) {
      res.status(500).send({ success: false, msg: T.UPLOAD_FILE_NOT_FOUND });
      return;
    }

    const myFile = req.files.file as any;
    const type = "png";
    const filename = generateUploadFileName() + "." + type;
    const uploadPath = path.join(__dirname, "../../public", filename);

    myFile.mv(uploadPath, (err: Error) => {
      if (err) {
        console.error("Upload error:", err);
        res.status(500).send({ success: false, msg: T.UPLOAD_FILE_ERROR });
        return;
      }

      const BACKEND_URL = process.env.BACKEND_URL;
      res.send({
        success: true,
        name: filename,
        path: `${BACKEND_URL}/${filename}`,
      });
    });
  }
}

