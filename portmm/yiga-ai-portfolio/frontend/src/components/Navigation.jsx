import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Logo from '../assets/logo/c4751d7d-39ff-4416-8d0e-35e6b71b69ae.svg';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1>
          <img src={Logo} alt="Yiga Junior — AI Engineer" className="h-14 sm:h-16 w-auto max-w-[65vw] object-contain" />
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          <a href="#chat" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
            Ask My Agent About Me
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 p-4 space-y-3">
          <a href="#chat" className="block bg-emerald-600 text-white px-6 py-2 rounded-lg text-center">Ask Agent About Me</a>
        </div>
      )}
    </header>
  );
}
