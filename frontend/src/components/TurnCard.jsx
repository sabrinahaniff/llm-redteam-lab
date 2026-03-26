export default function TurnCard({ data, hasGuardrail }) {
  const blocked = hasGuardrail && data.blocked
  const jailbroken = !blocked && data.jailbroken

  const outcomeLabel = blocked ? 'BLOCKED' : jailbroken ? 'JAILBROKEN' : 'DEFENDED'
  const outcomeColor = blocked ? 'var(--amber)' : jailbroken ? 'var(--red)' : 'var(--green)'
  const outcomeBg = blocked ? 'rgba(255,176,32,0.1)' : jailbroken ? 'rgba(255,59,92,0.15)' : 'rgba(0,217,126,0.08)'
  const outcomeBorder = blocked ? 'rgba(255,176,32,0.2)' : jailbroken ? 'rgba(255,59,92,0.3)' : 'rgba(0,217,126,0.15)'

  const typeColors = {
    social_engineering: { bg: 'rgba(59,143,255,0.1)', color: 'var(--blue)', border: 'rgba(59,143,255,0.2)' },
    roleplay: { bg: 'rgba(255,176,32,0.1)', color: 'var(--amber)', border: 'rgba(255,176,32,0.2)' },
    authority: { bg: 'rgba(255,59,92,0.1)', color: 'var(--red)', border: 'rgba(255,59,92,0.2)' },
    gradual_escalation: { bg: 'rgba(192,132,252,0.1)', color: 'var(--purple)', border: 'rgba(192,132,252,0.2)' },
    distraction: { bg: 'rgba(90,100,114,0.12)', color: 'var(--muted)', border: 'rgba(255,255,255,0.07)' },
  }

  const tc = typeColors[data.type] || typeColors.distraction
  const scoreColor = data.score >= 7 ? 'var(--red)' : data.score >= 5 ? 'var(--amber)' : 'var(--green)'

  return (
    <div style={{borderBottom:'1px solid var(--border)',padding:'0.9rem 1.4rem',animation:'slideIn 0.25s ease'}}>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Meta row */}
      <div style={{display:'flex',alignItems:'center',gap:'0.6rem',marginBottom:'0.5rem',flexWrap:'wrap'}}>
        <span style={{fontSize:'0.62rem',color:'var(--muted)'}}>Turn {data.turn}</span>
        <span style={{fontSize:'0.6rem',padding:'2px 6px',borderRadius:'3px',textTransform:'uppercase',letterSpacing:'0.05em',fontWeight:500,background:tc.bg,color:tc.color,border:`1px solid ${tc.border}`}}>
          {data.type.replace('_',' ')}
        </span>
        <span style={{fontSize:'0.6rem',padding:'2px 7px',borderRadius:'3px',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.06em',marginLeft:'auto',background:outcomeBg,color:outcomeColor,border:`1px solid ${outcomeBorder}`}}>
          {outcomeLabel}
        </span>
      </div>

      {/* Attack prompt */}
      <div style={{fontSize:'0.7rem',color:'var(--muted)',lineHeight:1.5,marginBottom:'0.45rem',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
        {data.prompt}
      </div>

      {/* Guardrail score bar */}
      {hasGuardrail && (
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.45rem'}}>
          <span style={{fontSize:'0.6rem',color:scoreColor,minWidth:'44px'}}>Risk {data.score}/10</span>
          <div style={{flex:1,height:'2px',background:'var(--surface2)',borderRadius:'1px',overflow:'hidden'}}>
            <div style={{height:'100%',width:`${data.score*10}%`,background:scoreColor,borderRadius:'1px'}} />
          </div>
        </div>
      )}

      {/* Judge reason */}
      <div style={{fontSize:'0.67rem',lineHeight:1.4,padding:'0.45rem 0.7rem',background:'var(--surface)',borderRadius:'3px',borderLeft:`2px solid ${outcomeColor}`,color:outcomeColor}}>
        {data.reason}
      </div>
    </div>
  )
}