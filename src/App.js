import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

function App() {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [empForm, setEmpForm] = useState({ employeeId: '', fullName: '', email: '', department: '' });
  const [attForm, setAttForm] = useState({ 
    employeeId: '', 
    date: new Date().toISOString().split('T')[0], 
    status: 'Present',
    remarks: '' 
  });

  const fetchData = async () => {
    try {
      const empRes = await axios.get(`${API_BASE}/employees`);
      const attRes = await axios.get(`${API_BASE}/attendance`);
      setEmployees(empRes.data);
      setAttendanceList(attRes.data);
    } catch (err) { console.error("Sync Error"); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/employees`, empForm);
      setEmpForm({ employeeId: '', fullName: '', email: '', department: '' });
      fetchData();
      alert("Employee onboarded successfully!");
    } catch (err) { alert("Error: ID already exists"); }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    const alreadyMarked = attendanceList.some(log => log.employeeId === attForm.employeeId && log.date === attForm.date);
    if (alreadyMarked) return alert("Record already exists for this date.");

    const selectedEmp = employees.find(emp => emp.employeeId === attForm.employeeId);
    await axios.post(`${API_BASE}/attendance`, { ...attForm, fullName: selectedEmp.fullName });
    setAttForm({ ...attForm, employeeId: '', remarks: '' });
    fetchData();
    alert("Record Saved!");
  };

  const handleDelete = async (id) => {
    if (window.confirm("CRITICAL: Deleting this staff will permanently erase all their attendance history. Proceed?")) {
      await axios.delete(`${API_BASE}/employees/${id}`);
      fetchData();
    }
  };

  return (
    <div style={styles.app}>
      {/* PROFESSIONAL SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>HRMS <span style={{color: '#60a5fa'}}>ANALYTICS</span></div>
        <div onClick={() => setActiveTab('dashboard')} style={activeTab === 'dashboard' ? styles.navActive : styles.navLink}>📊 Dashboard</div>
        <div onClick={() => setActiveTab('directory')} style={activeTab === 'directory' ? styles.navActive : styles.navLink}>👥 Staff Directory</div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1>{activeTab === 'dashboard' ? "Operational Overview" : "Personnel Registry"}</h1>
          <div style={styles.dateDisplay}>{new Date().toDateString()}</div>
        </header>

        {activeTab === 'dashboard' ? (
          <>
            <div style={styles.grid}>
              {/* BACKDATED CALENDAR LOGGING */}
              <section style={styles.card}>
                <h3 style={styles.cardTitle}>Smart Attendance Logger</h3>
                <form onSubmit={handleMarkAttendance} style={styles.form}>
                  <select style={styles.input} value={attForm.employeeId} onChange={e => setAttForm({...attForm, employeeId: e.target.value})} required>
                    <option value="">Select Employee...</option>
                    {employees.map(emp => <option key={emp.employeeId} value={emp.employeeId}>{emp.fullName}</option>)}
                  </select>
                  
                  <div style={styles.row}>
                    <div style={{flex: 1}}>
                      <label style={styles.label}>Log Date (Backdating Enabled)</label>
                      <input type="date" style={styles.input} value={attForm.date} onChange={e => setAttForm({...attForm, date: e.target.value})} required />
                    </div>
                    <div style={{flex: 1}}>
                      <label style={styles.label}>Status</label>
                      <select style={styles.input} value={attForm.status} onChange={e => setAttForm({...attForm, status: e.target.value})}>
                        <option value="Present">Present</option>
                        <option value="Absent">On Leave</option>
                      </select>
                    </div>
                  </div>

                  {attForm.status === 'Absent' && (
                    <input style={styles.input} placeholder="Enter Leave Reason (Required)" value={attForm.remarks} onChange={e => setAttForm({...attForm, remarks: e.target.value})} required />
                  )}
                  <button style={styles.btnSuccess} type="submit">Verify & Save Log</button>
                </form>
              </section>

              <section style={styles.card}>
                <h3 style={styles.cardTitle}>Quick Registration</h3>
                <form onSubmit={handleAddEmployee} style={styles.form}>
                  <input style={styles.input} placeholder="Employee ID (Unique)" value={empForm.employeeId} onChange={e => setEmpForm({...empForm, employeeId: e.target.value})} required />
                  <input style={styles.input} placeholder="Full Name" value={empForm.fullName} onChange={e => setEmpForm({...empForm, fullName: e.target.value})} required />
                  <input style={styles.input} placeholder="Department" value={empForm.department} onChange={e => setEmpForm({...empForm, department: e.target.value})} required />
                  <button style={styles.btnPrimary} type="submit">Complete Onboarding</button>
                </form>
              </section>
            </div>

            {/* RELIABILITY ANALYTICS TABLE */}
            <div style={{...styles.card, marginTop: '25px'}}>
              <h3 style={styles.cardTitle}>Reliability & Performance Tracking</h3>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.th}><th>STAFF MEMBER</th><th>LAST LOG</th><th>REASON</th><th>RELIABILITY SCORE</th></tr>
                </thead>
                <tbody>
                  {[...attendanceList].reverse().map((log, i) => {
                    const logs = attendanceList.filter(a => a.employeeId === log.employeeId);
                    const score = ((logs.filter(a => a.status === 'Present').length / logs.length) * 100).toFixed(0);
                    const color = score > 85 ? '#22c55e' : score > 70 ? '#f59e0b' : '#ef4444';
                    
                    return (
                      <tr key={i} style={styles.tr}>
                        <td><b>{log.fullName}</b><br/><small style={{color: '#64748b'}}>{log.employeeId}</small></td>
                        <td>{log.date}</td>
                        <td style={{fontStyle: 'italic', color: '#94a3b8'}}>{log.remarks || 'N/A'}</td>
                        <td>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <div style={{...styles.progressContainer}}><div style={{...styles.progressBar, width: `${score}%`, backgroundColor: color}} /></div>
                            <span style={{fontWeight: 'bold', color: color}}>{score}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div style={styles.directoryGrid}>
            {employees.map(emp => (
              <div key={emp.employeeId} style={styles.dirCard}>
                <div style={styles.avatar}>{emp.fullName[0]}</div>
                <h4>{emp.fullName}</h4>
                <p style={{color: '#64748b', fontSize: '13px'}}>{emp.department}</p>
                <button onClick={() => handleDelete(emp.employeeId)} style={styles.btnDelete}>Remove from System</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles = {
  app: { display: 'flex', minHeight: '100vh', background: '#f1f5f9', color: '#1e293b', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '250px', background: '#0f172a', padding: '40px 20px', color: 'white' },
  logo: { fontSize: '22px', fontWeight: 'bold', marginBottom: '40px', color: '#3b82f6' },
  navLink: { padding: '12px 15px', borderRadius: '10px', cursor: 'pointer', color: '#94a3b8', marginBottom: '5px' },
  navActive: { padding: '12px 15px', background: '#1e293b', borderRadius: '10px', color: 'white', fontWeight: '600' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px' },
  card: { background: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  cardTitle: { marginBottom: '20px', fontSize: '18px', fontWeight: '700' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px' },
  row: { display: 'flex', gap: '15px' },
  label: { fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', width: '100%' },
  btnPrimary: { background: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  btnSuccess: { background: '#10b981', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '12px', color: '#64748b', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' },
  tr: { borderBottom: '1px solid #f1f5f9', height: '60px' },
  progressContainer: { width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: '10px' },
  directoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' },
  dirCard: { background: 'white', padding: '25px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  avatar: { width: '50px', height: '50px', background: '#dbeafe', color: '#2563eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px', fontSize: '20px', fontWeight: 'bold' },
  btnDelete: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '600', fontSize: '12px', marginTop: '10px' }
};

export default App;