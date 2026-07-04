import "globals.css";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "components/ThemeProvider";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "ResumeFlow - Build. Optimize. Get Hired.",
  description:
    "ResumeFlow is an AI Career Operating System that helps you build, optimize, and track your resumes and job applications with ease.",
};

const themeScript = `
  (function() {
    try {
      var savedTheme = localStorage.getItem('resumeflow-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      var theme = savedTheme || (prefersDark ? 'dark' : 'light');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable}`}>
        <ThemeProvider>
          <TopNavBar />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
