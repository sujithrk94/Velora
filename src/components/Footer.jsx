import React from 'react';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-neutral-100 border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <h3 className="text-lg font-bold tracking-tighter mb-4">VELORA</h3>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              Thoughtfully crafted pieces that balance comfort, function, and timeless style. Designed for everyday living.
            </p>

          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 VELORA. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
