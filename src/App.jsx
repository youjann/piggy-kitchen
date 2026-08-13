import { Routes, Route } from 'react-router-dom'
import { DishProvider } from './context/DishContext'
import Home from './pages/Home'
import DishDetail from './pages/DishDetail'
import Recipe from './pages/Recipe'
import Cart from './pages/Cart'
import AddDish from './pages/AddDish'
import EditDish from './pages/EditDish'
import Profile from './pages/Profile'
import LikesStats from './pages/LikesStats'

export default function App() {
  return (
    <DishProvider>
      <div className="font-primary min-h-screen bg-[var(--color-bg-screen)] flex justify-center">
        <div className="w-full max-w-[375px] bg-[var(--color-bg-primary)] paper-grain relative min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dish/:id" element={<DishDetail />} />
            <Route path="/recipe/:id" element={<Recipe />} />
            <Route path="/edit-dish/:id" element={<EditDish />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/add-dish" element={<AddDish />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/likes-stats" element={<LikesStats />} />
          </Routes>
        </div>
      </div>
    </DishProvider>
  )
}
