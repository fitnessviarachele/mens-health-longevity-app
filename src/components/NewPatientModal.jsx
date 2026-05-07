import React, { useState } from "react";

export default function NewPatientModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState("email");
  const [action, setAction] = useState("signup");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter a name");
    if (!phone.trim() && !email.trim()) return alert("Please provide a phone number or email address");
    if (method === "text" && !phone.trim()) return alert("Please enter a phone number to send a text");
    if (method === "email" && !email.trim()) return alert("Please enter an email address to send email");

    onCreate({ name: name.trim(), phone: phone.trim(), email: email.trim(), method, action });
    setName("");
    setPhone("");
    setEmail("");
    setMethod("email");
    setAction("signup");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold">Add patient</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-600">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Patient name"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Phone number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="e.g. +1234567890"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600">Email address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="patient@example.com"
            />
          </div>

          <div>
            <div className="text-sm text-slate-600">Send method</div>
            <div className="mt-2 flex gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="method" value="email" checked={method === "email"} onChange={() => setMethod("email")} />
                <span>Email</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="method" value="text" checked={method === "text"} onChange={() => setMethod("text")} />
                <span>Text</span>
              </label>
            </div>
          </div>

          <div>
            <div className="text-sm text-slate-600">Action</div>
            <div className="mt-2 flex gap-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="action" value="signup" checked={action === "signup"} onChange={() => setAction("signup")} />
                <span>Send signup link</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="action" value="credentials" checked={action === "credentials"} onChange={() => setAction("credentials")} />
                <span>Send login credentials</span>
              </label>
            </div>
          </div>

          <p className="text-sm text-slate-500">A login invite will be sent automatically to the patient so they can verify and access their profile page.</p>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">Cancel</button>
            <button type="submit" className="rounded-md bg-emerald-700 px-4 py-2 text-white">Create & notify</button>
          </div>
        </form>
      </div>
    </div>
  );
}
