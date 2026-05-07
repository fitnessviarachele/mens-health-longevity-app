import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signup({ patientId, onVerify }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return alert("Enter phone number");
    setLoading(true);
    try {
      const token = Math.random().toString(36).substr(2, 9); // simple token
      localStorage.setItem(`verify_${patientId}`, token);
      const response = await fetch('http://localhost:3001/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          body: `Verify your account: ${window.location.origin}/verify?token=${token}&patientId=${patientId}`
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.mock) {
          alert("Mock verification SMS sent! (check server console for details)");
        } else {
          alert("Verification SMS sent!");
        }
        onVerify(token, patientId);
      } else {
        alert("Failed to send SMS");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Sign Up for Your Health Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="+1234567890"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Verification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}