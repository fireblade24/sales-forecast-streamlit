import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="shell">
          <header className="topbar">
            <nav className="nav">
              <Link href="/today">Today</Link>
              <Link href="/calendar">Calendar</Link>
              <Link href="/inbox">Inbox</Link>
              <Link href="/talk">Talk</Link>
              <Link href="/login">Login</Link>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
