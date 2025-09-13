// Simple wrapper that adds the reusable focus-ring scope class
export default function FocusRing({ children, className = "" }) {
  return <div className={`focus-ring ${className}`.trim()}>{children}</div>;
}
