import { useState } from 'react'
import './App.css'
import RealData from './pages/RealData'
import TryIt from './pages/TryIt'
import Findings from './pages/Findings'

export default function App() {
  const [page, setPage] = useState('realdata')

  return (
    <div>
      <nav style={{
        padding: '1.2rem 2rem',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ fontFamily: 'var(--font-d)', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          LLM<span style={{ color: 'var(--red)' }}>RedTeam</span>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {[['realdata','Real data'],['tryit','Try it yourself'],['findings','Findings']].map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)} style={{
              fontFamily: 'var(--font-m)',
              fontSize: '0.68rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '0.45rem 1rem',
              border: '1px solid',
              borderColor: page === id ? 'var(--border)' : 'transparent',
              borderRadius: '4px',
              cursor: 'pointer',
              background: page === id ? 'var(--surface2)' : 'none',
              color: page === id ? 'var(--text)' : 'var(--muted)',
            }}>
              {label}
            </button>
          ))}
        </div>
      </nav>
      {page === 'realdata' && <RealData />}
      {page === 'tryit' && <TryIt />}
      {page === 'findings' && <Findings />}
    </div>
  )
}