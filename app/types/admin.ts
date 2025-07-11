export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export type Gym = {
  id: number;
  name: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
  };
  created_by: string;
  updated_at: string;
  claimed_by: string;
};
