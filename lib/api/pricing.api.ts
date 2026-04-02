import axiosInstance from '@/lib/axios';
import { Plan } from '@/app/types/pricing';
import { AxiosError } from 'axios';

export class APIError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const response = await axiosInstance.get<Plan[]>('/payments/plans/');
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new APIError(
        error.response?.status || 500,
        error.response?.data?.message || 'Failed to fetch plans'
      );
    }
    throw new Error('Failed to fetch data from API');
  }
}
