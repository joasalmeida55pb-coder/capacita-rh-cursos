import { corSequencial, corTextoSobre, RAMPA_SEQUENCIAL } from "./cores";

interface Props {
  colunas: string[];
  linhas: { id: string; rotulo: string; valores: number[] }[];
  /** Índices de colunas destacadas (ex.: meses de alta temporada) */
  destaque?: number[];
  rotuloDestaque?: string;
}

/** Mapa de calor com rampa sequencial de um único matiz */
export function MapaCalor({ colunas, linhas, destaque = [], rotuloDestaque }: Props) {
  const todos = linhas.flatMap((l) => l.valores);
  const min = Math.min(...todos);
  const max = Math.max(...todos);

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-separate border-spacing-0.5 text-xs">
          <thead>
            <tr>
              <th className="w-40" />
              {colunas.map((c, i) => (
                <th key={c} className="pb-1 font-medium text-slate-500">
                  {c}
                  {destaque.includes(i) && <span className="mx-auto mt-0.5 block h-1 w-5 rounded-full bg-slate-400" aria-hidden />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.id}>
                <th scope="row" className="pr-2 text-left font-medium text-slate-700">
                  {linha.rotulo}
                </th>
                {linha.valores.map((v, i) => (
                  <td
                    key={colunas[i]}
                    title={`${linha.rotulo} · ${colunas[i]}: índice ${v}`}
                    className="h-9 rounded-md text-center tabular-nums transition hover:ring-2 hover:ring-slate-900"
                    style={{ backgroundColor: corSequencial(v, min, max), color: corTextoSobre(v, min, max) }}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          Menor
          <span className="flex">
            {RAMPA_SEQUENCIAL.map((c) => (
              <span key={c} className="h-2.5 w-5 first:rounded-l last:rounded-r" style={{ backgroundColor: c }} />
            ))}
          </span>
          Maior demanda
        </span>
        <span>Índice 100 = média anual</span>
        {rotuloDestaque && (
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-5 rounded-full bg-slate-400" aria-hidden /> {rotuloDestaque}
          </span>
        )}
      </div>
    </div>
  );
}
