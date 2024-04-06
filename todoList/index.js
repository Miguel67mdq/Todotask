require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Task = require("./Schema/task");

const app = express();
app.use(cors());
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/* Connect to DB Mongo */
const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.80fl6sz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
//`mongodb+srv://NSM:Develop123!@cluster0.gaxlr2x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbURI);

const db = mongoose.connection;

/* Cuando se conecte sin error */
db.on("connected", () => {
  console.log(`Conexión establecida a la DB de Mongo`);
});

/* Cuando no se pueda conectar */
db.on("error", (err) => {
  console.error("Error de conexión a la base de datos:", err);
});

/* Cuando nos desconectemos */
db.on("disconnected", () => {
  console.log("Desconectado de la base de datos");
});

const Listen_Port = 3000;

app.post("/add", function (req, res) {
  const {
    title,
    description,
    state,
  } = req.body;

  const newTask = new Task({
    title: title,
    description: description,
    state: state,
   
  });

  newTask.save()
    .then((resultado) => {
      console.log("Tarea guardada exitosamente:", resultado);
    })
    .catch((error) => {
      console.log(error);
    });
 
  });

  

app.get("/task", async function (req, res) {
  let array = await Task.find();
  res.send(array);
});

app.put("/task/update", function (req, res) {
  Task.findOneAndUpdate(
    { title: "Node js" },
    { title: "NPM" },
    //{state: true},
  )
    .then((resultado) => {
      if (resultado) {
        console.log("Tarea actualizada exitosamente:", resultado);
      } else {
        console.log("Tarea no encontrada:");
      }
      return res.send(200);
    })
    .catch((error) => {
      console.error("Error al actualizar tarea:", error);
    });
});

app.delete('/task/delete/:id', async (req, res) => {
  try {
      const task = await Task.findById(req.params.id);
      if (task == null) {
          return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      await task.remove();
      res.json({ message: 'Tarea eliminada' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
/*app.delete("/task/delete", function () {
  Task.findOneAndDelete({ title: "Cena" })
    .then((resultado) => {
      if (resultado) {
        console.log("Tarea eliminada exitosamente:", resultado);
      } else {
        console.log("Tarea no encontrada:");
      }
    })
    .catch((error) => {
      console.error("Error al eliminar la tarea:", error);
    });
});*/


app.listen(Listen_Port, function() {
    console.log('Server corriendo http://localhost:' + Listen_Port + '/');
});