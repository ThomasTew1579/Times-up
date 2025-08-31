export default function ClassicRules() {
  return (
    <section id="regles-timesup" className=" py-8 sm:py-12" aria-labelledby="titre-regles">
      <header className="mb-8 sm:mb-10">
        <h2 id="titre-regles" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          <span className="text-white font-primary">Règles du jeu - Version web</span>
        </h2>
        <p className="mt-2 text-sm text-white">
          Basé sur le principe original de Time’s Up! - adapté pour une utilisation web.
        </p>

        <nav className="mt-4 flex flex-wrap gap-2">
          <a
            href="#deroulement"
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Déroulement
          </a>
          <a
            href="#interdictions"
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Interdictions
          </a>
          <a
            href="#manche-1"
            className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200"
          >
            Manche 1
          </a>
          <a
            href="#manche-2"
            className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200"
          >
            Manche 2
          </a>
          <a
            href="#manche-3"
            className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-200"
          >
            Manche 3
          </a>
        </nav>
      </header>

      <div id="deroulement" className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-zinc-900">
            Déroulement d’une manche
          </h3>
          <p className="mt-2 text-zinc-700 leading-relaxed">
            La partie se déroule en <strong>3 manches</strong>. Chaque manche est constituée d’une
            succession de tours, de la durée du Timer. Les équipes jouent leur tour en alternance en
            passant le téléphone jusqu’à ce que toutes les cartes soient devinées. À chaque nouveau
            tour, <strong>alternez la personne qui fait deviner</strong> au sein de votre équipe.
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <section>
            <h4 className="text-sm font-semibold text-zinc-900">À votre tour</h4>
            <ol className="mt-3 space-y-3">
              <li className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-content-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  1
                </span>
                <span className="text-zinc-800">Lancez le tour.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-content-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  2
                </span>
                <span className="text-zinc-800">
                  Faites-la deviner en suivant les règles de la{' '}
                  <a className="text-blue-700 underline-offset-2 hover:underline" href="#manches">
                    manche en cours
                  </a>
                  .{' '}
                  <span className="text-xs">
                    (vous pouvez cacher la carte en cours en clickant dessus)
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-content-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  3
                </span>
                <span className="text-zinc-800">
                  Chaque carte devinée vous offre, puis validez pour passer à la suivante.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-content-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  4
                </span>
                <span className="text-zinc-800">
                  Les cartes <strong>passées ou ratées</strong> (mauvaise proposition / erreur de
                  règle) sont remisent dans la pile aléatoirement.
                </span>
              </li>
            </ol>

            <p className="mt-4 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-3 text-amber-900 italic">
              À la fin du timer, l’équipe adverse crie{' '}
              <span className="not-italic font-semibold">«&nbsp;Time’s Up!&nbsp;»</span>.
            </p>
          </section>

          <section>
            <h4 className="text-sm font-semibold text-zinc-900">Fin de manche</h4>
            <p className="mt-2 text-zinc-800 leading-relaxed">
              Le nombre de cartes gagnées par chaque équipe constitue leur{' '}
              <strong>score de manche</strong>&nbsp;: il est inscrit dans le tableau des scores en
              bas de l'écran.
            </p>
          </section>
        </div>
      </div>

      <div
        id="interdictions"
        className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-6 shadow-sm"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-rose-900">
          Durant toute la partie, vous ne pouvez jamais&nbsp;:
        </h3>
        <ul className="mt-3 space-y-2">
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
              ✕
            </span>
            <span className="text-rose-900">Prononcer les mots écrits sur la carte.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
              ✕
            </span>
            <span className="text-rose-900">Les épeler.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
              ✕
            </span>
            <span className="text-rose-900">Les traduire dans une autre langue.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
              ✕
            </span>
            <span className="text-rose-900">
              Prononcer un homophone ou un mot de la même famille.
            </span>
          </li>
        </ul>
      </div>

      <div id="manches" className="mt-8 space-y-6">
        <article
          id="manche-1"
          className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm"
          aria-labelledby="titre-m1"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              Manche 1
            </span>
            <h4 id="titre-m1" className="text-lg font-semibold text-zinc-900">
              Décrivez
            </h4>
          </div>
          <ul className="mt-2 space-y-2 text-zinc-800">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600"></span>
              <span>Dites ce que vous voulez pour faire deviner la carte.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600"></span>
              <span>Votre équipe peut faire autant de propositions qu’elle le souhaite.</span>
            </li>
            <li className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
              <strong className="font-semibold">Interdit&nbsp;:</strong> passer la carte&nbsp;;
              mimer, fredonner ou faire des bruitages.
            </li>
          </ul>
        </article>

        <article
          id="manche-2"
          className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm"
          aria-labelledby="titre-m2"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              Manche 2
            </span>
            <h4 id="titre-m2" className="text-lg font-semibold text-zinc-900">
              Dites un seul mot
            </h4>
          </div>
          <ul className="mt-2 space-y-2 text-zinc-800">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600"></span>
              <span>
                Vous ne pouvez dire <strong>qu’un seul mot</strong> pour faire deviner la carte.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600"></span>
              <span>
                Votre équipe ne peut faire <strong>qu’une seule proposition</strong> par carte (sans
                se concerter). Seule la première proposition compte.
              </span>
            </li>
            <li className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
              <strong className="font-semibold">Autorisé&nbsp;:</strong> passer la carte.
            </li>
            <li className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-900">
              <strong className="font-semibold">Interdit&nbsp;:</strong> mimer, fredonner ou faire
              des bruitages.
            </li>
          </ul>
        </article>

        <article
          id="manche-3"
          className="rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-sm"
          aria-labelledby="titre-m3"
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
              Manche 3
            </span>
            <h4 id="titre-m3" className="text-lg font-semibold text-zinc-900">
              Mimez
            </h4>
          </div>
          <ul className="mt-2 space-y-2 text-zinc-800">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600"></span>
              <span>Faites des mimes pour faire deviner la carte.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-600"></span>
              <span>
                Votre équipe ne peut faire <strong>qu’une seule proposition</strong> par carte (sans
                se concerter). Seule la première proposition compte.
              </span>
            </li>
            <li className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
              <strong className="font-semibold">Autorisé&nbsp;:</strong> passer la carte&nbsp;;
              fredonner et faire des bruitages.
            </li>
            <li className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-900">
              <strong className="font-semibold">Interdit&nbsp;:</strong> parler.
            </li>
          </ul>
        </article>
      </div>
    </section>
  );
}
