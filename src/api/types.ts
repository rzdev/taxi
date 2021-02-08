export interface IGetTaxiAvailabilityParams {
  date_time: Date;
}

export interface IGetTaxiAvailabilityResponse {
  type: string,
  crs: {
    type: string,
    properties: {
      href: string,
      type: string,
    }
  },
  features: [
    {
      type: string,
      geometry: {
        type: string,
        coordinates: [number, number][];
      }
    },
    {
      properties: {
        timestamp: string,
        taxi_count: number
      }
    }
  ]
};
