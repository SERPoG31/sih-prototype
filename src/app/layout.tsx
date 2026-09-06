import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StudentProvider } from "@/context/student-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillNexus – SIH 2026 | AI-Driven Academia-Industry Collaboration Portal",
  description:
    "Next-generation proof-of-work verification loop bridging students, universities, and industry recruiters with tamper-proof evidence authentication.",
  keywords: [
    "SkillNexus",
    "SIH 2026",
    "Smart India Hackathon",
    "SkillMapping",
    "Internships",
    "Placements",
    "Automated Evidence Verification",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <StudentProvider>{children}</StudentProvider>
      </body>
    </html>
  );
}
