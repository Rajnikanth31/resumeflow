import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "components/ThemeProvider";

export const metadata = {
  title: "ResumeFlow - Build. Optimize. Get Hired.",
  description:
    "ResumeFlow is an AI Career Operating System that helps you build, optimize, and track your resumes and job applications with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <TopNavBar />
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
