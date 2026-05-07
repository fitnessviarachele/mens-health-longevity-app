import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Verify({ token, patientId, onLogin }) {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(`verify_${patientId}`);
    if (storedToken === token) {
      setVerified(true);
      localStorage.removeItem(`verify_${patientId}`);
    }
  }, [token, patientId]);

  const handleLogin = () => {
    onLogin(patientId);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Verify Your Account</CardTitle></CardHeader>
        <CardContent>
          {verified ? (
            <div className="space-y-4">
              <p className="text-green-700">Verification successful! You can now access your profile.</p>
              <Button onClick={handleLogin} className="w-full">Log In</Button>
            </div>
          ) : (
            <p className="text-red-700">Invalid or expired verification link.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}