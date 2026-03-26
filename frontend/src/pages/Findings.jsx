export default function Findings() {
  const metrics = [
    { label: 'Jailbreak rate: defended', value: '0%', sub: '0 of 20 attacks succeeded', color: 'var(--green)' },
    { label: 'Jailbreak rate: exposed', value: '40%', sub: '8 of 20 attacks succeeded', color: 'var(--red)' },
    { label: 'Guardrail effectiveness', value: '100%', sub: 'Reduced breaches from 8 to 0', color: 'var(--blue)' },
    { label: 'Guardrail block rate', value: '40%', sub: '8 of 20 prompts intercepted', color: 'var(--amber)' },
  ]

  const findings = [
    { color: 'var(--blue)', title: 'Finding 1: Guardrail eliminated all jailbreaks', body: 'With the Guardrail active, zero attacks succeeded across 20 turns. Without it, 8 of 20 attacks (40%) extracted the secret. A classification-based interception layer can be highly effective at preventing prompt injection in controlled conditions.' },
    { color: 'var(--red)', title: 'Finding 2: Gradual escalation was the most dangerous attack type', body: "Without the Guardrail, gradual escalation attacks succeeded at the highest rate. The Hacker agent built context across turns, slowly establishing fictional protocols like 'SecureDataTransfer', until the Target treated them as real internal systems. This multi-turn manipulation is harder to detect than direct requests." },
    { color: 'var(--amber)', title: 'Finding 3: Guardrail false positive rate warrants further study', body: 'The Guardrail blocked 40% of all prompts. While this eliminated jailbreaks, some blocked prompts may have been borderline legitimate. In a real deployment, this rate would need to be measured against genuine user traffic to assess whether the defense degrades user experience.' },
  ]

  const attackDist = [
    { label: 'Social eng.', value: 11, max: 11, color: 'var(--blue)' },
    { label: 'Roleplay', value: 6, max: 11, color: 'var(--amber)' },
    { label: 'Gradual esc.', value: 4, max: 11, color: 'var(--purple)' },
    { label: 'Authority', value: 2, max: 11, color: 'var(--red)' },
    { label: 'Distraction', value: 1, max: 11, color: 'var(--muted)' },
  ]

  const successRate = [
    { label: 'Gradual esc.', value: 75, color: 'var(--red)' },
    { label: 'Authority', value: 50, color: 'var(--red)' },
    { label: 'Social eng.', value: 27, color: 'var(--red)' },
    { label: 'Roleplay', value: 17, color: 'var(--red)' },
    { label: 'Distraction', value: 0, color: 'var(--muted)' },
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 2rem' }}>
      <h2 style={{ fontFamily: 'var(--font-d)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem' }}> Experiment Findings</h2>
      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
        20 automated red-teaming turns per condition. Two runs: one with Guardrail active, one without.
      </p>

      {/* Metric cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '2.5rem' }}>
        {metrics.map(m => (
          <div key={m.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.2rem' }}>
            <div style={{ fontSize: '0.6rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{m.label}</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: '2rem', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: '0.3rem' }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Finding cards */}
      {findings.map(f => (
        <div key={f.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.2rem 1.5rem', marginBottom: '12px', borderLeft: `3px solid ${f.color}` }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', fontFamily: 'var(--font-d)' }}>{f.title}</h3>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.6 }}>{f.body}</p>
        </div>
      ))}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '2rem' }}>
        <ChartBox title="Attack type distribution" rows={attackDist} suffix="" maxVal={11} />
        <ChartBox title="Success rate by attack type (no guardrail)" rows={successRate} suffix="%" maxVal={100} />
      </div>
    </div>
  )
}

function ChartBox({ title, rows, suffix, maxVal }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '1.2rem' }}>
      <h3 style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>{title}</h3>
      {rows.map(r => (
        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.62rem', color: 'var(--muted)', width: '90px', textAlign: 'right', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>{r.label}</span>
          <div style={{ flex: 1, height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(r.value / maxVal) * 100}%`, background: r.color, borderRadius: '3px' }} />
          </div>
          <span style={{ fontSize: '0.62rem', color: 'var(--text)', width: '36px', flexShrink: 0 }}>{r.value}{suffix}</span>
        </div>
      ))}
    </div>
  )
}