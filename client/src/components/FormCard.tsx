type Item = {
  author?: string; // autheur de la proposition
  category?: string; // catégorie du perso
  name: string; // nom
  description: string; // description
  startDate?: number | null;
  endDate?: number | null;
};

type Props = {
  item: Item;
  onChange: (patch: Partial<Item>) => void;
  creator?: boolean;
};

const OBJECT_TYPES = [
  'artiste',
  'objet',
  'personnage historique',
  'personnage fictif',
  'animeaux',
  'jeu vidéo',
  'livre',
  'musique',
  'série',
  'autre',
];

export default function FormCard({ item, onChange, creator }: Props) {
  return (
    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm text-white font-medium mb-1">Nom</label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Nom de l’élément"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {creator !== true && (
        <div>
          <label className="block text-sm text-white font-medium mb-1">Catégorie</label>
          <select
            value={item.category}
            onChange={(e) => onChange({ category: e.target.value })}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {OBJECT_TYPES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="md:col-span-2">
        <label className="block text-sm text-white font-medium mb-1">Description</label>
        <textarea
          value={item.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          placeholder="Décris brièvement l’élément…"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {creator !== true && (
        <div>
          <label className="block text-sm text-white font-medium mb-1">Date</label>
          <input
            type="number"
            step="1"
            placeholder="1934"
            value={item.startDate ?? ''}
            onChange={(e) =>
              onChange({
                startDate: Number.isNaN(e.currentTarget.valueAsNumber)
                  ? null
                  : Math.trunc(e.currentTarget.valueAsNumber),
              })
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {creator !== true && (
        <div>
          <input
            type="number"
            step="1"
            placeholder="2014"
            value={item.endDate ?? ''}
            onChange={(e) =>
              onChange({
                endDate: Number.isNaN(e.currentTarget.valueAsNumber)
                  ? null
                  : Math.trunc(e.currentTarget.valueAsNumber),
              })
            }
            className="w-full rounded-lg border border-zinc-300 bg-white mt-6 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}
