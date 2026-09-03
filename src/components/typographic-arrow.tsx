type TypographicArrowProps = {
  direction?: "right" | "up-right";
};

export function TypographicArrow({
  direction = "up-right",
}: TypographicArrowProps) {
  const path = direction === "right" ? "M3 10H17M12 5L17 10L12 15" : "M5 15L15 5M8 5H15V12";

  return (
    <svg
      aria-hidden="true"
      className="typographic-arrow"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} />
    </svg>
  );
}
