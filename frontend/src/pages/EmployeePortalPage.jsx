// frontend/src/pages/EmployeePortalPage.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChatAlt2, HiDocumentText, HiOutlineQuestionMarkCircle, HiPaperAirplane, HiSparkles, HiShieldCheck } from 'react-icons/hi';
import axiosInstance from '../api/axiosInstance';
import useAuth from '../hooks/useAuth';
import toast from 'react-hot-toast';

const sampleQueries = [
  "Does my plan cover dental cleanings?",
  "Is there a copay for specialist office visits?",
  "Are emergency ambulance services covered?",
  "Does it cover prescription drugs/medications?",
  "What is the policy limit/sum insured?",
];

const EmployeePortalPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'employee') {
      if (user.role === 'hr-admin') {
        navigate('/hr/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);
  
  // Data
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  // Chat/QA states
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [asking, setAsking] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchEmployeePolicies = async () => {
    try {
      const { data } = await axiosInstance.get('/hr/policies');
      if (data.success) {
        setPolicies(data.data);
        if (data.data.length > 0) {
          setSelectedPolicy(data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load corporate benefit policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeePolicies();
  }, []);

  useEffect(() => {
    if (selectedPolicy) {
      // Initialize chat with welcome message
      setMessages([
        {
          sender: 'ai',
          text: `Hi ${user?.name}! I am your AI HR Benefits Assistant. Feel free to ask me any question about the benefits, coverages, or exclusions inside the **${selectedPolicy.simplifiedSummary?.policyType || 'Group Insurance'}** plan.`,
        },
      ]);
    }
  }, [selectedPolicy]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAskQuestion = async (textToSend) => {
    const questionText = textToSend || query;
    if (!questionText.trim() || !selectedPolicy || asking) return;

    // Append user question
    setMessages((prev) => [...prev, { sender: 'user', text: questionText }]);
    if (!textToSend) setQuery('');
    setAsking(true);

    try {
      const { data } = await axiosInstance.post(`/hr/policies/${selectedPolicy._id}/ask`, {
        question: questionText,
      });

      if (data.success) {
        // Append AI answer
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: data.data.answer },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: "Sorry, I encountered an error while processing that question. Please consult HR directly." },
      ]);
    } finally {
      setAsking(false);
    }
  };

  if (!user || user.role !== 'employee') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-theme">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading your employer benefit documents...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div
        className="rounded-2xl p-6 mb-8 border flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div>
          <h1 className="text-2xl font-bold text-primary-theme flex items-center space-x-2">
            <HiShieldCheck className="text-primary-500 h-7 w-7" />
            <span>Corporate Employee Benefits Portal</span>
          </h1>
          <p className="text-sm text-muted-theme mt-1.5">
            Employer Sponsored Plans provided by <span className="font-semibold text-primary-400">{user?.organizationName}</span>.
          </p>
        </div>
        <div className="text-xs text-subtle-theme text-center md:text-right">
          <p>Assigned HR Administrator</p>
          <p className="font-bold text-primary-theme">Internal Benefits Office</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Benefit policies selector */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-primary-theme uppercase tracking-wider">Group Benefit Plans</h2>
          {policies.length === 0 ? (
            <p className="text-xs text-subtle-theme p-4 border border-dashed rounded-xl text-center">
              Your employer hasn't uploaded any benefits plans yet.
            </p>
          ) : (
            <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {policies.map((p) => (
                <div
                  key={p._id}
                  onClick={() => setSelectedPolicy(p)}
                  className={`p-4 rounded-xl border cursor-pointer hover:border-primary-500/50 transition-all flex-shrink-0 lg:flex-shrink w-64 lg:w-full flex items-start space-x-3 ${
                    selectedPolicy?._id === p._id
                      ? 'bg-primary-600/10 border-primary-500/30 shadow-sm'
                      : 'border-transparent'
                  }`}
                  style={selectedPolicy?._id !== p._id ? { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' } : {}}
                >
                  <HiDocumentText className={`h-6 w-6 mt-0.5 ${selectedPolicy?._id === p._id ? 'text-primary-400' : 'text-subtle-theme'}`} />
                  <div className="truncate">
                    <p className="text-xs font-bold text-primary-theme truncate">{p.simplifiedSummary?.policyType || 'Benefit Plan'}</p>
                    <p className="text-[9px] text-muted-theme truncate mt-0.5">{p.originalFileName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Assistant Chat Interface */}
        <div className="lg:col-span-3">
          {selectedPolicy ? (
            <div
              className="rounded-2xl border shadow-sm flex flex-col h-[600px] overflow-hidden"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              {/* Active Plan Header */}
              <div className="px-5 py-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <h3 className="text-sm font-bold text-primary-theme">
                    QA Benefits Assistant
                  </h3>
                  <p className="text-[10px] text-muted-theme mt-0.5">
                    Querying: <span className="font-semibold">{selectedPolicy.simplifiedSummary?.policyType || 'Selected Plan'}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-primary-400 font-bold bg-primary-500/10 px-2.5 py-1 rounded-full">
                  <HiSparkles className="h-4.5 w-4.5 animate-pulse" />
                  <span>Gemini AI Enabled</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-dark-100/5">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-primary-600 text-white rounded-tr-none'
                          : 'bg-dark-100 border text-primary-theme rounded-tl-none'
                      }`}
                      style={msg.sender !== 'user' ? { backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' } : {}}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {asking && (
                  <div className="flex justify-start">
                    <div
                      className="bg-dark-100 border text-primary-theme rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center space-x-2"
                      style={{ backgroundColor: 'var(--bg-card-2)', borderColor: 'var(--border)' }}
                    >
                      <span className="animate-bounce">•</span>
                      <span className="animate-bounce [animation-delay:0.2s]">•</span>
                      <span className="animate-bounce [animation-delay:0.4s]">•</span>
                      <span className="text-[10px] text-muted-theme ml-1">Consulting plan...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Prompt Suggestions */}
              <div className="px-5 py-3 border-t bg-dark-100/5" style={{ borderColor: 'var(--border)' }}>
                <p className="text-[10px] font-bold text-muted-theme uppercase tracking-wider mb-2">Common benefits questions</p>
                <div className="flex flex-wrap gap-2">
                  {sampleQueries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskQuestion(q)}
                      disabled={asking}
                      className="smooth-btn text-[10px] font-semibold px-3 py-1.5 rounded-full border bg-page hover:bg-dark-100 text-muted-theme hover:text-primary-theme hover:border-primary-500/25 cursor-pointer disabled:cursor-not-allowed"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typing Box */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskQuestion();
                }}
                className="p-4 border-t flex items-center space-x-3"
                style={{ borderColor: 'var(--border)' }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question about dental, specialists, copays, deductibles..."
                  className="flex-1 border rounded-xl px-4 py-3 text-xs focus:outline-none text-primary-theme"
                  style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-input)' }}
                  disabled={asking}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || asking}
                  className="smooth-btn bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-3 rounded-xl cursor-pointer"
                >
                  <HiPaperAirplane className="h-4.5 w-4.5 rotate-90" />
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed py-24 text-center text-muted-theme">
              <HiOutlineChatAlt2 className="h-12 w-12 mx-auto text-subtle-theme mb-2 animate-bounce" />
              <p className="text-sm font-semibold text-primary-theme">Select a Plan to Start Asking Questions</p>
              <p className="text-xs text-subtle-theme mt-1">If no plans are listed, contact your corporate HR administrator.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePortalPage;
export { EmployeePortalPage };
