export type Series = {
  _id: string;
  name: string;
  thumbnail1: string; // landscape card / hero image
  thumbnail2: string; // series page backdrop
  logo?: string;
  genre: string[];
  description?: string;
  rating?: { $numberDecimal: string } | number | string;
};

export type Episode = {
  _id?: string;
  title?: string;
  description?: string;
  duration?: string;
  thumbnail?: string;
  thumbnail1?: string;
  path: string;
  releaseDate?: string;
};

export type Season = {
  _id?: string;
  seasonNumber: number;
  episodes: Episode[];
};
