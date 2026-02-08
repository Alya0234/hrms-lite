 HRMS Pro – Smart Attendance & Workforce Manager

HRMS Pro is a full-stack **MERN (MongoDB, Express, React, Node.js)** web application built to manage employee records and track attendance in a simple, reliable way.
It provides a clean, responsive dashboard with real-time attendance insights and built-in data validation to avoid errors.


## 🚀 Key Features

### Employee Management

* Complete **CRUD operations** to add, view, update, and delete employee records
* Centralized staff database for easy access and maintenance

### Smart Attendance Tracking

* Real-time attendance marking
* Automatic **duplicate prevention** so an employee cannot be marked more than once on the same date

### Reliability Analytics

* A **Smart History** section that calculates a **Reliability Score (%)** for each employee
* The score reflects attendance consistency based on historical data

### Contextual Remarks

* Add notes such as *Sick Leave*, *Late Arrival*, or *Work From Home* to individual attendance entries

### Cloud-Based Storage

* Uses **MongoDB Atlas** for secure, persistent, and real-time data storage

### Modern UI/UX

* Responsive and clean dashboard design
* Uses the **Inter font**, custom CSS-in-JS styling, and grid-based layouts for a professional look

---

## 🛠️ Tech Stack

| Layer       | Technology                 |
| ----------- | -------------------------- |
| Frontend    | React.js, Axios, CSS-in-JS |
| Backend     | Node.js, Express.js        |
| Database    | MongoDB Atlas (Cloud)      |
| Environment | Dotenv                     |

---

## 📦 Installation & Setup

### 1. Prerequisites

* Node.js installed
* MongoDB Atlas cluster URI

### 2. Backend Setup

```bash
cd backend
npm install
# create a .env file and add MONGO_URI
node server.js
```

### 3. Frontend Setup

```bash
cd hrms-lite
npm install
npm start
```

---

## 🧠 Logic & Data Flow

### Validation

Before sending a POST request, the frontend checks existing attendance records using the `.some()` method to prevent duplicate entries for the same date.

### Reliability Score Calculation

[
\text{Reliability} = \left( \frac{\text{Total Present Logs}}{\text{Total Attendance Records}} \right) \times 100
]

### Communication

All frontend–backend communication is handled through a **RESTful API** using JSON.

---

## 🌟 Future Enhancements

* Export attendance reports as **CSV / Excel**
* Biometric attendance support (fingerprint or face recognition)
* **Role-based access control** for Admin and Employees

---

If you want, I can:

* Rewrite this for **resume projects**
* Convert it into a **GitHub README**
* Simplify it even more for **college submissions**
* Add **interview-ready explanations** for each feature

Annoying levels of polish are available on request.
