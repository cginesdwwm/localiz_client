// Simple conteneur qui applique la classe de style focus-ring réutilisable
import "./Input.css";

export default function FocusRing({ children, className = "" }) {
  return <div className={`focus-ring ${className}`.trim()}>{children}</div>;
}
