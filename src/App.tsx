import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { ProgressProvider } from './context/ProgressContext'
import { Home } from './pages/Home'
import { Basics } from './pages/Basics'
import { Reference } from './pages/Reference'
import { CheatSheet } from './pages/CheatSheet'
import { WarRoom } from './pages/WarRoom'
import { Guide01 } from './pages/guide/Guide01'
import { Guide02 } from './pages/guide/Guide02'
import { Guide03 } from './pages/guide/Guide03'
import { Guide04 } from './pages/guide/Guide04'
import { Guide05 } from './pages/guide/Guide05'
import { Guide06 } from './pages/guide/Guide06'
import { Guide07 } from './pages/guide/Guide07'
import { Lesson01 } from './pages/lessons/Lesson01'
import { Lesson02 } from './pages/lessons/Lesson02'
import { Lesson03 } from './pages/lessons/Lesson03'
import { Lesson04 } from './pages/lessons/Lesson04'
import { Lesson05 } from './pages/lessons/Lesson05'
import { Lesson06 } from './pages/lessons/Lesson06'
import { Lesson07 } from './pages/lessons/Lesson07'
import { Lesson08 } from './pages/lessons/Lesson08'
import { Lesson09 } from './pages/lessons/Lesson09'
import { ArHome } from './pages/ar/ArHome'
import { ArBasics } from './pages/ar/ArBasics'
import { ArStage } from './pages/ar/ArStage'
import { ArCheatSheet } from './pages/ar/ArCheatSheet'
import { ArWarRoom } from './pages/ar/ArWarRoom'
import { ArReference } from './pages/ar/ArReference'

export default function App() {
  return (
    <HashRouter>
      <ProgressProvider>
        <Shell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/basics" element={<Basics />} />
            <Route path="/reference" element={<Reference />} />
            <Route path="/cheatsheet" element={<CheatSheet />} />
            <Route path="/guide" element={<Navigate to="/guide/1" replace />} />
            <Route path="/guide/1" element={<Guide01 />} />
            <Route path="/guide/2" element={<Guide02 />} />
            <Route path="/guide/3" element={<Guide03 />} />
            <Route path="/guide/4" element={<Guide04 />} />
            <Route path="/guide/5" element={<Guide05 />} />
            <Route path="/guide/6" element={<Guide06 />} />
            <Route path="/guide/7" element={<Guide07 />} />
            <Route path="/lessons" element={<Navigate to="/lessons/1" replace />} />
            <Route path="/lessons/1" element={<Lesson01 />} />
            <Route path="/lessons/2" element={<Lesson02 />} />
            <Route path="/lessons/3" element={<Lesson03 />} />
            <Route path="/lessons/4" element={<Lesson04 />} />
            <Route path="/lessons/5" element={<Lesson05 />} />
            <Route path="/lessons/6" element={<Lesson06 />} />
            <Route path="/lessons/7" element={<Lesson07 />} />
            <Route path="/lessons/8" element={<Lesson08 />} />
            <Route path="/lessons/9" element={<Lesson09 />} />
            <Route path="/war-room" element={<WarRoom />} />
            <Route path="/ar" element={<ArHome />} />
            <Route path="/ar/basics" element={<ArBasics />} />
            <Route path="/ar/cheatsheet" element={<ArCheatSheet />} />
            <Route path="/ar/war-room" element={<ArWarRoom />} />
            <Route path="/ar/reference" element={<ArReference />} />
            <Route path="/ar/stage" element={<Navigate to="/ar/stage/1" replace />} />
            <Route path="/ar/stage/:id" element={<ArStage />} />
            <Route path="/ar/*" element={<Navigate to="/ar" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </ProgressProvider>
    </HashRouter>
  )
}
