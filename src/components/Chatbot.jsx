import { useState } from "react";
import {
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const Chatbot = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSend = async () => {
    if (!to || !subject || !message || isLoading) return;

    setIsLoading(true);
    setStatus(null);

    try {
      // Support comma separated emails
      const recipients = to
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);

      for (const recipient of recipients) {
        const res = await fetch("/1vvbpdt0/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Example <no-reply@fuseplane.com>",
            to: recipient,
            subject,
            html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
          }),
        });

        if (!res.ok) {
          throw new Error(await res.text());
        }
      }

      setStatus("Emails sent successfully ✅");
      setTo("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("EasyBuild Email Error:", error);
      setStatus("Failed to send email ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-900 font-semibold text-xl flex items-center gap-2">
          <Mail className="text-blue-600" />
          Send Email
        </h3>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-600 mb-1 block">To</label>
          <input
            type="email"
            placeholder="recipient@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600 mb-1 block">Subject</label>
          <input
            type="text"
            placeholder="Enter subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="text-sm text-slate-600 mb-1 block">Message</label>
          <textarea
            rows={6}
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-xl py-3 transition-all mt-2"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <Send size={18} />
              Send Email
            </>
          )}
        </button>

        {status && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-sm text-center mt-4 ${status.includes("successfully") ? "text-green-600" : "text-red-600"
              }`}
          >
            {status}
          </motion.p>
        )}
      </div>

    </motion.div>
  );
};

export default Chatbot;
