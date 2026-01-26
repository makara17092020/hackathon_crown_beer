export type Brewery = {
  _id: string;
  name: string;
  description: string;
  location: string;
  logoUrl: string;
};

export type Vote = {
  _id: string;
  userEmail?: string;
  productId: string;
  beerName?: string;
  brewery: string;
  rating: number;
  votedAt?: string;
};
