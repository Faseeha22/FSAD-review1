/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  FileText, 
  Users, 
  LayoutDashboard, 
  Plus, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  XCircle,
  MessageSquare,
  Star,
  Award,
  ArrowLeft,
  Search,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface Conference {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'past';
}

interface Submission {
  id: number;
  conference_id: number;
  conference_title?: string;
  title: string;
  authors: string;
  abstract: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
}

interface Review {
  id: number;
  submission_id: number;
  reviewer_name: string;
  score: number;
  comments: string;
}

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-zinc-900 p-1.5 rounded-lg group-hover:bg-zinc-800 transition-colors">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900">ConfManage</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/conferences" className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Conferences</Link>
            <Link to="/submissions" className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">My Submissions</Link>
            <Link to="/student" className="text-zinc-600 hover:text-zinc-900 font-medium transition-colors">Student Portal</Link>
            <Link to="/admin" className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-zinc-800 transition-all shadow-sm">Admin Portal</Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-zinc-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              <Link to="/conferences" onClick={() => setIsOpen(false)} className="block text-zinc-600 font-medium">Conferences</Link>
              <Link to="/submissions" onClick={() => setIsOpen(false)} className="block text-zinc-600 font-medium">My Submissions</Link>
              <Link to="/student" onClick={() => setIsOpen(false)} className="block text-zinc-600 font-medium">Student Portal</Link>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block bg-zinc-900 text-white px-4 py-2 rounded-lg text-center font-medium">Admin Portal</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <div className="relative bg-zinc-50 py-24 overflow-hidden">
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl"
      >
        <h1 className="text-6xl font-extrabold tracking-tight text-zinc-900 mb-6 leading-tight">
          The Future of <span className="text-zinc-500">Academic</span> Collaboration.
        </h1>
        <p className="text-xl text-zinc-600 mb-10 leading-relaxed">
          Streamline your conference management from paper submission to peer review and scheduling. Built for researchers, by researchers.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/conferences" className="bg-zinc-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            Explore Conferences <ChevronRight className="w-5 h-5" />
          </Link>
          <Link to="/admin" className="bg-white border border-zinc-200 text-zinc-900 px-8 py-4 rounded-xl font-semibold hover:bg-zinc-50 transition-all shadow-sm">
            Host a Conference
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

const ConferenceCard = ({ conference }: { conference: Conference, key?: any }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="bg-zinc-100 p-3 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors">
        <Calendar className="w-6 h-6" />
      </div>
      <span className={cn(
        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
        conference.status === 'upcoming' ? "bg-emerald-100 text-emerald-700" : 
        conference.status === 'ongoing' ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"
      )}>
        {conference.status}
      </span>
    </div>
    <h3 className="text-xl font-bold text-zinc-900 mb-2">{conference.title}</h3>
    <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{conference.description}</p>
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center gap-2 text-zinc-600 text-sm">
        <Clock className="w-4 h-4" />
        {format(new Date(conference.date), 'MMMM dd, yyyy')}
      </div>
      <div className="flex items-center gap-2 text-zinc-600 text-sm">
        <Users className="w-4 h-4" />
        {conference.location}
      </div>
    </div>
    <Link 
      to={`/conferences/${conference.id}`} 
      className="w-full block text-center py-3 rounded-xl border border-zinc-200 font-semibold text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all"
    >
      View Details
    </Link>
  </motion.div>
);

