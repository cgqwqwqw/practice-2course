import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-ink text-paper">
      <div className="font-display text-6xl text-vermilion">404</div>
      <p className="text-paper/60">Страница не найдена</p>
      <Link to="/" className="btn btn-primary btn-sm">На главную</Link>
    </div>
  );
}
