require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. DATABASE CONNECTION 
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.log("Database Error:", err));

// 2. SCHEMAS & MODELS
const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, unique: true, required: true },
    fullName: String,
    email: String,
    department: String
});
const Employee = mongoose.model('Employee', employeeSchema);

const attendanceSchema = new mongoose.Schema({
    employeeId: String,
    fullName: String,
    date: String,
    status: String
});
const Attendance = mongoose.model('Attendance', attendanceSchema);

// 3. API ROUTES

// --- Employee Routes ---
app.get('/api/employees', async (req, res) => {
    const emps = await Employee.find();
    res.json(emps);
});

app.post('/api/employees', async (req, res) => {
    try {
        const newEmp = new Employee(req.body);
        await newEmp.save();
        res.status(201).json(newEmp);
    } catch (err) {
        res.status(400).json({ message: "Duplicate ID or Invalid Data" });
    }
});

app.delete('/api/employees/:id', async (req, res) => {
    await Employee.findOneAndDelete({ employeeId: req.params.id });
    res.json({ message: "Deleted" });
});

// --- Attendance Routes ---
app.get('/api/attendance', async (req, res) => {
    const records = await Attendance.find().sort({ date: -1 });
    res.json(records);
});

app.post('/api/attendance', async (req, res) => {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).json(record);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
