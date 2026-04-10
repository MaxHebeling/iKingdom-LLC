type CornerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export default function MarginMarks() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {/* Top edge hairline */}
      <div className="absolute top-0 inset-x-0 h-px bg-[--color-fg] opacity-[0.06]" />
      {/* Bottom edge hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-[--color-fg] opacity-[0.06]" />

      {/* Vertical content-edge hairlines (desktop only) */}
      <div
        className="absolute top-0 bottom-0 hidden md:block w-px bg-[--color-fg] opacity-[0.08]"
        style={{ left: "max(24px, calc(50% - 700px))" }}
      />
      <div
        className="absolute top-0 bottom-0 hidden md:block w-px bg-[--color-fg] opacity-[0.08]"
        style={{ right: "max(24px, calc(50% - 700px))" }}
      />

      {/* Four corner brackets */}
      <CornerBracket position="top-left" />
      <CornerBracket position="top-right" />
      <CornerBracket position="bottom-left" />
      <CornerBracket position="bottom-right" />
    </div>
  );
}

function CornerBracket({ position }: { position: CornerPosition }) {
  // 24px arms, 1px stroke, 24px from the corner of the viewport.
  // Each bracket is two perpendicular 1px divs forming an L.
  const isTop = position.startsWith("top");
  const isLeft = position.endsWith("left");

  const vStyle: React.CSSProperties = {
    width: "1px",
    height: "24px",
    [isTop ? "top" : "bottom"]: "24px",
    [isLeft ? "left" : "right"]: "24px",
  };

  const hStyle: React.CSSProperties = {
    height: "1px",
    width: "24px",
    [isTop ? "top" : "bottom"]: "24px",
    [isLeft ? "left" : "right"]: "24px",
  };

  return (
    <>
      <div
        className="absolute bg-[--color-fg] opacity-[0.15]"
        style={vStyle}
      />
      <div
        className="absolute bg-[--color-fg] opacity-[0.15]"
        style={hStyle}
      />
    </>
  );
}
