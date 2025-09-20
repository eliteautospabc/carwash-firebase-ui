import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import Login from "./Login";

// Owner view
function OwnerDashboard() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReports(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Welcome, Owner! Here are the reports:</h1>
      <ul>
        {reports.map((r) => (
          <li key={r.id} className="border p-2 my-2">{r.text}</li>
        ))}
      </ul>
    </div>
  );
}

// Staff view
function StaffPage() {
  const [report, setReport] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    try {
      await addDoc(collection(db, "reports"), {
        text: report,
        createdAt: serverTimestamp()
      });
      alert("✅ Report submitted!");
      setReport("");
    } catch (err) {
      console.error("Error saving report:", err);
      alert("❌ Failed to save report");
    }
  };

  return (
    <div>
      <h1>Welcome, Staff! File your report below.</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Enter report details"
          className="border p-2 w-full my-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Login />;
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Simple role check by email
  const isOwner = user.email === "owner@carwash.com";

  return (
    <div>
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2">
        Logout
      </button>
      {isOwner ? <OwnerDashboard /> : <StaffPage />}
    </div>
  );
}

export default App;
