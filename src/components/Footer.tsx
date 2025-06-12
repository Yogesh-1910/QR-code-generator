import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by Yogi</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Yogesh-1910"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:yogeshsiddalingaiah22@gmail.com"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
          
          <div className="text-sm text-gray-500">
            &copy; 2025 QR Generator Pro
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;