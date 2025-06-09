const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = "./getEmployee.json";
const DEPT_FILE_PATH = "./departments.json";

app.get("/api/employees", (req, res) => {
  const data = fs.readFileSync(FILE_PATH);
  res.json(JSON.parse(data));
});

app.get("/api/departments", (req, res) => {
  try {
    const data = fs.readFileSync("./departments.json", "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to load departments" });
  }
});

app.post("/api/employees", (req, res) => {
  const newEmp = req.body;

  const raw = fs.readFileSync(FILE_PATH);
  const data = JSON.parse(raw);

  const index = data.data.findIndex((emp) => emp.email === newEmp.email);

  if (index >= 0) {
    data.data[index] = newEmp;
  } else {
    data.data.push(newEmp);
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json({ message: "Employee saved successfully" });
});

app.delete("/api/employees/:email", (req, res) => {
  const email = req.params.email;
  const raw = fs.readFileSync(FILE_PATH);
  const data = JSON.parse(raw);

  data.data = data.data.filter((emp) => emp.email !== email);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

  res.json({ message: "Employee deleted successfully" });
});

app.post("/api/departments", (req, res) => {
  const newDept = req.body;

  if (!newDept.deptId || !newDept.deptName) {
    return res
      .status(400)
      .json({ message: "Department ID and Name are required" });
  }

  try {
    const raw = fs.readFileSync(DEPT_FILE_PATH);
    const data = JSON.parse(raw);

    const exists = data.data.find((d) => d.deptId === newDept.deptId);
    if (exists) {
      return res.status(400).json({ message: "Department ID already exists" });
    }

    data.data.push(newDept);

    fs.writeFileSync(DEPT_FILE_PATH, JSON.stringify(data, null, 2));

    res.json({ message: "Department created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save department" });
  }
});

app.put("/api/departments/:deptId", (req, res) => {
  const deptId = req.params.deptId;
  const updatedDept = req.body;

  try {
    const raw = fs.readFileSync(DEPT_FILE_PATH);
    const data = JSON.parse(raw);

    const index = data.data.findIndex((d) => d.deptId === deptId);
    if (index === -1) {
      return res.status(404).json({ message: "Department not found" });
    }

    data.data[index] = updatedDept;

    fs.writeFileSync(DEPT_FILE_PATH, JSON.stringify(data, null, 2));

    res.json({ message: "Department updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update department" });
  }
});

app.delete("/api/departments/:deptId", (req, res) => {
  const deptId = req.params.deptId;

  try {
    const raw = fs.readFileSync(DEPT_FILE_PATH);
    const data = JSON.parse(raw);

    data.data = data.data.filter((d) => d.deptId !== deptId);

    fs.writeFileSync(DEPT_FILE_PATH, JSON.stringify(data, null, 2));

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete department" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
