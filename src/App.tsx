import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PoolOverview } from './pages/PoolOverview'
import { RewardCalculator } from './pages/RewardCalculator'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PoolOverview />} />
        <Route path="reward-calculator" element={<RewardCalculator />} />
      </Route>
    </Routes>
  )
}
