import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-50 border-b border-paper/10 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-[18px]">
          <Link to="/" className="flex items-center gap-3 font-display text-[22px] font-semibold">
            <span className="flex h-[34px] w-[34px] rotate-45 items-center justify-center border-[1.5px] border-vermilion text-base font-extrabold text-vermilion">
              <span className="-rotate-45">武</span>
            </span>
            <span>
              БУДОКАН
              <small className="block font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-sage">
                Клуб восточных единоборств
              </small>
            </span>
          </Link>
          <Link to="/" className="btn btn-ghost btn-sm">
            ← На сайт
          </Link>
        </div>
      </header>

      <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
        <div className="grid w-full max-w-[940px] overflow-hidden border border-paper/25 md:grid-cols-2">
          {/* Левая часть с формой */}
          <div className="bg-ink-soft p-11">{children}</div>

          {/* Правая часть */}
          <div className="hidden flex-col justify-between p-11 md:flex">
            <div>
              {/* Надпись сверху над изображением */}
              <div className="eyebrow mb-6">Личный кабинет</div>

              {/* Картинка без растягивания на весь фон */}
              <div className="overflow-hidden rounded-md border border-paper/15">
                <img
                  src="/auth-hero.jpg"
                  alt="Клуб восточных единоборств Будокан"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Текст снизу */}
            <div className="mt-6">
              <h3 className="mb-3.5 font-display text-2xl">
                Всё о вашем пути на татами — в одном месте
              </h3>
              <p className="text-sm leading-7 text-paper/70">
                Расписание, история аттестаций, оплата абонемента и связь с
                тренером без звонков и бумажных ведомостей.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}