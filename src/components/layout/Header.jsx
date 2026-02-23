import { Menu, Bell } from 'lucide-react'

const Header = ({ title, openSidebar }) => {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button onClick={openSidebar} className="md:hidden">
          <Menu />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      
    </header>
  )
}

export default Header
