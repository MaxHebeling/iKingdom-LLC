export default function EsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="es"`,
        }}
      />
      <div lang="es">{children}</div>
    </>
  );
}
