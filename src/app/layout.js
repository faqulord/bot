import './globals.css'

export const metadata = {
  title: 'PRIME GLOBAL | Exclusive Management',
  description: 'Budapest - Dubai - Miami. The bridge to international success.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}