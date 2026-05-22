export interface ApiDonut {
  key: string;
  label: string;
  percentage: number;
  color: string;
}

export interface ApiResponse {
  success: boolean;
  data: {
    userId: string;
    reportMonth: string;
    cycleSummary: {
      cycleLength: number;
      periodDuration: number;
      estimatedNextPeriod: string | null;
      ovulationWindow: string | null;
      totalCycles: number;
      label: string;
      startDate?: string | null;
    };
    flowAndSymptomsSummary: {
      totalLogged: number;
      averageCycleLength: number;
      dominantSymptomCategory: string;
      narrative: string;
      tips: string[];
    };
    periodLengthChart: ChartPoint[];
    symptomFrequency: {
      donuts: ApiDonut[];
      breakdown: unknown[];
    };
    historicalCycleData: Array<{
      date: string;
      topSymptom?: string;
      totalSymptoms?: number | string;
      flowIntensity?: number;
      note?: string;
    }>;
  };
}

export interface ChartPoint {
  date: string;
  flowIntensity: number;
}
// Normalised shape used internally by the component
export interface HealthReport {
  cycleSummary: {
    cycleLength: number;
    periodDuration: number;
    estimatedNextPeriod: string | null;
    ovulationWindow: string | null;
    label: string;
    startDate?: string | null;
  };
  flowSummary: {
    averageCycleLength: number;
    narrative: string;
    tips: string[];
  };
  donuts: ApiDonut[];
  historicalCycles: Array<{
    date: string;
    topSymptom?: string;
    totalSymptoms?: number | string;
    flowIntensity?: number;
    note?: string;
  }>;
  flowChartData: ChartPoint[];
}

export interface ApiError {
  message: string;
  status?: number;
}