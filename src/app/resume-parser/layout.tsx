import { AppShell } from "components/AppShell";

export default function ParserLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
