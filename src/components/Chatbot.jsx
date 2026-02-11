import { useState } from "react";
import {
  Mail,
  Send,
  Loader2,
  Paperclip,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [lastEmailId, setLastEmailId] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [attachmentsError, setAttachmentsError] = useState(null);

  // Send email via POST to the Resend emails endpoint
  const handleSend = async () => {
    if (!to || !subject || !message || isLoading) return;

    setIsLoading(true);
    setStatus(null);
    setLastEmailId(null);
    setAttachments([]);
    setAttachmentsError(null);

    try {
      // Support comma separated emails
      const recipients = to
        .split(",")
        .map((email) => email.trim())
        .filter(Boolean);

      let emailId = null;

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

        const data = await res.json();
        // Store the last email ID (from Resend response: { id: "..." })
        if (data?.id) {
          emailId = data.id;
        }
      }

      setLastEmailId(emailId);
      setStatus("Emails sent successfully ✅");
      setTo("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Email Error:", error);
      setStatus("Failed to send email ❌");
    } finally {
      setIsLoading(false);
    }
  };

  // List attachments for a given email via GET
  const handleListAttachments = async (emailId) => {
    if (!emailId) return;

    setAttachmentsLoading(true);
    setAttachmentsError(null);
    setAttachments([]);

    try {
      const res = await fetch(`/1vvbpdt0/emails/${emailId}/attachments`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();
      // Resend returns { data: [ { id, filename, content_type } ] }
      setAttachments(data?.data || []);
    } catch (error) {
      console.error("List Attachments Error:", error);
      setAttachmentsError("Failed to fetch attachments ❌");
    } finally {
      setAttachmentsLoading(false);
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
            className={`text-sm text-center mt-4 ${status.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
              }`}
          >
            {status}
          </motion.p>
        )}

        {/* List Attachments Section */}
        <AnimatePresence>
          {lastEmailId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-slate-200 pt-4 mt-4"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500">
                  Email ID: <span className="font-mono text-slate-700">{lastEmailId}</span>
                </p>
                <button
                  onClick={() => handleListAttachments(lastEmailId)}
                  disabled={attachmentsLoading}
                  className="flex items-center gap-1.5 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg px-3 py-1.5 transition-all disabled:opacity-50"
                >
                  {attachmentsLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Paperclip size={14} />
                  )}
                  List Attachments
                </button>
              </div>

              {attachmentsError && (
                <p className="text-xs text-red-500 mt-2">{attachmentsError}</p>
              )}

              {attachments.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2 mt-2"
                >
                  {attachments.map((att, idx) => (
                    <li
                      key={att.id || idx}
                      className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
                    >
                      <FileText size={16} className="text-slate-400 shrink-0" />
                      <span className="truncate font-medium">
                        {att.filename || "Unnamed"}
                      </span>
                      {att.content_type && (
                        <span className="ml-auto text-xs text-slate-400">
                          {att.content_type}
                        </span>
                      )}
                    </li>
                  ))}
                </motion.ul>
              )}

              {attachments.length === 0 &&
                !attachmentsLoading &&
                !attachmentsError && (
                  <p className="text-xs text-slate-400 mt-2">
                    Click "List Attachments" to fetch attachments for this email.
                  </p>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Chatbot;
