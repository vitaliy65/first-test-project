import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import TabsContainer from "@/components/DraggableTabs";

export const metadata: Metadata = {
  title: "Posvistak Vitaliy - first test project",
  description: "created for first test task",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex w-full max-h-screen overflow-hidden">
        <Providers>
          <TabsContainer>{children}</TabsContainer>
        </Providers>
      </body>
    </html>
  );
}
