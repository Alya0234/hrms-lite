import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [, setLoading] = useState(true);
  
  const [empForm, setEmpForm] = useState({ employeeId: '', fullName: '', email: '', department: '' });
  const [attForm, setAttForm] = useState({ employeeId: '', date: new Date().toISOString().split('T')[0], status: 'Present' });

  const API_BASE = "http://localhost:5000/api";

  const fetchData = async () => {
    try {
      const empRes = await axios.get(`${API_BASE}/employees`);
      const attRes = await axios.get(`${API_BASE}/attendance`);
      setEmployees(empRes.data);
      setAttendanceList(attRes.data);
    } catch (err) { console.error("Sync Error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/employees`, empForm);
      setEmpForm({ employeeId: '', fullName: '', email: '', department: '' });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || "Error adding employee"); }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    const selectedEmp = employees.find(emp => emp.employeeId === attForm.employeeId);
    if (!selectedEmp) return alert("Please select an employee first.");

    // SMART VALIDATION: Prevent marking attendance twice for the same date
    const alreadyMarked = attendanceList.some(
      (log) => log.employeeId === attForm.employeeId && log.date === attForm.date
    );

    if (alreadyMarked) {
      return alert(`Attendance already marked for ${selectedEmp.fullName} on this date!`);
    }

    const record = { ...attForm, fullName: selectedEmp.fullName };
    await axios.post(`${API_BASE}/attendance`, record);
    fetchData();
    alert("Attendance Logged Successfully!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this employee from directory?")) {
      await axios.delete(`${API_BASE}/employees/${id}`);
      fetchData();
    }
  };

  return (
    <div style={styles.dashboard}>
      <nav style={styles.sidebar}>
        <div style={styles.logo}>HRMS <span style={{color: '#38bdf8'}}>PRO</span></div>
        <div style={styles.navItemActive}>📊 Dashboard</div>
      </nav>

      <main style={styles.main}>
        <header style={styles.topBar}>
          <h2>Workforce Administration</h2>
          <div style={styles.statsContainer}>
            Active Employees: <b>{employees.length}</b>
          </div>
        </header>

        <div style={styles.contentGrid}>
          {/* REGISTRATION CARD */}
          <section style={styles.card}>
            <h3 style={styles.cardHeader}>Register New Staff</h3>
            <form onSubmit={handleAddEmployee} style={styles.form}>
              <input style={styles.input} placeholder="Employee ID" value={empForm.employeeId} onChange={e => setEmpForm({...empForm, employeeId: e.target.value})} required />
              <input style={styles.input} placeholder="Full Name" value={empForm.fullName} onChange={e => setEmpForm({...empForm, fullName: e.target.value})} required />
              <input style={styles.input} type="email" placeholder="Email Address" value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} required />
              <input style={styles.input} placeholder="Department" value={empForm.department} onChange={e => setEmpForm({...empForm, department: e.target.value})} required />
              <button style={styles.primaryBtn} type="submit">Complete Registration</button>
            </form>
          </section>

          {/* ATTENDANCE MARKER CARD */}
          <section style={styles.card}>
            <h3 style={styles.cardHeader}>Daily Attendance Log</h3>
            <form onSubmit={handleMarkAttendance} style={styles.form}>
              <select style={styles.input} value={attForm.employeeId} onChange={e => setAttForm({...attForm, employeeId: e.target.value})} required>
                <option value="">Select Employee</option>
                {employees.map(emp => <option key={emp.employeeId} value={emp.employeeId}>{emp.fullName}</option>)}
              </select>
              <input style={styles.input} type="date" value={attForm.date} onChange={e => setAttForm({...attForm, date: e.target.value})} />
              <select style={styles.input} value={attForm.status} onChange={e => setAttForm({...attForm, status: e.target.value})}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              <button style={styles.secondaryBtn} type="submit">Submit Record</button>
            </form>
          </section>
        </div>

        {/* STAFF DIRECTORY TABLE */}
        <section style={{...styles.card, marginTop: '25px'}}>
          <h3 style={styles.cardHeader}>Employee Directory</h3>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr><th>NAME & ID</th><th>DEPARTMENT</th><th>MANAGEMENT</th></tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.employeeId} style={styles.tableRow}>
                  <td>
                    <div style={{fontWeight: '600'}}>{emp.fullName}</div>
                    <div style={{fontSize: '11px', color: '#64748b'}}>{emp.employeeId}</div>
                  </td>
                  <td>{emp.department}</td>
                  <td><button onClick={() => handleDelete(emp.employeeId)} style={styles.delBtn}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* SMART ATTENDANCE LOGS WITH ANALYTICS */}
        <section style={{...styles.card, marginTop: '25px'}}>
          <h3 style={styles.cardHeader}>Smart Attendance History</h3>
          <table style={styles.table}>
            <thead style={styles.tableHead}>
              <tr><th>DATE</th><th>EMPLOYEE</th><th>STATUS</th><th>RELIABILITY</th></tr>
            </thead>
            <tbody>
              {attendanceList.map((log, i) => {
                const userLogs = attendanceList.filter(a => a.employeeId === log.employeeId);
                const presentCount = userLogs.filter(a => a.status === 'Present').length;
                const percentage = userLogs.length > 0 ? ((presentCount / userLogs.length) * 100).toFixed(0) : 0;

                return (
                  <tr key={i} style={styles.tableRow}>
                    <td>{log.date}</td>
                    <td>{log.fullName}</td>
                    <td>
                      <span style={{
                        ...styles.badge, 
                        backgroundColor: log.status === 'Present' ? '#dcfce7' : '#fee2e2',
                        color: log.status === 'Present' ? '#166534' : '#991b1b',
                      }}>
                        {log.status}
                      </span>
                    </td>
                    <td>
                      <div style={{fontSize: '12px'}}>
                        {percentage}% Present
                        <div style={styles.progressBg}>
                          <div style={{
                            width: `${percentage}%`, 
                            height: '100%', 
                            backgroundColor: percentage > 75 ? '#22c55e' : '#f59e0b',
                            borderRadius: '10px'
                          }} />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

const styles = {
  dashboard: { display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: '"Inter", sans-serif' },
  sidebar: { width: '220px', backgroundColor: '#0f172a', color: 'white', padding: '30px 20px' },
  logo: { fontSize: '22px', fontWeight: '800', marginBottom: '40px', color: '#38bdf8' },
  navItem: { padding: '12px 16px', color: '#94a3b8', borderRadius: '8px', marginBottom: '8px' },
  navItemActive: { padding: '12px 16px', backgroundColor: '#1e293b', color: '#f8fafc', borderRadius: '8px', fontWeight: '600' },
  main: { flex: 1, padding: '40px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  statsContainer: { backgroundColor: '#e0f2fe', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', color: '#0369a1' },
  contentGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
  card: { backgroundColor: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  cardHeader: { fontSize: '18px', fontWeight: '700', marginBottom: '20px', color: '#334155' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px' },
  primaryBtn: { padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },
  secondaryBtn: { padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { textAlign: 'left', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #f1f5f9' },
  tableRow: { borderBottom: '1px solid #f1f5f9', height: '60px' },
  badge: { padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: '700' },
  delBtn: { color: '#ef4444', backgroundColor: '#fee2e2', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' },
  progressBg: { width: '80px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '10px', marginTop: '4px', overflow: 'hidden' }
};

export default App;