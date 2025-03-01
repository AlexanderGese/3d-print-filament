export interface FilamentItem {
      id: string;
      filament: string;
      type: string;
      weight: number;
      price: number;
      link: string;
      name: string;
      color: string;
    }

    export interface Store {
      name: string;
      description: string;
      link: string;
    }

    export interface PreconfigFilament {
      id: string;
      filament: string;
      type: string;
      weight: number;
      price: number;
      link: string;
      description: string;
      color: string;
    }

    export type TabType = 'cart' | 'ordered' | 'instock' | 'german-stores' | 'preconfig';
