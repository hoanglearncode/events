import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster as SonnerToaster } from "sonner";
import { I18nProvider } from "@/providers/i18n-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { SettingProvider } from "@/providers/setting-provider";
import { getSettingGeneral } from "@/services/setting.service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  // const settings = await getSettingGeneral();

  return {
    title:
      // settings?.systemTitle ??
      "VolHub – Nền tảng sự kiện & tuyển dụng hàng đầu cho sinh viên và doanh nghiệp",
    description:
      // settings?.systemDescription ??
      "VolHub kết nối sinh viên, tình nguyện viên và doanh nghiệp thông qua các sự kiện tuyển dụng, hoạt động cộng đồng và cơ hội nghề nghiệp uy tín trên toàn quốc.",
    // Nếu có logo từ API
    // ...(settings?.systemLogo && {
    //   icons: { icon: settings.systemLogo },
    //   openGraph: {
    //     images: [settings.systemLogo],
    //   },
    // }),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/event_logo.jpg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <QueryProvider>
            <AuthProvider>
              <I18nProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange={false}
                >
                  <SettingProvider>{children}</SettingProvider>
                </ThemeProvider>
              </I18nProvider>
            </AuthProvider>
          </QueryProvider>
        </NuqsAdapter>
        <SonnerToaster richColors closeButton />
      </body>
    </html>
  );
}
