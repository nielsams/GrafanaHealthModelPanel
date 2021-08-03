import React from 'react';
import { PanelProps, DataFrameView } from '@grafana/data';
import { HealthModelPanelOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import { HealthModelGraphComponent } from './HealthModelGraphComponent';

interface Props extends PanelProps<HealthModelPanelOptions> {}

export const HealthModelPanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const styles = getStyles();

  const view = new DataFrameView(data.series[0]);
  // console.log('view: ' + JSON.stringify(view));

  // const levels = data.series[0].fields.find(field => field.name === 'Level')?.values.toArray() as number[];
  // const maxLevel = levels.reduce(function(a, b) {
  //   return Math.max(a, b);
  // }, 0);

  // const viewItems: JSX.Element[] = [];
  // const elementSize = [150, 45];
  // const vstep = elementSize[1] * 4;

  // const getFillColor = function(score: number) {
  //   if (score <= options.redThreshold) {
  //     return theme.palette.redBase;
  //   }
  //   if (score <= options.yellowThreshold) {
  //     return theme.palette.yellow;
  //   }

  //   return theme.palette.greenBase;
  // };

  // for (let i = 0; i <= maxLevel; i++) {
  //   // This should work:
  //   // const levelItems = view.filter(v => v.Level === i);

  //   // It does not, perhaps something is wrong with DataFrameView. This does work *meh*:
  //   const levelItems: any[] = [];
  //   view.map(item => {
  //     if (item.Level === i) {
  //       levelItems.push(Object.assign([], item));
  //     }
  //   });

  //   console.log('level ' + i + ' has ' + levelItems.length + ' items.');
  //   const hstep = (width - elementSize[0] / 2) / levelItems.length;

  //   levelItems.map((row, index) => {
  //     console.log('pushing item: ' + JSON.stringify(row));
  //     viewItems.push(
  //       <g transform={`translate(${index * hstep - (width - hstep) / 2}, -${i * vstep})`}>
  //         <rect
  //           width={elementSize[0]}
  //           height={elementSize[1]}
  //           rx="10"
  //           style={{ fill: getFillColor(row.HealthScore) }}
  //         />
  //         <foreignObject
  //           width={elementSize[0]}
  //           height={elementSize[1]}
  //           style={{ textAlign: 'center', lineHeight: elementSize[1] + 'px' }}
  //         >
  //           {row.Component}
  //         </foreignObject>
  //       </g>
  //     );
  //   });
  // }

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      {/* <svg
        className={styles.svg}
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
      >
        return (<g>{viewItems}</g>
        );
      </svg> */}

      <HealthModelGraphComponent
        width={width}
        height={height}
        yellowThreshold={options.yellowThreshold}
        redThreshold={options.redThreshold}
        theme={theme}
        data={view}
      />
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
