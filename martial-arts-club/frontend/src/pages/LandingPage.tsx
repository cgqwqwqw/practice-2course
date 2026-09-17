import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-[18px]">
          <div className="flex items-center gap-3 font-display text-[22px] font-semibold">
            <span className="flex h-[34px] w-[34px] rotate-45 items-center justify-center border-[1.5px] border-vermilion text-base font-extrabold text-vermilion">
              <span className="-rotate-45">武</span>
            </span>
            <span>
              БУДОКАН
              <small className="block font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-sage">
                Клуб восточных единоборств
              </small>
            </span>
          </div>
          <div className="flex items-center gap-3.5">
            {isAuthenticated ? (
              <Link to="/schedule" className="btn btn-primary btn-sm">Личный кабинет</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Войти</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Записаться</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-paper/10 bg-[radial-gradient(ellipse_900px_500px_at_82%_10%,rgba(168,52,42,0.16),transparent_60%)]">
        <div className="mx-auto grid max-w-[1240px] items-center gap-14 px-8 pb-[70px] pt-[90px] md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="eyebrow">Приём в группы открыт</div>
            <h1 className="mb-6 font-display text-[clamp(40px,5vw,64px)] leading-[1.08]">
              Путь воина <em className="not-italic text-vermilion">начинается</em>
              <br />с первого шага на татами
            </h1>
            <p className="max-w-xl text-[17px] leading-7 text-paper/70">
              Каратэ, дзюдо, айкидо и кикбоксинг для детей и взрослых.
              Аттестованные тренеры, система поясов кю/дан и расписание,
              под которое подстраивается ваш день.
            </p>
            <div className="mt-9 flex flex-wrap gap-3.5">
              <Link to={isAuthenticated ? "/schedule" : "/register"} className="btn btn-primary">
                Записаться на пробное занятие
              </Link>
              <Link to={isAuthenticated ? "/plans" : "/login"} className="btn btn-ghost">Смотреть абонементы</Link>
            </div>
            <div className="mt-14 flex flex-wrap gap-9">
              {[["12", "лет на татами"], ["860+", "учеников в клубе"], ["24", "аттестованных тренера"], ["4", "дисциплины"]].map(([v, l]) => (
                <div key={l}>
                  <b className="block font-display text-3xl font-semibold">{v}</b>
                  <span className="text-xs tracking-wide text-paper/50">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Правый блок с локальным фото */}
          <div className="relative flex h-full min-h-[420px] max-h-[520px] w-full flex-col justify-end overflow-hidden rounded-md border border-paper/25">
            <img 
              src="/hero-image.jpg" 
              alt="Клуб восточных единоборств Будокан" 
              className="absolute inset-0 h-full w-full object-cover object-center" 
            />
            
            {/* Градиентный спуск для читаемости текста */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

            {/* Плашка с информацией об аттестации */}
            <div className="relative z-10 w-full border-t border-paper/25 bg-ink/90 p-[18px] font-mono text-xs backdrop-blur-sm">
              <b className="mb-1 block font-display text-base">Аттестация · ближайшая</b>
              Экзамен на пояса — следите за ведомостями в личном кабинете
              <div className="mt-3 flex h-3.5 overflow-hidden rounded-[1px] border border-paper/25">
                {["#fff", "#F2C744", "#F28B44", "#3A5B9A", "#4B7A4A", "#3A2A20"].map((c) => (
                  <span key={c} className="h-full flex-1" style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}