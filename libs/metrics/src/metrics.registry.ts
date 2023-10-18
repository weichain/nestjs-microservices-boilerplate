import { getOrCreateMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Gauge, Histogram, Summary } from 'prom-client';

interface IMetricOptions {
  name: string;
  help: string;
  labelNames: string[];
}

export default class MetricsRegistry {
  public static gauge(options: IMetricOptions, label: string): Gauge<string> {
    return getOrCreateMetric('Gauge', options).labels(label) as Gauge<string>;
  }

  public static counter(options: IMetricOptions, label: string): Counter<string> {
    return getOrCreateMetric('Counter', options).labels(label) as Counter<string>;
  }

  public static summary(options: IMetricOptions, label: string): Summary<string> {
    return getOrCreateMetric('Summary', options).labels(label) as Summary<string>;
  }

  public static histogram(options: IMetricOptions, label: string): Histogram<string> {
    return getOrCreateMetric('Histogram', options).labels(label) as Histogram<string>;
  }
}
