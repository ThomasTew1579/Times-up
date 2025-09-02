import { useMemo, useState } from 'react';
import FormCard from '../components/FormCard';
import Dropdown from '../components/Dropdown';

type Item = {
  author: string;
  category: string;
  name: string;
  description: string;
  startDate: number | null;
  endDate: number | null;
};

const subject: string = "Proposition d'ajout de personnage";
const isAdmin: boolean = false;

function buildMailto({ to = '', subject = '', body = '' }) {
  const enc = (s: string) => encodeURIComponent(s).replace(/%0A/g, '%0D%0A');
  const qs = `subject=${enc(subject)}&body=${enc(body)}`;
  return `mailto:${to}?${qs}`;
}

export default function CharacterJsonMailer() {
  const [author, setAuthor] = useState('');
  const [items, setItems] = useState<Item[]>([
    { author: '', category: 'artiste', name: '', description: '', startDate: 0, endDate: 0 },
  ]);
  const to: string = 'pasquet.thomas69+timesup-proposals@gmail.com';

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { author: '', category: 'artiste', name: '', description: '', startDate: 0, endDate: 0 },
    ]);

  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (i: number, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const payload = useMemo(() => {
    return JSON.stringify(
      {
        subject,
        author,
        createdAt: new Date().toISOString(),
        items: items.map((it) => ({
          cat: it.category ? it.category : '',
          nom: it.name.trim(),
          description: it.description.trim(),
          date:
            (it.startDate !== 0 ? String(it.startDate) : '') +
            (it.startDate !== 0 && it.endDate ? ' - ' + String(it.endDate) : ''),
        })),
      },
      null,
      2
    );
  }, [author, items]);

  const mailtoHref = useMemo(() => buildMailto({ to, subject, body: payload }), [to, payload]);
  const tooLong = mailtoHref.length > 1800;

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      alert('JSON copié dans le presse-papiers !');
    } catch {
      alert('Impossible de copier automatiquement. Sélectionne et copie manuellement.');
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 ">
      <h1 className="text-2xl font-semibold font-primary text-white text-center mb-4">
        Propose tes propres cartes à jouer !
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-1">Nom</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Votre nom ou pseudo"
        />
      </div>

      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 p-4 shadow-sm">
            {items.length !== 1 && (
              <div className="flex items-start justify-between">
                <h2 className="text-2xl text-white font-primary">Carte #{i + 1}</h2>
                <button
                  type="button"
                  className="btn-primary px-2 py-1"
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  title={items.length === 1 ? 'Au moins un élément requis' : 'Supprimer'}
                >
                  Supprimer
                </button>
              </div>
            )}

            <FormCard item={it} onChange={(patch) => updateItem(i, patch)} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={addItem}
          className="btn-primary"
        >
          + Ajouter un élément
        </button>
      </div>

      <div className="mt-6">
        {isAdmin && (
          <Dropdown title="Aperçu du JSON">
            {payload}
          </Dropdown>
        )}

        {tooLong && (
          <p className="mt-3 text-amber-700">
            ⚠️ Le mailto: risque d’être trop long pour certains clients. Utilise “Copier le JSON” si
            l’ouverture du client mail échoue.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <a href={mailtoHref} className="btn-primary">
            Envoyer !
          </a>
          <button
            type="button"
            onClick={copyJson}
            className="btn-primary"
          >
            Copier le JSON
          </button>
        </div>
      </div>
    </div>
  );
}
