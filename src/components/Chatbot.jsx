import { useState } from "react";
import {
  Mail,
  X,
  Send,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
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
      const res = await fetch("/api/p/4eQLm88J/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "EasyBuild <no-reply@charanfolio.site>",
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
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition-all ${
          isOpen ? "hidden" : "flex"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Mail size={24} />
      </motion.button>

      {/* Email Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[95vw] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-sm">
                Send Email
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Recipient Email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
              />

              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
              />

              <textarea
                rows={4}
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-blue-500"
              />

              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl py-2 transition-all"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Send size={16} />
                    Send Email
                  </>
                )}
              </button>

              {status && (
                <p className="text-xs text-center text-slate-400">
                  {status}
                </p>
              )}
            </div>

            <p className="text-[10px] text-center text-slate-500 mt-4">
              Powered by EasyBuild
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
