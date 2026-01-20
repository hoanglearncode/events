"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  Globe,
  Settings,
  Image as ImageIcon,
  Layout,
  Type,
  Code,
  Eye,
  Send,
  Rocket,
  History,
  ShieldCheck,
  ChevronRight,
  // Added Monitor and Smartphone icons
  MoreVertical,
  Search,
  MousePointer2,
  Monitor,
  Smartphone,
} from "lucide-react";

export default function AdminContentEditor({
  pageId,
}: {
  pageId: string | null;
}) {
  const [activeTab, setActiveTab] = useState("editor");

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Editor Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-8 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <a
            href="#admin/content"
            className="p-2 hover:bg-muted rounded-lg transition-all text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </a>
          <div className="h-8 w-px bg-border" />
          <div className="space-y-0.5">
            <h1 className="text-sm font-bold flex items-center gap-2">
              Edit: Landing Page Hero
              <span className="px-2 py-0.5 rounded-full bg-brand-success/10 text-brand-success text-[8px] font-bold uppercase border border-brand-success/20 tracking-widest">
                Live
              </span>
            </h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              {pageId || "PG-001"} • manix.ai/home
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted text-[10px] font-bold text-muted-foreground uppercase">
            <History size={12} /> Đã lưu: 2m trước
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
            <Save size={16} /> Lưu Thay Đổi
          </button>
          <button className="p-2.5 rounded-xl border border-border hover:bg-muted transition-all">
            <Rocket size={18} className="text-brand-success" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT BAR: Content Structure */}
        <aside className="w-80 border-r border-border flex flex-col bg-sidebar/30">
          <div className="p-6 border-b border-border">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Cấu trúc trang
            </h3>
            <div className="space-y-2">
              {[
                "Hero Section",
                "Features Grid",
                "Prompt Engine Demo",
                "Affiliate Banner",
                "FAQ Accordion",
              ].map((s, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${i === 0 ? "border-primary/50 bg-primary/5 text-primary" : "border-border bg-card/50 hover:border-primary/30"}`}
                >
                  <div className="flex items-center gap-3">
                    <Layout size={14} />
                    <span className="text-xs font-bold">{s}</span>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-muted rounded">
                      <Settings size={12} />
                    </button>
                    <button className="p-1 hover:bg-muted rounded">
                      <MoreVertical size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-dashed border-border rounded-xl text-[10px] font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-all uppercase tracking-widest">
              + Thêm Section mới
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Metadata & SEO
              </h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">
                    Page Title
                  </label>
                  <input
                    type="text"
                    defaultValue="ManixAI - Video AI Production"
                    className="w-full bg-muted border border-border rounded-lg py-2 px-3 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Hệ sinh thái tạo video AI công nghiệp hàng đầu..."
                    className="w-full bg-muted border border-border rounded-lg py-2 px-3 text-xs outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN: Visual Editor / Fields */}
        <main className="flex-1 bg-muted/20 overflow-y-auto p-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Tab Control */}
            <div className="flex gap-6 border-b border-border pb-4">
              {["editor", "source", "settings"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`text-xs font-bold uppercase tracking-widest transition-all relative pb-4 ${activeTab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t === "editor"
                    ? "Visual Editor"
                    : t === "source"
                      ? "JSON Source"
                      : "Section Settings"}
                  {activeTab === t && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {activeTab === "editor" ? (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
                      <Type size={20} className="text-primary" /> Text Content
                    </h3>
                    <button className="text-[10px] font-bold text-primary uppercase border border-primary/20 px-3 py-1 rounded-lg">
                      Multi-language
                    </button>
                  </div>
                  <div className="bg-card border border-border rounded-[2.5rem] p-10 space-y-8 shadow-sm">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Hero Heading (H1)
                      </label>
                      <div className="border border-border rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all">
                        <div className="p-2 bg-muted/50 border-b border-border flex gap-1">
                          <button className="p-2 hover:bg-muted rounded text-[10px] font-bold uppercase">
                            B
                          </button>
                          <button className="p-2 hover:bg-muted rounded text-[10px] font-bold uppercase">
                            I
                          </button>
                          <button className="p-2 hover:bg-muted rounded text-[10px] font-bold uppercase text-primary">
                            Gradient
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          defaultValue="Sản xuất Video AI Quy mô Công nghiệp"
                          className="w-full bg-transparent py-4 px-6 text-2xl font-extrabold outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Sub-heading Text
                      </label>
                      <textarea
                        rows={4}
                        defaultValue="Nền tảng duy nhất giúp bạn vận hành hàng nghìn luồng render video 4K song song..."
                        className="w-full bg-muted border border-border rounded-2xl py-4 px-6 text-sm text-muted-foreground leading-relaxed outline-none focus:ring-1 focus:ring-primary transition-all"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-foreground">
                    <ImageIcon size={20} className="text-brand-success" /> Media
                    & Visuals
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-[2rem] p-8 space-y-4 shadow-sm">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Background Video URL
                      </label>
                      <div className="aspect-video rounded-xl bg-muted border border-border overflow-hidden relative group cursor-pointer">
                        <img
                          src="https://picsum.photos/seed/bg/800/450"
                          alt="v"
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-white text-black px-4 py-2 rounded-xl text-xs font-bold">
                            Thay đổi Video
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="bg-card border border-border rounded-[2rem] p-8 flex flex-col justify-center gap-6 shadow-sm">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Call to Action (CTA)
                      </label>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold w-12 text-slate-500 uppercase">
                            Text:
                          </span>
                          <input
                            type="text"
                            defaultValue="Khám phá ngay"
                            className="flex-1 bg-muted border border-border rounded-xl py-2.5 px-4 text-xs outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold w-12 text-slate-500 uppercase">
                            Link:
                          </span>
                          <input
                            type="text"
                            defaultValue="#portal"
                            className="flex-1 bg-muted border border-border rounded-xl py-2.5 px-4 text-xs font-mono outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-8 font-mono text-sm leading-relaxed overflow-hidden">
                <code className="text-brand-success">
                  {`{
  "id": "PG-001",
  "route": "/",
  "sections": [
    {
      "type": "hero",
      "data": {
        "title": "Sản xuất Video AI Quy mô Công nghiệp",
        "subtitle": "Nền tảng duy nhất giúp bạn...",
        "cta": { "text": "Khám phá ngay", "href": "#portal" }
      }
    }
  ]
}`}
                </code>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT BAR: Quick Preview */}
        <aside className="w-96 border-l border-border bg-card/30 flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Live Preview
            </h3>
            <div className="flex gap-1">
              <button className="p-1.5 bg-primary/10 text-primary rounded-lg">
                <Monitor size={14} />
              </button>
              <button className="p-1.5 text-muted-foreground hover:bg-muted rounded-lg">
                <Smartphone size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="w-full aspect-[9/16] bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-2xl overflow-hidden relative">
              <div className="p-6 space-y-4">
                <div className="w-12 h-2 bg-primary/40 rounded-full" />
                <div className="space-y-2 pt-10">
                  <div className="h-6 w-full bg-white/10 rounded" />
                  <div className="h-6 w-[80%] bg-white/10 rounded" />
                </div>
                <div className="h-20 w-full bg-white/5 rounded-xl" />
                <div className="h-10 w-full bg-primary rounded-xl" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-primary/20 backdrop-blur-[2px]">
                <button className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-xl shadow-white/20">
                  <MousePointer2 size={12} /> Click to focus
                </button>
              </div>
            </div>
            <p className="text-center mt-4 text-[9px] text-muted-foreground uppercase font-bold tracking-widest">
              Mock Mobile View
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
