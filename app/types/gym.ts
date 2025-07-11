export type Gym = {
    id: string | number;
    name: string;
    address: {
      city?: string;
      state?: string;
      zip?: string;
      line1?: string;
      line2?: string;
    };
  };