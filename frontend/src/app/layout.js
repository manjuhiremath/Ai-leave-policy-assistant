import "./globals.css";

export const metadata = {
  title: "HR Policy Assistant",
  description: "Ask HR policy questions with citations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
