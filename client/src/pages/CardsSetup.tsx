import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FormCard from '../components/FormCard';
import IntermissionCard from '../components/IntermissionCard';
import Dropdown from '../components/Dropdown';

type Item = {
  name: string;
  description: string;
};

type PlayerSubmission = {
  playerName: string;
  items: Array<{ name: string; description: string; date?: string }>;
};

type Container = {
  schemaVersion: 1;
  sessionId: string;
  submissions: PlayerSubmission[];
};

const CONTAINER_KEY = 'timesup:submissions';
const CARDS_PER_PLAYER = 2;

const makeContainer = (): Container => ({
  schemaVersion: 1,
  sessionId: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
  submissions: [],
});

const isNonEmpty = (s: string | undefined) => !!s && s.trim().length > 0;
const isItemValid = (it: Item) => isNonEmpty(it.name) && isNonEmpty(it.description);
const isAdmin: boolean = false;

function CardsSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [player, setJoueurs] = useState(4);
  const [currentPlayerIndex] = useState(0);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [shownCardsCreator, setShownCardsCreator] = useState(true);
  const [showIntermissionCreator, setShowIntermissionCreator] = useState(true);
  const [currentPlayerCreat, setCurrentPlayerCreat] = useState(currentPlayerIndex);
  const [items, setItems] = useState<Item[]>([{ name: '', description: '' }]);

  useEffect(() => {
    const p = Number(searchParams.get('teams'));
    if (!Number.isNaN(p) && p >= 2 && p <= 10) {
      setJoueurs(p);
    }
    const namesParam = searchParams.get('namesParam');
    if (namesParam) {
      const names = decodeURIComponent(namesParam)
        .split('|')
        .slice(0, Math.max(2, p || player));
      setPlayerNames(
        names.length
          ? names
          : Array.from({ length: Math.max(2, p || player) }, (_, i) => `Team ${i + 1}`)
      );
    } else {
      setPlayerNames(Array.from({ length: Math.max(2, p || player) }, (_, i) => `Team ${i + 1}`));
    }
  }, [searchParams, player]);

  const [container, setContainer] = useState<Container>(() => {
    try {
      const raw = localStorage.getItem(CONTAINER_KEY);
      return raw ? (JSON.parse(raw) as Container) : makeContainer();
    } catch {
      return makeContainer();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CONTAINER_KEY, JSON.stringify(container));
    } catch (e) {
      console.error('Erreur ', e);
    }
  }, [container]);

  const addItem = () => setItems((prev) => [...prev, { name: '', description: '' }]);

  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (i: number, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const currentSubmissionObj: PlayerSubmission = useMemo(() => {
    const playerName =
      playerNames[currentPlayerCreat % player] ?? `Équipe ${(currentPlayerCreat % player) + 1}`;

    const cleaned = items.map((it) => ({
      name: (it.name ?? '').trim(),
      description: (it.description ?? '').trim(),
    }));

    return { playerName, items: cleaned };
  }, [items, playerNames, currentPlayerCreat, player]);

  const allCardsValid = items.length >= CARDS_PER_PLAYER && items.every(isItemValid);

  function nextPlayerCreat() {
    setCurrentPlayerCreat((p) => p + 1);
    setShowIntermissionCreator(true);
    setShownCardsCreator(false);
  }

  function commitCurrentSubmission() {
    if (!allCardsValid) {
      alert('Chaque carte doit avoir un nom ET une description.');
      return;
    }
    const nextSubmissions = [...container.submissions, currentSubmissionObj];

    setContainer((prev) => ({
      ...prev,
      submissions: nextSubmissions,
    }));

    const everyoneDone =
      nextSubmissions.length >= player &&
      nextSubmissions.every(
        (s) =>
          s.items.length >= CARDS_PER_PLAYER &&
          s.items.every((c) => c.name.trim() && c.description.trim())
      );

    if (everyoneDone) {
      const duration = searchParams.get('duration');
      const players = searchParams.get('teams');
      const playerNames = searchParams.get('namesParam');
      navigate(
        `/game?gameType=custom&duration=${duration}&teams=${players}&namesParam=${playerNames}`
      );
      return;
    }

    setItems([{ name: '', description: '' }]);
    nextPlayerCreat();
  }

  function resetAllSubmissions() {
    if (confirm('Effacer toutes les propositions enregistrées ?')) {
      setContainer(makeContainer());
      setItems([{ name: '', description: '' }]);
      try {
        localStorage.removeItem(CONTAINER_KEY);
      } catch (e) {
        console.error('Erreur ', e);
      }
    }
  }

  const finalCards = useMemo(() => container.submissions.flatMap((s) => s.items), [container]);

  const finalJsonText = useMemo(() => JSON.stringify(finalCards, null, 2), [finalCards]);

  return (
    <div>
      {shownCardsCreator && (
        <div className=" flex items-center justify-center py-8 ">
          <div className="w-full rounded-lg max-h-dvh overflow-auto  ">
            <h1 className="text-3xl font-bold font-secondary text-center text-white mb-6">
              Mode custom - Création des cartes
            </h1>
            <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">
              {playerNames[currentPlayerCreat % player] ??
                `Équipe ${(currentPlayerCreat % player) + 1}`}
            </p>

            <div className="space-y-6">
              {items.map((it, i) => (
                <div key={i} className="rounded-2xl border border-zinc-200 p-4 shadow-sm">
                  {items.length !== 1 && (
                    <div className="flex items-start justify-between">
                      <h2 className="text-2xl text-white font-primary">Carte #{i + 1}</h2>
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="text-sm rounded-lg border px-2 py-1 text-white border-white"
                        disabled={items.length === 1}
                        title={items.length === 1 ? 'Au moins un élément requis' : 'Supprimer'}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}

                  <FormCard item={it} onChange={(patch) => updateItem(i, patch)} creator />
                </div>
              ))}
            </div>

            <div className="flex justify-between w-full">
              <div className="mt-4 flex gap-3">
                <button
                  disabled={items.length >= CARDS_PER_PLAYER}
                  type="button"
                  onClick={addItem}
                  className="rounded-xl border px-4 py-2  text-white border-white hover:bg-primary-500 disabled:text-gray-500 disabled:border-gray-500"
                >
                  + Ajouter un élément
                </button>
              </div>
              <div className="mt-4 flex gap-3 items-center">
                {!allCardsValid && (
                  <p className="text-sm text-amber-300">
                    Chaque carte doit avoir un <strong>nom</strong> et une{' '}
                    <strong>description</strong>.
                  </p>
                )}
                <button
                  disabled={!allCardsValid}
                  type="button"
                  onClick={commitCurrentSubmission}
                  className="rounded-xl border px-4 py-2  text-white border-white hover:bg-primary-500 disabled:text-gray-500 disabled:border-gray-500"
                >
                  Terminer
                </button>
              </div>
            </div>

            {isAdmin && (
              <Dropdown title="Aperçu du JSON">
                {finalJsonText}
              </Dropdown>
            )}

            {isAdmin && finalCards.length > 0 && (
              <div className="mt-6 flex gap-2">
                <button
                  className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  onClick={async () => {
                    await navigator.clipboard.writeText(finalJsonText);
                    alert('JSON final copié !');
                  }}
                >
                  Copier le JSON final
                </button>

                <button
                  className="rounded-md border border-rose-300 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                  onClick={resetAllSubmissions}
                >
                  Réinitialiser les propositions
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showIntermissionCreator && (
        <IntermissionCard>
          <h2 className="text-xl font-semibold mb-2">Équipe suivante</h2>
          <p className="mb-4 text-sm text-zinc-700 dark:text-zinc-300">
            {playerNames[currentPlayerCreat % player] ??
              `Équipe ${(currentPlayerCreat % player) + 1}`}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              className="rounded-md border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800"
              onClick={() => {
                setShownCardsCreator(true);
                setShowIntermissionCreator(false);
              }}
            >
              Démarrer le tour
            </button>
          </div>
        </IntermissionCard>
      )}
    </div>
  );
}

export default CardsSetup;
