import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("conference.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS conferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT DEFAULT 'upcoming'
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conference_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    authors TEXT NOT NULL,
    abstract TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (conference_id) REFERENCES conferences (id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    reviewer_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    comments TEXT,
    FOREIGN KEY (submission_id) REFERENCES submissions (id)
  );

  CREATE TABLE IF NOT EXISTS registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conference_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    is_student BOOLEAN DEFAULT 0,
    FOREIGN KEY (conference_id) REFERENCES conferences (id)
  );

  CREATE TABLE IF NOT EXISTS volunteer_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conference_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    motivation TEXT,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (conference_id) REFERENCES conferences (id)
  );

  CREATE TABLE IF NOT EXISTS travel_grants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conference_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    user_name TEXT NOT NULL,
    reason TEXT,
    amount_requested REAL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (conference_id) REFERENCES conferences (id)
  );
`);

// Seed data if empty
const confCount = db.prepare("SELECT COUNT(*) as count FROM conferences").get() as { count: number };
if (confCount.count === 0) {
  db.prepare("INSERT INTO conferences (title, description, date, location) VALUES (?, ?, ?, ?)").run(
    "Global AI Summit 2026",
    "Exploring the future of artificial intelligence and its impact on society.",
    "2026-05-15",
    "San Francisco, CA"
  );
  db.prepare("INSERT INTO conferences (title, description, date, location) VALUES (?, ?, ?, ?)").run(
    "International Web Engineering Conference",
    "The premier conference for web researchers and practitioners.",
    "2026-07-20",
    "London, UK"
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/conferences", (req, res) => {
    const conferences = db.prepare("SELECT * FROM conferences ORDER BY date ASC").all();
    res.json(conferences);
  });

  app.get("/api/conferences/:id", (req, res) => {
    const conference = db.prepare("SELECT * FROM conferences WHERE id = ?").get(req.params.id);
    if (!conference) return res.status(404).json({ error: "Conference not found" });
    res.json(conference);
  });

  app.post("/api/conferences", (req, res) => {
    const { title, description, date, location } = req.body;
    const result = db.prepare("INSERT INTO conferences (title, description, date, location) VALUES (?, ?, ?, ?)").run(title, description, date, location);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/submissions", (req, res) => {
    const submissions = db.prepare(`
      SELECT s.*, c.title as conference_title 
      FROM submissions s 
      JOIN conferences c ON s.conference_id = c.id
    `).all();
    res.json(submissions);
  });

  app.post("/api/submissions", (req, res) => {
    const { conference_id, title, authors, abstract } = req.body;
    const result = db.prepare("INSERT INTO submissions (conference_id, title, authors, abstract) VALUES (?, ?, ?, ?)").run(conference_id, title, authors, abstract);
    res.json({ id: result.lastInsertRowid });
  });

  app.patch("/api/submissions/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE submissions SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.get("/api/submissions/:id/reviews", (req, res) => {
    const reviews = db.prepare("SELECT * FROM reviews WHERE submission_id = ?").all(req.params.id);
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const { submission_id, reviewer_name, score, comments } = req.body;
    const result = db.prepare("INSERT INTO reviews (submission_id, reviewer_name, score, comments) VALUES (?, ?, ?, ?)").run(submission_id, reviewer_name, score, comments);
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/registrations", (req, res) => {
    const { conference_id, user_email, user_name, is_student } = req.body;
    const result = db.prepare("INSERT INTO registrations (conference_id, user_email, user_name, is_student) VALUES (?, ?, ?, ?)").run(conference_id, user_email, user_name, is_student ? 1 : 0);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/student/applications", (req, res) => {
    const email = req.query.email as string;
    if (!email) return res.status(400).json({ error: "Email required" });
    
    const volunteers = db.prepare(`
      SELECT v.*, c.title as conference_title 
      FROM volunteer_applications v 
      JOIN conferences c ON v.conference_id = c.id 
      WHERE v.user_email = ?
    `).all(email);
    
    const grants = db.prepare(`
      SELECT t.*, c.title as conference_title 
      FROM travel_grants t 
      JOIN conferences c ON t.conference_id = c.id 
      WHERE t.user_email = ?
    `).all(email);
    
    res.json({ volunteers, grants });
  });

  app.post("/api/volunteer", (req, res) => {
    const { conference_id, user_email, user_name, motivation } = req.body;
    const result = db.prepare("INSERT INTO volunteer_applications (conference_id, user_email, user_name, motivation) VALUES (?, ?, ?, ?)").run(conference_id, user_email, user_name, motivation);
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/grants", (req, res) => {
    const { conference_id, user_email, user_name, reason, amount_requested } = req.body;
    const result = db.prepare("INSERT INTO travel_grants (conference_id, user_email, user_name, reason, amount_requested) VALUES (?, ?, ?, ?, ?)").run(conference_id, user_email, user_name, reason, amount_requested);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/admin/stats", (req, res) => {
    const confs = db.prepare("SELECT COUNT(*) as count FROM conferences").get() as any;
    const subs = db.prepare("SELECT COUNT(*) as count FROM submissions").get() as any;
    const regs = db.prepare("SELECT COUNT(*) as count FROM registrations").get() as any;
    const volunteers = db.prepare("SELECT COUNT(*) as count FROM volunteer_applications").get() as any;
    res.json({
      conferences: confs.count,
      submissions: subs.count,
      registrations: regs.count,
      volunteers: volunteers.count
    });
  });

  app.get("/api/admin/volunteers", (req, res) => {
    const volunteers = db.prepare(`
      SELECT v.*, c.title as conference_title 
      FROM volunteer_applications v 
      JOIN conferences c ON v.conference_id = c.id
    `).all();
    res.json(volunteers);
  });

  app.get("/api/admin/grants", (req, res) => {
    const grants = db.prepare(`
      SELECT t.*, c.title as conference_title 
      FROM travel_grants t 
      JOIN conferences c ON t.conference_id = c.id
    `).all();
    res.json(grants);
  });

  app.patch("/api/admin/volunteers/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE volunteer_applications SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.patch("/api/admin/grants/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE travel_grants SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
