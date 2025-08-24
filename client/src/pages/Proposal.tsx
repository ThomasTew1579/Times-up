import { useMemo, useState } from "react";

type Item = {
  author: string;        // autheur de la proposition
  category: string;        // catégorie du perso
  name: string;        // nom
  description: string; // description
  startDate: string;   // date début
  endDate: string;     // date fin
};

const OBJECT_TYPES = [
  "artiste",
  "objet",
  "personnage historique",
  "personnage fictif",
  "animeaux",
  "jeu vidéo",
  "livre",
  "musique",
  "série",
  "autre"
];

const subject: string = "Proposition d'ajout de personnage"
const isAdmin: boolean = false;



function buildMailto({ to = "", subject = "", body = "" }) {
    const enc = (s: string) => encodeURIComponent(s).replace(/%0A/g, "%0D%0A");
    const qs = `subject=${enc(subject)}&body=${enc(body)}`;
    return `mailto:${to}?${qs}`;
  }

export default function CharacterJsonMailer() {
  const [author, setAuthor] = useState("");
  const [items, setItems] = useState<Item[]>([
    { author: "", category: "artiste", name: "", description: "", startDate: "", endDate: "" },
  ]);
  const to: string = "pasquet.thomas69+timesup-proposals@gmail.com"; 


  const addItem = () =>
    setItems((prev) => [...prev, { author: "", category: "artiste", name: "", description: "", startDate: "", endDate: "" }]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = <K extends keyof Item>(index: number, key: K, value: Item[K]) =>
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [key]: value } : it)));

  const payload = useMemo(() => {
    return JSON.stringify(
      {
        subject,
        author,
        createdAt: new Date().toISOString(),
        items: items.map((it) => ({
          cat: it.category ? it.category : "",
          nom: it.name.trim(),
          description: it.description.trim(),
          date: (it.startDate ? it.startDate : "") + (it.startDate && it.endDate ?  " - " + it.endDate : "") ,
        })),
      },
      null,
      2
    );
  }, [author, items]);

  const mailtoHref = useMemo(
    () => buildMailto({ to, subject, body: payload }), 
    [to, subject, payload]
  );
  const tooLong = mailtoHref.length > 1800;

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(payload);
      alert("JSON copié dans le presse-papiers !");
    } catch {
      alert("Impossible de copier automatiquement. Sélectionne et copie manuellement.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 ">
      <h1 className="text-2xl font-semibold font-secondary text-white text-center mb-4">Propose tes propres cartes à jouer !</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-white mb-1">Nom</label>
        <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Votre nom ou pseudo"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>

      <div className="space-y-6">
        {items.map((it, i) => (
          <div key={i} className="rounded-2xl border border-zinc-200 p-4 shadow-sm">
              {
                  items.length !== 1 && ( 
                      <div className="flex items-start justify-between">
                <h2 className="text-2xl text-white font-primary">Carte #{i + 1}</h2>
                <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="text-sm rounded-lg border px-2 py-1 text-white border-white"
                        disabled={items.length === 1}
                        title={items.length === 1 ? "Au moins un élément requis" : "Supprimer"}
                    >
                    Supprimer
              </button>
            </div>
                )
              }
            

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm text-white font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={it.name}
                  onChange={(e) => updateItem(i, "name", e.target.value)}
                  placeholder="Nom de l’élément"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-white font-medium mb-1">Catégorie</label>
                <select
                  value={it.category}
                  onChange={(e) => updateItem(i, "category", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {OBJECT_TYPES.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-white font-medium mb-1">Description</label>
                <textarea
                  value={it.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  rows={3}
                  placeholder="Décris brièvement l’élément…"
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-white font-medium mb-1">Date</label>
                <input
                  type="number"
                  step="any" 
                  placeholder="1934"
                  value={it.startDate}
                  onChange={(e) => updateItem(i, "startDate", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  step="1" 
                  placeholder="2014"
                  value={it.endDate}
                  onChange={(e) => updateItem(i, "endDate", e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white mt-6 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={addItem}
          className="rounded-xl border px-4 py-2  text-white border-white hover:bg-primary-500"
        >
          + Ajouter un élément
        </button>
      </div>

      <div className="mt-6">
        {isAdmin && (
            <details className="rounded-2xl border border-zinc-200 p-4">
            <summary className="cursor-pointer  text-white select-none font-medium">Aperçu du JSON</summary>
            <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-zinc-50 p-3 text-sm">
                {payload}
            </pre>
            </details>
        )}

        {tooLong && (
          <p className="mt-3 text-amber-700">
            ⚠️ Le mailto: risque d’être trop long pour certains clients. Utilise “Copier le JSON” si l’ouverture du client mail échoue.
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={mailtoHref}
            className="rounded-xl text-white border px-4 py-2 hover:bg-zinc-50"
          >
            Envoyer !
          </a>
          <button
            type="button"
            onClick={copyJson}
            className="rounded-xl text-white border px-4 py-2 hover:bg-zinc-50"
          >
            Copier le JSON
          </button>
        </div>
      </div>
    </div>
  );
}
