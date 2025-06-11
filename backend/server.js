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

  if (!newEmp.firstName || !newEmp.lastName || !newEmp.email) {
    return res
      .status(400)
      .json({ message: "Missing required employee fields." });
  }

  const raw = fs.readFileSync(FILE_PATH);
  const data = JSON.parse(raw);

  if (newEmp.empId) {
    const index = data.data.findIndex((emp) => emp.empId === newEmp.empId);
    if (index >= 0) {
      data.data[index] = { ...data.data[index], ...newEmp };
      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
      return res.json({ message: "Employee updated successfully" });
    }
  }

  const maxId = data.data.reduce(
    (max, emp) => Math.max(max, emp.empId || 0),
    0
  );
  newEmp.empId = maxId + 1;

  data.data.push(newEmp);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

  res.json({ message: "Employee created successfully", empId: newEmp.empId });
});

app.patch("/api/employee/:empId", (req, res) => {
  const empId = parseInt(req.params.empId);
  const updates = req.body;

  try {
    const raw = fs.readFileSync(FILE_PATH);
    const data = JSON.parse(raw);

    const index = data.data.findIndex((emp) => emp.empId === empId);
    if (index === -1) {
      return res.status(404).json({ message: "Employee not found" });
    }

    data.data[index] = { ...data.data[index], ...updates };

    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    res.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).jsonp({ message: "Failed to update employee" });
  }
});

app.delete("/api/employees/:empId", (req, res) => {
  const empId = parseInt(req.params.empId);
  const raw = fs.readFileSync(FILE_PATH);
  const data = JSON.parse(raw);

  const initialLength = data.data.length;
  data.data = data.data.filter((emp) => emp.empId !== empId);

  if (data.data.length === initialLength) {
    return res.status(404).json({ message: "Employee not found" });
  }

  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
  res.json({ message: "Employee Deleted Successfully!" });
});

app.post("/api/departments", (req, res) => {
  const newDept = req.body;

  if (!newDept.deptName) {
    return res.status(400).json({ message: "Department Name is required" });
  }

  try {
    const raw = fs.readFileSync(DEPT_FILE_PATH);
    const data = JSON.parse(raw);

    // const exists = data.data.find((d) => d.deptId === newDept.deptId);
    // if (exists) {
    //   return res.status(400).json({ message: "Department ID already exists" });
    // }

    const maxId = data.data.reduce((max, dept) => {
      const numericId = parseInt(dept.deptId?.replace("d", "")) || 0;
      return Math.max(max, numericId);
    }, 0);
    newDept.deptId = `d${maxId + 1}`;

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
