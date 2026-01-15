
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">sports_esports</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">Game Hub</h1>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold text-primary">Home</Link>
              <Link to="/" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">Library</Link>
              <Link to="/" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">Leaderboard</Link>
            </nav>
          </div>
          
          <div className="flex-1 max-w-md hidden lg:block">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
              <input 
                className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm dark:text-white" 
                placeholder="Search for games..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDarkMode}
              className="size-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
            <button className="size-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="size-10 rounded-full border-2 border-primary overflow-hidden cursor-pointer">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/a/ACg8ocL8jF_w0J0QpE1vU3o_9U9w7V9Z_Yv_Yv_Yv_Yv_Yv_=s96-c" 
                alt="User Profile" 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="mt-20 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-background-dark py-12 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">sports_esports</span>
            </div>
            <span className="text-lg font-bold tracking-tight">Game Hub</span>
          </div>
          <div className="flex gap-8">
            <a className="text-sm text-gray-400 hover:text-primary transition-colors" href="#">About Us</a>
            <a className="text-sm text-gray-400 hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-gray-400 hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-sm text-gray-400 hover:text-primary transition-colors" href="#">Contact</a>
          </div>
          <div className="flex gap-4">
            <button className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all dark:text-gray-400">
              <span className="material-symbols-outlined text-lg">public</span>
            </button>
            <button className="size-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-all dark:text-gray-400">
              <span className="material-symbols-outlined text-lg">chat</span>
            </button>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 text-center text-xs text-gray-400">
          © 2024 Game Hub Portal. All rights reserved. Games are property of their respective owners.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
