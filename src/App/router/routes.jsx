import { Route, Routes as RouterRoutes } from 'react-router-dom'

import TestingPage from '../../testing'


export default function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<TestingPage/>} />
    </RouterRoutes>
  )
}