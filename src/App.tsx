import { useEffect } from 'react'
import { useGameStore } from './state/useGameStore'
import { SaveList } from './components/SaveList'
import { Dashboard } from './components/Dashboard'

function App() {
  const refreshSaves = useGameStore((s) => s.refreshSaves)
  const activeBundle = useGameStore((s) => s.activeBundle)

  useEffect(() => {
    refreshSaves()
  }, [refreshSaves])

  return (
    <div className="min-h-svh bg-[var(--color-background)]">
      {activeBundle ? <Dashboard /> : <SaveList />}
    </div>
  )
}

export default App
