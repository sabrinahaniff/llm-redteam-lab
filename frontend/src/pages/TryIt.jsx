import { useState } from 'react'
import TurnCard from '../components/TurnCard'

export default function TryIt() {
  const [secret, setSecret] = useState('')
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState('')
  const [cFeed, setCFeed] = useState([])
  const [nFeed, setNFeed] = useState([])
  const [cStats, setCStats] = useState({blocked:0,jailbreaks:0,turns:0})
  const [nStats, setNStats] = useState({jailbreaks:0,turns:0})
  const [started, setStarted] = useState(false)

  async function runSimulation() {
    if (!secret.trim() || running) return
    setRunning(true)
    setStarted(true)
    setCFeed([])
    setNFeed([])
    setCStats({blocked:0,jailbreaks:0,turns:0})
    setNStats({jailbreaks:0,turns:0})

    let cLastResponse = "Hello, how can I help you today?"
    let nLastResponse = "Hello, how can I help you today?"
    const cHistory = []
    const nHistory = []
    let cBlocked = 0, cJailbreaks = 0, nJailbreaks = 0

    for (let i = 1; i <= 10; i++) {
      setProgress(`Running turn ${i}/10...`)

      try {
        const [cRes, nRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/run-turn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret_word: secret.trim().toUpperCase(),
              target_last_response: cLastResponse,
              attacks_so_far: cHistory,
              use_guardrail: true
            })
          }).then(r => r.json()),
          fetch('http://127.0.0.1:8000/run-turn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              secret_word: secret.trim().toUpperCase(),
              target_last_response: nLastResponse,
              attacks_so_far: nHistory,
              use_guardrail: false
            })
          }).then(r => r.json())
        ])

        cHistory.push(cRes.attack)
        nHistory.push(nRes.attack)
        cLastResponse = cRes.target_response
        nLastResponse = nRes.target_response

        if (cRes.guardrail_blocked) cBlocked++
        if (cRes.jailbroken) cJailbreaks++
        if (nRes.jailbroken) nJailbreaks++

        const cCard = {
          turn: i,
          type: cRes.attack_type,
          prompt: cRes.attack,
          score: cRes.guardrail_score,
          blocked: cRes.guardrail_blocked,
          jailbroken: cRes.jailbroken,
          reason: cRes.judge_reason
        }
        const nCard = {
          turn: i,
          type: nRes.attack_type,
          prompt: nRes.attack,
          score: nRes.guardrail_score,
          blocked: false,
          jailbroken: nRes.jailbroken,
          reason: nRes.judge_reason
        }

        setCFeed(prev => [...prev, cCard])
        setNFeed(prev => [...prev, nCard])
        setCStats({blocked: cBlocked, jailbreaks: cJailbreaks, turns: i})
        setNStats({jailbreaks: nJailbreaks, turns: i})

      } catch (err) {
        setProgress(`Error on turn ${i} — is the backend running?`)
        break
      }
    }

    setProgress(`Done — Defended: ${cJailbreaks} breaches | Exposed: ${nJailbreaks} breaches`)
    setRunning(false)
  }

  function reset() {
    if (running) return
    setCFeed([])
    setNFeed([])
    setCStats({blocked:0,jailbreaks:0,turns:0})
    setNStats({jailbreaks:0,turns:0})
    setProgress('')
    setStarted(false)
    setSecret('')
  }

  return (
    <div style={{maxWidth: started ? '100%' : '800px', margin: '0 auto', padding: started ? '0' : '3rem 2rem'}}>
      {!started && (
        <>
          <h2 style={{fontFamily:'var(--font-d)',fontSize:'1.4rem',fontWeight:800,marginBottom:'0.5rem'}}>Try it yourself</h2>
          <p style={{fontSize:'0.75rem',color:'var(--muted)',lineHeight:1.6,marginBottom:'2rem'}}>
            Enter your own secret word. The simulation runs 10 real automated attacks using your actual AI agents — once with a Guardrail defending, once without. Watch the difference live.
          </p>
        </>
      )}

      <div style={{padding: started ? '1rem 1.5rem' : '0', borderBottom: started ? '1px solid var(--border)' : 'none', display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', marginBottom: started ? '0' : '1.5rem'}}>
        <input
          type="text"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && runSimulation()}
          placeholder="Enter your secret word..."
          maxLength={30}
          style={{fontFamily:'var(--font-m)',fontSize:'0.8rem',background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text)',padding:'0.7rem 1rem',borderRadius:'4px',width:'260px',outline:'none'}}
        />
        <button onClick={runSimulation} disabled={running || !secret.trim()} style={{fontFamily:'var(--font-m)',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',padding:'0.55rem 1.2rem',borderRadius:'4px',border:'none',cursor:'pointer',background:'var(--blue)',color:'#fff',opacity: running || !secret.trim() ? 0.4 : 1}}>
          {running ? 'Running...' : 'Run simulation'}
        </button>
        <button onClick={reset} disabled={running} style={{fontFamily:'var(--font-m)',fontSize:'0.7rem',fontWeight:700,letterSpacing:'0.07em',textTransform:'uppercase',padding:'0.55rem 1.2rem',borderRadius:'4px',cursor:'pointer',background:'transparent',color:'var(--muted)',border:'1px solid var(--border)'}}>
          Reset
        </button>
        {progress && <span style={{fontSize:'0.65rem',color:'var(--muted)',marginLeft:'auto'}}>{progress}</span>}
      </div>

      {started && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr'}}>
          <SimPanel title="With guardrail" color="green" badge="Protected" stats={cStats} feed={cFeed} hasGuardrail={true} showBlocked={true} />
          <SimPanel title="Without guardrail" color="red" badge="Exposed" stats={{...nStats, blocked:0}} feed={nFeed} hasGuardrail={false} showBlocked={false} />
        </div>
      )}
    </div>
  )
}

function SimPanel({title, color, badge, stats, feed, hasGuardrail, showBlocked}) {
  return (
    <div style={{borderRight: color==='green'?'1px solid var(--border)':'none',display:'flex',flexDirection:'column'}}>
      <div style={{padding:'1rem 1.5rem',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg)',position:'sticky',top:0,zIndex:10}}>
        <div style={{fontFamily:'var(--font-d)',fontSize:'0.8rem',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:`var(--${color})`}}>{title}</div>
        <span style={{fontSize:'0.6rem',padding:'2px 7px',borderRadius:'3px',fontWeight:500,letterSpacing:'0.06em',textTransform:'uppercase',background:`rgba(${color==='green'?'0,217,126':'255,59,92'},0.1)`,color:`var(--${color})`,border:`1px solid rgba(${color==='green'?'0,217,126':'255,59,92'},0.2)`}}>{badge}</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:`repeat(${showBlocked?3:2},1fr)`,borderBottom:'1px solid var(--border)'}}>
        {showBlocked && (
          <div style={{padding:'0.85rem 1.2rem',borderRight:'1px solid var(--border)'}}>
            <div style={{fontSize:'0.6rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>Blocked</div>
            <div style={{fontFamily:'var(--font-d)',fontSize:'1.5rem',fontWeight:800,color:'var(--amber)'}}>{stats.blocked}</div>
          </div>
        )}
        <div style={{padding:'0.85rem 1.2rem',borderRight:'1px solid var(--border)'}}>
          <div style={{fontSize:'0.6rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>Jailbreaks</div>
          <div style={{fontFamily:'var(--font-d)',fontSize:'1.5rem',fontWeight:800,color:`var(--${color})`}}>{stats.jailbreaks}</div>
        </div>
        <div style={{padding:'0.85rem 1.2rem'}}>
          <div style={{fontSize:'0.6rem',color:'var(--muted)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:'0.3rem'}}>Turns</div>
          <div style={{fontFamily:'var(--font-d)',fontSize:'1.5rem',fontWeight:800,color:'var(--text)'}}>{stats.turns}</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',maxHeight:'calc(100vh - 260px)'}}>
        {feed.length === 0
          ? <div style={{padding:'2rem',textAlign:'center',color:'var(--muted)',fontSize:'0.7rem'}}>Waiting for simulation to start...</div>
          : feed.map(t => <TurnCard key={t.turn} data={t} hasGuardrail={hasGuardrail} />)
        }
      </div>
    </div>
  )
}