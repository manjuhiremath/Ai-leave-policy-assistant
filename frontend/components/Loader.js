export default function Loader({ label = "Loading..." }) {
  return (
    <div className="footer" role="status" aria-live="polite">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
    