type SeriesSize = 'sm' | 'md' | 'lg';

// export interface SimpleOptions {
//   text: string;
//   showSeriesCount: boolean;
//   seriesCountSize: SeriesSize;
// }

export interface HealthModelPanelOptions {
  text: string;
  showSeriesCount: boolean;
  seriesCountSize: SeriesSize;
  yellowThreshold: number;
  redThreshold: number;
}
