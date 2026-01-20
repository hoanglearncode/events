"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Mail, ExternalLink, RefreshCw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

import {
  useResendVerificationEmail,
  useVerifyEmail,
} from "@/hooks/queries/use-auth-queries";

/* -------------------- utils -------------------- */
function decodeEmail(hash?: string | null) {
  if (!hash) return "";
  try {
    return atob(decodeURIComponent(hash));
  } catch {
    return "";
  }
}

/* -------------------- Page -------------------- */
export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailHash = searchParams.get("email");
  const email = useMemo(() => decodeEmail(emailHash), [emailHash]);
  /* -------- OTP state (6 digits) -------- */
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isPasting, setIsPasting] = useState(false);

  /* -------- resend countdown -------- */
  const [counter, setCounter] = useState<number>(30);
  const resendMutation = useResendVerificationEmail();
  const verifyEmailMutation = useVerifyEmail();

  useEffect(() => {
    // focus first input on mount
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (counter <= 0) return;
    const timer = setInterval(() => setCounter((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const setAt = (index: number, val: string) => {
    setCode((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  /* -------- handlers -------- */
  const handleChange = (index: number, rawValue: string) => {
    const filtered = rawValue.replace(/\D/g, "");
    const value = filtered.length > 1 ? filtered.slice(-1) : filtered;

    if (value === "") {
      setAt(index, "");
      return;
    }

    setAt(index, value);

    // move to next
    const nextIndex = Math.min(index + 1, 5);
    inputsRef.current[nextIndex]?.focus();
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (code[index]) {
        // clear current
        setAt(index, "");
      } else if (index > 0) {
        // move back and clear previous
        inputsRef.current[index - 1]?.focus();
        setAt(index - 1, "");
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").trim();
    const digits = paste.replace(/\D/g, "");
    if (!digits) return;

    setIsPasting(true);
    const arr = Array(6)
      .fill("")
      .map((_, i) => digits[i] ?? "");

    setCode(arr);

    // focus the first empty or last input
    const firstEmpty = arr.findIndex((c) => !c);
    const focusIndex = firstEmpty === -1 ? 5 : firstEmpty;
    setTimeout(() => {
      inputsRef.current[focusIndex]?.focus();
      setIsPasting(false);
    }, 0);
    e.preventDefault();
  };

  /* -------- auto submit when đủ 6 số -------- */
  useEffect(() => {
    const otp = code.join("");
    if (otp.length === 6 && !code.includes("") && !isPasting) {
      submitOtp(otp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, isPasting]);

  const submitOtp = async (otp: string) => {
    if (!email) {
      toast.error("Không xác định được email");
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync({ email, otpCode: otp });
      // onSuccess of the hook will redirect; but we can show toast here if desired
      toast.success("Xác thực email thành công");
    } catch (err: any) {
      // The hook's onError already logs; show feedback and reset inputs
      toast.error(err?.message || "Mã xác thực không hợp lệ");
      setCode(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Không xác định được email");
      return;
    }

    try {
      await resendMutation.mutateAsync({ email });
      toast.success("Đã gửi lại mã xác thực");
      setCounter(30);
      setCode(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err: any) {
      toast.error(err?.message || "Không thể gửi lại mã, vui lòng thử sau");
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
      <Card className="w-full max-w-md bg-slate-900/50 border-white/10 backdrop-blur-xl text-center text-white">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/manix-log.png"
              alt="ManixAI logo"
              width={36}
              height={36}
            />
            <span className="text-xl font-bold">ManixAI</span>
          </div>

          <div className="mx-auto w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Mail className="w-10 h-10 text-indigo-400" />
          </div>

          <CardTitle className="text-2xl">Nhập mã xác thực</CardTitle>
          <CardDescription className="text-slate-400">
            Mã gồm 6 chữ số đã được gửi tới{" "}
            <span className="text-indigo-400 font-semibold">
              {email || "(không xác định)"}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP inputs */}
          <div
            className="flex justify-center gap-3"
            onPaste={(e) => {
              // delegate paste to first input handler (so user can paste anywhere in group)
              handlePaste(e as any);
            }}
          >
            {code.map((value, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputsRef.current[index] = el;
                }}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(index, e)
                }
                maxLength={1}
                inputMode="numeric"
                aria-label={`Digit ${index + 1}`}
                className="w-12 h-14 text-center text-2xl font-bold rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:border-indigo-500"
              />
            ))}
          </div>

          <Button
            className="w-full bg-white text-black hover:bg-slate-200 flex items-center justify-center gap-2 py-6 font-semibold"
            onClick={() => window.open("https://mail.google.com", "_blank")}
          >
            Mở Email
            <ExternalLink className="w-4 h-4" />
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button
            variant="ghost"
            disabled={counter > 0 || resendMutation.isPending}
            onClick={handleResend}
            className="text-indigo-400 hover:text-indigo-300 hover:bg-white/5 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {counter > 0 ? `Gửi lại mã (${counter}s)` : "Gửi lại mã"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
