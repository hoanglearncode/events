"use client";
import React, { useState } from "react";
import {
  Eye,
  Edit3,
  Save,
  RotateCcw,
  Sparkles,
  Video,
  Users,
  Building2,
  Zap,
  ShieldCheck,
  Award,
  Fingerprint,
  Target,
  Wand2,
  Clock,
  AlertTriangle,
  TrendingDown,
  Layers,
  MessageSquare,
  FileStack,
  Code,
  Flame,
  BarChart3,
  ShoppingCart,
  GraduationCap,
  Rocket,
  Play,
} from "lucide-react";
import { LANDING_PAGE_INITIAL_DATA } from "@/hooks/feature/landing-page";
const iconMap = {
  Sparkles,
  Video,
  Users,
  Building2,
  Zap,
  ShieldCheck,
  Award,
  Fingerprint,
  Target,
  Wand2,
  Clock,
  AlertTriangle,
  TrendingDown,
  Layers,
  MessageSquare,
  FileStack,
  Code,
  Flame,
  BarChart3,
  ShoppingCart,
  GraduationCap,
  Rocket,
  Play,
};

export default function LandingPageEditor() {
  const [data, setData] = useState(LANDING_PAGE_INITIAL_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(LANDING_PAGE_INITIAL_DATA);
  const [activeTab, setActiveTab] = useState("preview");

  const handleEdit = () => {
    setEditData(data);
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleSave = () => {
    setData(editData);
    setIsEditing(false);
    setActiveTab("preview");
    alert("Đã lưu thay đổi thành công!");
  };

  const handleReset = () => {
    setEditData(data);
  };

  const handleCancel = () => {
    setEditData(data);
    setIsEditing(false);
    setActiveTab("preview");
  };

  const updateField = (path, value) => {
    const keys = path.split(".");
    const newData = JSON.parse(JSON.stringify(editData));
    let current = newData;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    setEditData(newData);
  };

  const IconComponent = ({ name, className = "w-5 h-5" }) => {
    const Icon = iconMap[name] || Sparkles;
    return <Icon className={className} />;
  };

  const PreviewSection = () => {
    const previewData = isEditing ? editData : data;

    return (
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary/5 via-brand-secondary/5 to-brand-accent/5 rounded-3xl p-12 border border-border">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full mb-6">
            <IconComponent
              name={previewData.hero.badge.icon}
              className="w-4 h-4 text-brand-primary"
            />
            <span className="text-sm font-semibold text-brand-primary">
              {previewData.hero.badge.text}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {previewData.hero.title.main}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">
              {previewData.hero.title.highlight}
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl leading-relaxed">
            {previewData.hero.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            {previewData.hero.cta.map((btn, idx) => (
              <button
                key={idx}
                className={`
                  px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all
                  ${
                    btn.variant === "default"
                      ? "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg hover:shadow-xl"
                      : "bg-card border-2 border-border hover:border-brand-primary text-foreground hover:text-brand-primary"
                  }
                `}
              >
                <IconComponent name={btn.icon} className="w-4 h-4" />
                {btn.text}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {previewData.hero.stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-2xl p-6 hover:border-brand-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <IconComponent
                      name={stat.icon}
                      className="w-5 h-5 text-brand-primary"
                    />
                  </div>
                  <p className="text-3xl font-extrabold text-brand-primary">
                    {stat.value}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground font-semibold">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const EditSection = () => {
    return (
      <div className="space-y-8">
        {/* Badge Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-primary" />
            Badge
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-muted-foreground">
                Icon Name
              </label>
              <input
                type="text"
                value={editData.hero.badge.icon}
                onChange={(e) => updateField("hero.badge.icon", e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Available: Sparkles, Video, Users, Building2, Zap, etc.
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-muted-foreground">
                Badge Text
              </label>
              <input
                type="text"
                value={editData.hero.badge.text}
                onChange={(e) => updateField("hero.badge.text", e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-brand-secondary" />
            Title
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-muted-foreground">
                Main Title
              </label>
              <input
                type="text"
                value={editData.hero.title.main}
                onChange={(e) => updateField("hero.title.main", e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-muted-foreground">
                Highlight Text (Gradient)
              </label>
              <input
                type="text"
                value={editData.hero.title.highlight}
                onChange={(e) =>
                  updateField("hero.title.highlight", e.target.value)
                }
                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-accent" />
            Description
          </h3>
          <textarea
            value={editData.hero.description}
            onChange={(e) => updateField("hero.description", e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
          />
        </div>

        {/* CTA Buttons */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-brand-warning" />
            CTA Buttons
          </h3>
          <div className="space-y-4">
            {editData.hero.cta.map((btn, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-xl space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">Button {idx + 1}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${btn.variant === "default" ? "bg-brand-primary/20 text-brand-primary" : "bg-muted-foreground/20 text-muted-foreground"}`}
                  >
                    {btn.variant}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                      Text
                    </label>
                    <input
                      type="text"
                      value={btn.text}
                      onChange={(e) => {
                        const newCta = [...editData.hero.cta];
                        newCta[idx].text = e.target.value;
                        updateField("hero.cta", newCta);
                      }}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-muted-foreground">
                      Icon
                    </label>
                    <input
                      type="text"
                      value={btn.icon}
                      onChange={(e) => {
                        const newCta = [...editData.hero.cta];
                        newCta[idx].icon = e.target.value;
                        updateField("hero.cta", newCta);
                      }}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-success" />
            Statistics
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {editData.hero.stats.map((stat, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-xl space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">Stat {idx + 1}</span>
                  <IconComponent
                    name={stat.icon}
                    className="w-4 h-4 text-brand-primary"
                  />
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Value"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...editData.hero.stats];
                      newStats[idx].value = e.target.value;
                      updateField("hero.stats", newStats);
                    }}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <input
                    type="text"
                    placeholder="Label"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...editData.hero.stats];
                      newStats[idx].label = e.target.value;
                      updateField("hero.stats", newStats);
                    }}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                  <input
                    type="text"
                    placeholder="Icon name"
                    value={stat.icon}
                    onChange={(e) => {
                      const newStats = [...editData.hero.stats];
                      newStats[idx].icon = e.target.value;
                      updateField("hero.stats", newStats);
                    }}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Landing Page Editor</h1>
              <p className="text-xs text-muted-foreground">Hero Section</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing && (
              <>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:border-brand-warning/50 flex items-center gap-2 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:border-border transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            )}
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="px-4 py-2 text-sm font-semibold bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      {isEditing && (
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("edit")}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === "edit"
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === "preview"
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="w-4 h-4 inline mr-2" />
                Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {isEditing ? (
          activeTab === "edit" ? (
            <EditSection />
          ) : (
            <PreviewSection />
          )
        ) : (
          <PreviewSection />
        )}
      </main>
    </div>
  );
}
