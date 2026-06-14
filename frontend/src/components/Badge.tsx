type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'muted';

export default function Badge({ tone, label }: { tone: Tone; label: string }) {
  return <span className={`badge badge--${tone}`}>{label}</span>;
}
