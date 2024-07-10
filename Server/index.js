import { exec } from "child_process";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();
const static_path = process.env.HTML_PATH;
const filePath = process.env.TEST_PATH;

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(static_path));

//Configuracion guardado local de archivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "test");
  },
  filename: function (req, file, cb) {
    cb(null, "test_code.cpp");
  },
});

const upload = multer({ storage: storage });

//Configuracion de ejecucion de parser
const args = "-i test/test_code.cpp";
const command = `mtv.exe ${args}`;

const execParser = (res, error, stdout, stderr, content) => {
  if (error) {
    console.log(`stdout: ${stdout}`);
    console.log(stderr);
    if (!content) {
      res.json({ sucess: false, data: { stderr, stdout } });
    } else {
      res.json({ sucess: false, data: { stderr, stdout, content } });
    }
    return;
  }
  console.log(`stdout: ${stdout}`);
  if (!content) {
    res.json({ sucess: true, data: { stdout } });
  } else {
    res.json({ sucess: true, data: { stdout, content } });
  }
};

//Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(root, "dist", "index.html"));
});

app.post("/verify", (req, res) => {
  const { code } = req.body;

  if (code === undefined) {
    return res.status(400).json({ sucess: false, message: "code is required" });
  }

  fs.writeFile(filePath, code, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ sucess: false, message: "Error in writing file" });
    }

    exec(command, (error, stdout, stderr) => {
      execParser(res, error, stdout, stderr);
    });
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ sucess: false, message: "file is required" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res
        .status(500)
        .json({ sucess: false, message: "Error in reading file" });
    }

    exec(command, (error, stdout, stderr) => {
      execParser(res, error, stdout, stderr, data);
    });
  });
});

app.listen(5050, () => {
  console.log("Server is running on port 5050");
});
