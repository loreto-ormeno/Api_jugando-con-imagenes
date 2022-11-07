const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(fileUpload());
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  fs.readFile("public/formulario.html", "utf8", (err, data) => {
    res.end(data);
  });
});
app.get("/collage", (req, res) => {
  fs.readFile("public/collage.html", "utf8", (err, data) => {
    res.end(data);
  });
});

app.post("/imagen", (req, res) => {
  let sampleFile;
  let uploadPath;
  console.log(req.files.target_file.size);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  if (req.files.target_file.size > 5242880) {
    return res.status(400).send("La imagen no debe pesar más de 5mb");
  }
  sampleFile = req.files.target_file;
  uploadPath = __dirname + "/public/imgs/imagen-" + req.body.posicion + ".jpg";
  sampleFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/collage");
    res.end();
  });
});

app.get("/deleteImg/:nombre", (req, res) => {
  fs.unlink("public/imgs/" + req.params.nombre, (err) => {
    if (err) console.log(err);
    else {
      console.log("Deleted file: " + req.params.nombre);
      res.redirect("/collage");
      res.end();
    }
  });
});

app.listen("3000", () => {
  console.log("Servidor levantado en el puerto 3000");
});