const ConferenceList = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/conferences')
      .then(res => res.json())
      .then(data => {
        setConferences(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-12 text-center text-zinc-500">Loading conferences...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900 mb-2">Upcoming Conferences</h2>
          <p className="text-zinc-500">Discover and participate in the world's leading academic events.</p>
        </div>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search conferences..." 
            className="pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-64"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {conferences.map(conf => (
          <ConferenceCard key={conf.id} conference={conf} />
        ))}
      </div>
    </div>
  );
};

const ConferenceDetail = () => {
  const { id } = useParams();
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/conferences/${id}`)
      .then(res => res.json())
      .then(data => {
        setConference(data);
        setLoading(false);
      });
  }, [id]);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [regData, setRegData] = useState({ name: '', email: '', is_student: false });
  const [regSuccess, setRegSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...regData, conference_id: id })
    });
    setRegSuccess(true);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegSuccess(false);
      setRegData({ name: '', email: '', is_student: false });
    }, 2000);
  };

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!conference) return <div className="p-12 text-center">Conference not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to list
      </button>

      <div className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-sm">
        <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              {conference.status}
            </span>
            <h1 className="text-4xl font-bold text-zinc-900 mb-4">{conference.title}</h1>
            <div className="flex flex-wrap gap-6 text-zinc-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {format(new Date(conference.date), 'EEEE, MMMM dd, yyyy')}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {conference.location}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Link to={`/submit/${id}`} className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all">
              Submit Paper
            </Link>
            <button 
              onClick={() => setShowRegisterModal(true)}
              className="bg-white border border-zinc-200 text-zinc-900 px-6 py-3 rounded-xl font-semibold hover:bg-zinc-50 transition-all"
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Registration Modal */}
        <AnimatePresence>
          {showRegisterModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowRegisterModal(false)}
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
              >
                {regSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                    <p className="text-zinc-500">We've sent a confirmation email to {regData.email}.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Register for {conference.title}</h2>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Full Name</label>
                        <input 
                          required
                          type="text" 
                          value={regData.name}
                          onChange={e => setRegData({...regData, name: e.target.value})}
                          className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900/10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-1">Email Address</label>
                        <input 
                          required
                          type="email" 
                          value={regData.email}
                          onChange={e => setRegData({...regData, email: e.target.value})}
                          className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900/10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id="is_student"
                          checked={regData.is_student}
                          onChange={e => setRegData({...regData, is_student: e.target.checked})}
                          className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                        />
                        <label htmlFor="is_student" className="text-sm text-zinc-600 font-medium">I am a student (eligible for discounts)</label>
                      </div>
                      <div className="pt-4 flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setShowRegisterModal(false)}
                          className="flex-1 px-4 py-3 border border-zinc-200 rounded-xl font-bold hover:bg-zinc-50"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 px-4 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800"
                        >
                          Confirm
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="prose prose-zinc max-w-none mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 mb-4">About the Conference</h2>
          <p className="text-zinc-600 leading-relaxed text-lg">{conference.description}</p>
        </div>

        <div className="border-t border-zinc-100 pt-12">
          <h2 className="text-2xl font-bold text-zinc-900 mb-8">Conference Schedule</h2>
          <div className="space-y-6">
            {[
              { time: '09:00 AM', event: 'Opening Keynote', speaker: 'Dr. Sarah Jenkins' },
              { time: '11:00 AM', event: 'Paper Session A: Machine Learning', speaker: 'Various Authors' },
              { time: '01:00 PM', event: 'Networking Lunch', speaker: 'Main Hall' },
              { time: '02:30 PM', event: 'Workshop: Future of Web', speaker: 'Prof. Michael Chen' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-4 rounded-2xl hover:bg-zinc-50 transition-colors">
                <div className="text-zinc-900 font-bold whitespace-nowrap">{item.time}</div>
                <div>
                  <div className="text-zinc-900 font-semibold text-lg">{item.event}</div>
                  <div className="text-zinc-500">{item.speaker}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    abstract: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, conference_id: id })
      });
      navigate('/submissions');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white border border-zinc-200 rounded-3xl p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Submit Your Paper</h1>
        <p className="text-zinc-500 mb-8">Please provide the details of your research paper for review.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wide">Paper Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              placeholder="e.g. Advancements in Distributed Systems"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wide">Authors (comma separated)</label>
            <input 
              required
              type="text" 
              value={formData.authors}
              onChange={e => setFormData({...formData, authors: e.target.value})}
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              placeholder="e.g. John Doe, Jane Smith"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2 uppercase tracking-wide">Abstract</label>
            <textarea 
              required
              rows={6}
              value={formData.abstract}
              onChange={e => setFormData({...formData, abstract: e.target.value})}
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              placeholder="Provide a brief summary of your research..."
            />
          </div>
          <div className="pt-4">
            <button 
              disabled={submitting}
              type="submit" 
              className="w-full bg-zinc-900 text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-bold text-zinc-900 mb-8">My Submissions</h2>
      <div className="space-y-6">
        {submissions.length === 0 ? (
          <div className="text-center py-24 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">You haven't submitted any papers yet.</p>
            <Link to="/conferences" className="text-zinc-900 font-bold mt-4 inline-block hover:underline">Browse Conferences</Link>
          </div>
        ) : (
          submissions.map(sub => (
            <div key={sub.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{sub.conference_title}</div>
                <h3 className="text-xl font-bold text-zinc-900 mb-1">{sub.title}</h3>
                <p className="text-zinc-500 text-sm">Authors: {sub.authors}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold",
                  sub.status === 'pending' ? "bg-amber-50 text-amber-700" :
                  sub.status === 'under_review' ? "bg-blue-50 text-blue-700" :
                  sub.status === 'accepted' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                )}>
                  {sub.status === 'pending' && <Clock className="w-4 h-4" />}
                  {sub.status === 'under_review' && <Search className="w-4 h-4" />}
                  {sub.status === 'accepted' && <CheckCircle className="w-4 h-4" />}
                  {sub.status === 'rejected' && <XCircle className="w-4 h-4" />}
                  <span className="capitalize">{sub.status.replace('_', ' ')}</span>
                </div>
                <Link to={`/submissions/${sub.id}`} className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-zinc-400" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const StudentPortal = () => {
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [applications, setApplications] = useState<{ volunteers: any[], grants: any[] }>({ volunteers: [], grants: [] });
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedConfId, setSelectedConfId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', motivation: '', reason: '', amount: '' });

  useEffect(() => {
    fetch('/api/conferences').then(res => res.json()).then(setConferences);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`/api/student/applications?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setApplications(data);
        setIsLoggedIn(true);
      });
  };

  const submitVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/volunteer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conference_id: selectedConfId, user_email: email, user_name: formData.name, motivation: formData.motivation })
    });
    setShowVolunteerModal(false);
    handleLogin({ preventDefault: () => {} } as any);
  };

  const submitGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/grants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conference_id: selectedConfId, user_email: email, user_name: formData.name, reason: formData.reason, amount_requested: formData.amount })
    });
    setShowGrantModal(false);
    handleLogin({ preventDefault: () => {} } as any);
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-4">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
          <div className="w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Student Portal</h1>
          <p className="text-zinc-500 mb-8">Enter your email to access student-specific opportunities and track your applications.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              required
              type="email" 
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-200 rounded-xl outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
            <button type="submit" className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold hover:bg-zinc-800 transition-colors">
              Access Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 mb-2">Student Portal</h1>
          <p className="text-zinc-500">Welcome back, {email}. Explore grants and volunteer roles.</p>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="text-zinc-500 hover:text-zinc-900 font-medium">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Volunteer Applications */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Users className="w-6 h-6" /> Volunteer Roles
            </h2>
            <div className="space-y-4">
              {applications.volunteers.length === 0 ? (
                <p className="text-zinc-500 bg-zinc-50 p-6 rounded-2xl border border-dashed border-zinc-200">No volunteer applications yet.</p>
              ) : (
                applications.volunteers.map(v => (
                  <div key={v.id} className="bg-white border border-zinc-200 p-6 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-zinc-900">{v.conference_title}</div>
                      <div className="text-sm text-zinc-500">{v.motivation.substring(0, 50)}...</div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase",
                      v.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    )}>{v.status}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Travel Grants */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" /> Travel Grants
            </h2>
            <div className="space-y-4">
              {applications.grants.length === 0 ? (
                <p className="text-zinc-500 bg-zinc-50 p-6 rounded-2xl border border-dashed border-zinc-200">No travel grant applications yet.</p>
              ) : (
                applications.grants.map(g => (
                  <div key={g.id} className="bg-white border border-zinc-200 p-6 rounded-2xl flex justify-between items-center">
                    <div>
                      <div className="font-bold text-zinc-900">{g.conference_title}</div>
                      <div className="text-sm text-zinc-500">Requested: ${g.amount_requested}</div>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase",
                      g.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                    )}>{g.status}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setShowVolunteerModal(true)}
                className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Apply to Volunteer
              </button>
              <button 
                onClick={() => setShowGrantModal(true)}
                className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Apply for Grant
              </button>
            </div>
          </div>
          
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl">
            <h4 className="text-emerald-900 font-bold mb-2">Student Benefits</h4>
            <ul className="text-emerald-700 text-sm space-y-2 list-disc pl-4">
              <li>50% discount on all registrations</li>
              <li>Access to exclusive mentorship sessions</li>
              <li>Priority for travel grant applications</li>
              <li>Free workshops for student volunteers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Volunteer Modal */}
      <AnimatePresence>
        {showVolunteerModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setShowVolunteerModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-3xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">Volunteer Application</h2>
              <form onSubmit={submitVolunteer} className="space-y-4">
                <select 
                  required
                  onChange={e => setSelectedConfId(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none"
                >
                  <option value="">Select Conference</option>
                  {conferences.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <input required placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none" />
                <textarea required placeholder="Why do you want to volunteer?" rows={4} onChange={e => setFormData({...formData, motivation: e.target.value})} className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none" />
                <button type="submit" className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold">Submit Application</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grant Modal */}
      <AnimatePresence>
        {showGrantModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setShowGrantModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white rounded-3xl p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">Travel Grant Application</h2>
              <form onSubmit={submitGrant} className="space-y-4">
                <select 
                  required
                  onChange={e => setSelectedConfId(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none"
                >
                  <option value="">Select Conference</option>
                  {conferences.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <input required placeholder="Full Name" onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none" />
                <input required type="number" placeholder="Amount Requested ($)" onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none" />
                <textarea required placeholder="Reason for grant request" rows={4} onChange={e => setFormData({...formData, reason: e.target.value})} className="w-full px-4 py-2 border border-zinc-200 rounded-xl outline-none" />
                <button type="submit" className="w-full bg-zinc-900 text-white py-3 rounded-xl font-bold">Submit Application</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({ conferences: 0, submissions: 0, registrations: 0, volunteers: 0 });
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newConf, setNewConf] = useState({ title: '', description: '', date: '', location: '' });
  const [activeTab, setActiveTab] = useState<'submissions' | 'volunteers' | 'grants'>('submissions');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch('/api/admin/stats').then(res => res.json()),
      fetch('/api/submissions').then(res => res.json()),
      fetch('/api/admin/volunteers').then(res => res.json()),
      fetch('/api/admin/grants').then(res => res.json())
    ]).then(([statsData, subsData, volData, grantData]) => {
      setStats(statsData);
      setSubmissions(subsData);
      setVolunteers(volData);
      setGrants(grantData);
      setLoading(false);
    });
  };

  const handleCreateConference = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/conferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConf)
    });
    setShowCreateModal(false);
    setNewConf({ title: '', description: '', date: '', location: '' });
    fetchData();
  };

  const updateVolunteerStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/volunteers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const updateGrantStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/grants/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const updateSubmissionStatus = async (id: number, status: string) => {
    await fetch(`/api/submissions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  if (loading) return <div className="p-12 text-center">Loading Admin Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-zinc-900">Admin Dashboard</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> New Conference
        </button>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-xl shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6">Create New Conference</h2>
              <form onSubmit={handleCreateConference} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Title</label>
                  <input 
                    required
                    type="text" 
                    value={newConf.title}
                    onChange={e => setNewConf({...newConf, title: e.target.value})}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Date</label>
                  <input 
                    required
                    type="date" 
                    value={newConf.date}
                    onChange={e => setNewConf({...newConf, date: e.target.value})}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Location</label>
                  <input 
                    required
                    type="text" 
                    value={newConf.location}
                    onChange={e => setNewConf({...newConf, location: e.target.value})}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-700 mb-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={newConf.description}
                    onChange={e => setNewConf({...newConf, description: e.target.value})}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900/10 outline-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-6 py-3 border border-zinc-200 rounded-xl font-bold hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Total Conferences', value: stats.conferences, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Submissions', value: stats.submissions, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Registrations', value: stats.registrations, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Volunteer Apps', value: stats.volunteers, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div className="text-4xl font-bold text-zinc-900 mb-1">{stat.value}</div>
            <div className="text-zinc-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('submissions')}
              className={cn("px-4 py-2 rounded-lg font-bold transition-all", activeTab === 'submissions' ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50")}
            >
              Submissions
            </button>
            <button 
              onClick={() => setActiveTab('volunteers')}
              className={cn("px-4 py-2 rounded-lg font-bold transition-all", activeTab === 'volunteers' ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50")}
            >
              Volunteers
            </button>
            <button 
              onClick={() => setActiveTab('grants')}
              className={cn("px-4 py-2 rounded-lg font-bold transition-all", activeTab === 'grants' ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-50")}
            >
              Grants
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'submissions' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Paper Title</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Conference</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-zinc-900">{sub.title}</div>
                      <div className="text-sm text-zinc-500">{sub.authors}</div>
                    </td>
                    <td className="px-8 py-6 text-zinc-600">{sub.conference_title}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold capitalize",
                        sub.status === 'pending' ? "bg-amber-100 text-amber-700" :
                        sub.status === 'under_review' ? "bg-blue-100 text-blue-700" :
                        sub.status === 'accepted' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        {sub.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateSubmissionStatus(sub.id, 'under_review')}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Review">
                          <Search className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateSubmissionStatus(sub.id, 'accepted')}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Accept">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateSubmissionStatus(sub.id, 'rejected')}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'volunteers' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Applicant</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Conference</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {volunteers.map(v => (
                  <tr key={v.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-zinc-900">{v.user_name}</div>
                      <div className="text-sm text-zinc-500">{v.user_email}</div>
                    </td>
                    <td className="px-8 py-6 text-zinc-600">{v.conference_title}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold capitalize",
                        v.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateVolunteerStatus(v.id, 'approved')}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateVolunteerStatus(v.id, 'rejected')}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'grants' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Applicant</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Requested</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {grants.map(g => (
                  <tr key={g.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-zinc-900">{g.user_name}</div>
                      <div className="text-sm text-zinc-500">{g.user_email}</div>
                    </td>
                    <td className="px-8 py-6 text-zinc-600">${g.amount_requested}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold capitalize",
                        g.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => updateGrantStatus(g.id, 'approved')}
                          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Approve">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => updateGrantStatus(g.id, 'rejected')}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Reject">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-zinc-200 pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-zinc-900" />
            <span className="text-2xl font-bold tracking-tight text-zinc-900">ConfManage</span>
          </Link>
          <p className="text-zinc-500 max-w-sm leading-relaxed">
            Empowering the academic community with modern tools for conference management, peer review, and collaboration.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 mb-6 uppercase tracking-widest text-xs">Platform</h4>
          <ul className="space-y-4 text-zinc-500">
            <li><Link to="/conferences" className="hover:text-zinc-900 transition-colors">Conferences</Link></li>
            <li><Link to="/submissions" className="hover:text-zinc-900 transition-colors">Submissions</Link></li>
            <li><Link to="/admin" className="hover:text-zinc-900 transition-colors">Admin Portal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 mb-6 uppercase tracking-widest text-xs">Support</h4>
          <ul className="space-y-4 text-zinc-500">
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-zinc-900 transition-colors">API Docs</a></li>
            <li><a href="#" className="hover:text-zinc-900 transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
        <p>© 2026 ConfManage. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-zinc-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-900 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white font-sans selection:bg-zinc-900 selection:text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<><Hero /><ConferenceList /></>} />
            <Route path="/conferences" element={<ConferenceList />} />
            <Route path="/conferences/:id" element={<ConferenceDetail />} />
            <Route path="/submit/:id" element={<SubmissionForm />} />
            <Route path="/submissions" element={<MySubmissions />} />
            <Route path="/student" element={<StudentPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
