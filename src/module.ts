import { PanelPlugin } from '@grafana/data';
import { HealthModelPanelOptions } from './types';
import { HealthModelPanel } from './HealthModelPanel';

export const plugin = new PanelPlugin<HealthModelPanelOptions>(HealthModelPanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'text',
      name: 'Simple text option',
      description: 'Description of panel option',
      defaultValue: 'Default value of text input option',
    })
    .addBooleanSwitch({
      path: 'showSeriesCount',
      name: 'Show series counter',
      defaultValue: false,
    })
    .addRadio({
      path: 'seriesCountSize',
      defaultValue: 'sm',
      name: 'Series counter size',
      settings: {
        options: [
          {
            value: 'sm',
            label: 'Small',
          },
          {
            value: 'md',
            label: 'Medium',
          },
          {
            value: 'lg',
            label: 'Large',
          },
        ],
      },
      showIf: config => config.showSeriesCount,
    })
    .addTextInput({
      path: 'yellowThreshold',
      name: 'Yellow Threshold Value',
      defaultValue: '0.75',
    })
    .addTextInput({
      path: 'redThreshold',
      name: 'Red Threshold Value',
      defaultValue: '0.5',
    });
});
