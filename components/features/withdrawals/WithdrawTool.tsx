"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/services/apiClient";
import { API_ENDPOINTS } from "@/shared/const/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WithdrawTool() {
  // Use global `api` which attaches Authorization header via auth handlers

  const [wallets, setWallets] = useState<any[]>([]);
  const [banks, setBanks] = useState<any[]>([]);
  const [paymentInfos, setPaymentInfos] = useState<any[]>([]);
  const [selectedPaymentInfoId, setSelectedPaymentInfoId] = useState<
    string | null
  >(null);
  const [bankCode, setBankCode] = useState("");
  const [bankAcc, setBankAcc] = useState("");
  const [bankName, setBankName] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [amount, setAmount] = useState("10000");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    loadBanks();
    loadPaymentInfos();
    // Auto-load wallet balances when entering the page
    checkBalance();
  }, []);

  const log = (msg: string, type: "info" | "success" | "error" = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 200));
  };

  // No local token parsing: rely on global api client to attach Authorization header

  async function loadBanks() {
    try {
      const res = await api.get("/banks");
      // normalize response: backend may return { result: [...] } or array directly
      const banksList = Array.isArray(res)
        ? res
        : res?.result || res?.data || [];
      setBanks(banksList);
      log(`Đã load ngân hàng (${banksList.length})`, "success");
    } catch (e: any) {
      log("Không load được danh sách ngân hàng", "error");
    }
  }

  async function checkBalance() {
    try {
      log("Đang tải thông tin ví...", "info");
      const res = await api.get("/payments/my-wallet");
      // normalize: backend may respond with { result: ... } or array
      const result = res?.result || res?.data || res;
      const walletsList = Array.isArray(result)
        ? result
        : result
          ? [result]
          : [];
      setWallets(walletsList);
      log("Tải thành công.", "success");
    } catch (e: any) {
      log(`Lỗi tải ví: ${e.message || e}`, "error");
      setWallets([]);
    }
  }

  async function addPaymentInfo(provider: "PAYOS" | "PAYPAL") {
    const data: any = { provider, isDefault: true };
    if (provider === "PAYOS") {
      data.bankCode = bankCode;
      data.receiverAccount = bankAcc;
      data.receiverName = bankName;
    } else {
      data.receiverAccount = paypalEmail;
      data.receiverName = null;
      data.bankCode = null;
    }
    try {
    } catch (e: any) {
      log(`Lỗi lưu: ${e.response?.data?.message || e.message}`, "error");
    }
  }

  async function loadPaymentInfos() {
    try {
    } catch (e: any) {
      log("Không load được payment infos", "error");
    }
  }

  async function deposit(provider: "PAYOS" | "PAYPAL") {
    try {
    } catch (e: any) {
      log(`Lỗi nạp: ${e.response?.data?.message || e.message}`, "error");
    }
  }

  async function withdraw(provider: "PAYOS" | "PAYPAL") {
    try {
    } catch (e: any) {
      log(`Lỗi rút: ${e.response?.data?.message || e.message}`, "error");
    }
  }

  return (
    <Card className="lg:col-span-2 border-border bg-card/50">
      <CardHeader className="border-b pb-4">
        <CardTitle>Rút Tiền</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Token and userId are handled by global auth; no manual token/userId input here */}

        <div className="p-3 bg-muted/20 rounded">
          <div className="mb-2">Danh sách Ví</div>
          {wallets.map((w) => (
            <div key={w.id} className="flex justify-between">
              <div>{w.currency}</div>
              <div>{w.balance}</div>
            </div>
          ))}
          {/* <div className="mt-2">
            <Button onClick={checkBalance}>Load</Button>
          </div> */}
        </div>

        {/* <div className="grid md:grid-cols-2 gap-2">
          <div className="md:col-span-2">
            <Label>Phương thức rút tiền đã lưu</Label>
            <select
              value={selectedPaymentInfoId ?? ""}
              onChange={(e:any)=>setSelectedPaymentInfoId(e.target.value || null)}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">-- Chọn phương thức --</option>
              {paymentInfos.map((p:any)=> (
                <option key={p.id} value={p.id}>{p.provider} - {p.receiverAccount} ({p.receiverName})</option>
              ))}
            </select>
          </div>
          <select value={bankCode} onChange={(e:any)=>setBankCode(e.target.value)} className="p-2 border rounded">
            <option value="">-- Chọn ngân hàng --</option>
            {banks.map((b:any)=> <option key={b.code} value={b.code}>{b.code} - {b.fullName}</option>)}
          </select>
          <Input value={bankAcc} onChange={(e:any)=>setBankAcc(e.target.value)} placeholder="Số Tài Khoản" />
          <Input value={bankName} onChange={(e:any)=>setBankName(e.target.value)} placeholder="Tên Chủ TK" />
          <Button onClick={()=>addPaymentInfo('PAYOS')}>Lưu Bank</Button>
          <Input value={paypalEmail} onChange={(e:any)=>setPaypalEmail(e.target.value)} placeholder="Email PayPal" />
          <Button onClick={()=>addPaymentInfo('PAYPAL')}>Lưu PayPal</Button>
        </div> */}

        <div>
          <Label>Số tiền</Label>
          <Input
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* <Button onClick={()=>deposit('PAYOS')}>Nạp PayOS</Button>
            <Button onClick={()=>deposit('PAYPAL')}>Nạp PayPal</Button> */}
            <Button onClick={() => withdraw("PAYOS")} className="bg-red-600">
              Rút về Bank
            </Button>
            <Button onClick={() => withdraw("PAYPAL")}>Rút về PayPal</Button>
          </div>
        </div>

        {/* <div className="bg-black text-green-400 p-3 rounded max-h-48 overflow-auto font-mono text-sm">
          {logs.map((l, idx)=> <div key={idx} dangerouslySetInnerHTML={{__html: l}} />)}
        </div> */}
      </CardContent>
    </Card>
  );
}

export default WithdrawTool;
