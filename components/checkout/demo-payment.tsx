"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
} from "lucide-react";
import { formatINR } from "@/lib/money";

type Method = "upi" | "card" | "netbanking" | "wallet";

const TABS: { key: Method; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { key: "upi", label: "UPI", icon: Smartphone },
  { key: "card", label: "Card", icon: CreditCard },
  { key: "netbanking", label: "Netbanking", icon: Building2 },
  { key: "wallet", label: "Wallet", icon: Wallet },
];

export function DemoPayment({
  amount,
  onClose,
  onSuccess,
}: {
  amount: number;
  onClose: () => void;
  onSuccess: (method: Method, paymentId: string) => void;
}) {
  const [tab, setTab] = useState<Method>("upi");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiId, setUpiId] = useState("babycon@okhdfcbank");
  const [card, setCard] = useState("4111 1111 1111 1111");
  const [expiry, setExpiry] = useState("12/34");
  const [cvv, setCvv] = useState("123");
  const [bank, setBank] = useState("HDFC Bank");

  function pay() {
    if (paying || paid) return;
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      setTimeout(() => {
        const paymentId = `pay_demo_${Math.random().toString(36).slice(2, 14)}`;
        onSuccess(tab, paymentId);
      }, 900);
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-[140] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]" onClick={paid || paying ? undefined : onClose} />
      <div className="relative flex max-h-[94vh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:max-w-[440px]">
        <div className="flex items-center justify-between bg-[#0b2447] px-5 py-3.5 text-white">
          <div className="flex items-center gap-2">
            <span className="text-[17px] font-bold lowercase tracking-tight text-white">razorpay</span>
            <span className="rounded-sm bg-amber-400 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#0b2447]">
              Test mode
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={paying || paid}
            aria-label="Close payment"
            className="text-white/60 transition-colors hover:text-white disabled:opacity-30"
          >
            <X size={18} />
          </button>
        </div>

        <div className="border-b border-amber-200 bg-amber-50 px-5 py-2.5 text-center text-[9.5px] leading-relaxed text-amber-800">
          Demo checkout · No real payment is processed. Use any details below.
        </div>

        {paid ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
            <CheckCircle2 size={56} className="text-[#0b9d5b]" strokeWidth={1.4} />
            <h3 className="mt-4 text-[20px] font-semibold text-[#0b2447]">Payment successful</h3>
            <p className="mt-1 text-[12px] text-gray-500">
              {formatINR(amount)} · {TABS.find((t) => t.key === tab)?.label} (demo)
            </p>
            <p className="mt-4 text-[11px] text-gray-400">Creating your order…</p>
            <Loader2 size={16} className="mt-2 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="flex border-b border-gray-200">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex flex-1 flex-col items-center gap-1 py-3 text-[9.5px] font-medium uppercase tracking-[0.08em] transition-colors ${
                    tab === key
                      ? "border-b-2 border-[#0b72e7] text-[#0b72e7]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.7} />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="mb-4 flex items-center justify-between rounded-sm bg-gray-50 px-4 py-3">
                <span className="text-[10.5px] text-gray-500">Amount payable</span>
                <span className="text-[17px] font-semibold text-[#0b2447]">{formatINR(amount)}</span>
              </div>

              {tab === "upi" && (
                <div>
                  <label className="mb-1.5 block text-[10.5px] font-medium text-gray-500">
                    Enter UPI ID
                  </label>
                  <div className="flex overflow-hidden rounded-sm border border-gray-300 focus-within:border-[#0b72e7]">
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="h-11 flex-1 px-3 text-[13px] text-gray-800 outline-none"
                    />
                    <button className="bg-gray-100 px-3 text-[9px] font-medium uppercase tracking-wide text-[#0b72e7]">
                      Verify
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                      <span key={app} className="rounded-sm border border-gray-200 px-2.5 py-1.5 text-[9.5px] text-gray-500">
                        {app}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-[10px] leading-relaxed text-gray-400">
                    A collect request would be sent to your UPI app. In this demo, clicking
                    pay will simulate an instant success.
                  </p>
                </div>
              )}

              {tab === "card" && (
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[10.5px] font-medium text-gray-500">Card number</label>
                    <div className="flex items-center overflow-hidden rounded-sm border border-gray-300 focus-within:border-[#0b72e7]">
                      <CreditCard size={15} className="ml-3 text-gray-400" />
                      <input
                        value={card}
                        onChange={(e) => setCard(e.target.value)}
                        className="h-11 flex-1 px-3 text-[13px] tracking-wide text-gray-800 outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-[10.5px] font-medium text-gray-500">Expiry</label>
                      <input
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="h-11 w-full rounded-sm border border-gray-300 px-3 text-[13px] outline-none focus:border-[#0b72e7]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10.5px] font-medium text-gray-500">CVV</label>
                      <input
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        type="password"
                        className="h-11 w-full rounded-sm border border-gray-300 px-3 text-[13px] outline-none focus:border-[#0b72e7]"
                      />
                    </div>
                  </div>
                  <p className="flex items-center gap-1.5 pt-1 text-[9.5px] text-gray-400">
                    <Lock size={11} /> This is test card data, not a real card.
                  </p>
                </div>
              )}

              {tab === "netbanking" && (
                <div className="space-y-2">
                  {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra"].map((name) => (
                    <label
                      key={name}
                      className={`flex cursor-pointer items-center gap-3 rounded-sm border px-3.5 py-3 text-[12px] transition-colors ${
                        bank === name ? "border-[#0b72e7] bg-blue-50/50" : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="bank"
                        checked={bank === name}
                        onChange={() => setBank(name)}
                        className="accent-[#0b72e7]"
                      />
                      {name}
                    </label>
                  ))}
                </div>
              )}

              {tab === "wallet" && (
                <div className="space-y-2">
                  {["PhonePe Wallet", "Amazon Pay", "Paytm Wallet", "Mobikwik"].map((name) => (
                    <label
                      key={name}
                      className="flex cursor-pointer items-center gap-3 rounded-sm border border-gray-200 px-3.5 py-3 text-[12px]"
                    >
                      <input type="radio" name="wallet" className="accent-[#0b72e7]" />
                      {name}
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-5">
              <button
                onClick={pay}
                disabled={paying}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[#0b72e7] text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#0a63c9] disabled:opacity-70"
              >
                {paying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing (demo)
                  </>
                ) : (
                  <>Pay {formatINR(amount)} (test)</>
                )}
              </button>
              <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[9px] text-gray-400">
                <ShieldCheck size={11} /> Secured by Razorpay · Simulation only — no charge
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
