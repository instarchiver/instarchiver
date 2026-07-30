export interface GridColumns {
  className: string;
  counts: { base: number; sm?: number; md?: number; lg?: number; xl?: number };
}

export const COLUMNS_2_3_4_5: GridColumns = {
  className: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  counts: { base: 2, sm: 3, md: 4, lg: 5 },
};

export const COLUMNS_2_3_4: GridColumns = {
  className: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  counts: { base: 2, sm: 3, md: 4 },
};

export const COLUMNS_3_4_5: GridColumns = {
  className: "grid-cols-3 sm:grid-cols-4 md:grid-cols-5",
  counts: { base: 3, sm: 4, md: 5 },
};
