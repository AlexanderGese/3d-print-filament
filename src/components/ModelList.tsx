import React, { useState, useMemo } from 'react';
    import { Search } from 'lucide-react';

    interface Model {
      id: string;
      title: string;
      source: string;
      link: string;
      imageUrl: string;
    }

    export function ModelList() {
      const [searchQuery, setSearchQuery] = useState('');
      const dummyModels: Model[] = useMemo(() => [
        {
          id: '1',
          title: 'Low Poly Pikachu',
          source: 'Thingiverse',
          link: 'https://www.thingiverse.com/thing:4797817',
          imageUrl: 'https://cdn.thingiverse.com/assets/9a/2a/9a/9a/9a/featured_preview_pikachu_low_poly_2.jpg'
        },
        {
          id: '2',
          title: 'Flexi Rex',
          source: 'Printables',
          link: 'https://www.printables.com/model/1944-flexi-rex',
          imageUrl: 'https://files.printables.com/media/prints/1944/images/10279_display_large.jpg'
        },
        {
          id: '3',
          title: 'Articulated Slug',
          source: 'Makerworld',
          link: 'https://makerworld.com/en/models/37443',
          imageUrl: 'https://cdn.makerworld.com/uploads/model/cover/37443/cover.webp'
        },
        {
          id: '4',
          title: 'Low Poly Bulbasaur',
          source: 'Thingiverse',
          link: 'https://www.thingiverse.com/thing:4797817',
          imageUrl: 'https://cdn.thingiverse.com/assets/9a/2a/9a/9a/9a/featured_preview_pikachu_low_poly_2.jpg'
        },
        {
          id: '5',
          title: 'Flexi Dragon',
          source: 'Printables',
          link: 'https://www.printables.com/model/1944-flexi-rex',
          imageUrl: 'https://files.printables.com/media/prints/1944/images/10279_display_large.jpg'
        },
        {
          id: '6',
          title: 'Articulated Octopus',
          source: 'Makerworld',
          link: 'https://makerworld.com/en/models/37443',
          imageUrl: 'https://cdn.makerworld.com/uploads/model/cover/37443/cover.webp'
        }
      ], []);

      const filteredModels = useMemo(() => {
        return dummyModels.filter(model =>
          Object.values(model).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }, [dummyModels, searchQuery]);

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
      };

      return (
        <div>
          <div className="relative flex-1 mb-4">
            <input
              type="text"
              placeholder="Search 3D models..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/20 rounded-lg 
                        text-gray-200 focus:outline-none focus:border-purple-500"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <div key={model.id} className="p-4 rounded-lg bg-black/10 hover:bg-black/20 backdrop-blur-lg border border-purple-500/10 hover:border-purple-500/20 transition-all duration-300">
                <img src={model.imageUrl} alt={model.title} className="w-full h-auto rounded-md mb-2" />
                <h3 className="text-lg text-purple-400 mb-1 neon-text">{model.title}</h3>
                <p className="text-gray-300 text-sm mb-2">Source: {model.source}</p>
                <a href={model.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                  View Model →
                </a>
              </div>
            ))}
          </div>
        </div>
      );
    }
