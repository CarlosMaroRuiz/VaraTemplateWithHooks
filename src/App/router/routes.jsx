import { Route, Routes as RouterRoutes } from 'react-router-dom'
import HomePage from '../../home'



export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage/>} />

    </RouterRoutes>
  )
}