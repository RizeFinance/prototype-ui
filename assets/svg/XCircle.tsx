import React from 'react';

interface IProps {
  height?: number;
  color?: string;
}

const FailedIcon: React.FC<IProps> = ({ height = 16, color = '#E7112F' }) => {
  const origW = 24;
  const origH = 24;
  const viewBox = `0 0 ${origW} ${origH}`;
  const scaledW = (origW * height) / origH;

  return (
    <svg aria-labelledby="title" width={scaledW} height={height} viewBox={viewBox}>
      <title>Failed X Icon</title>
      <g id="icon/main/status/remove" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <circle id="Fill-2" fill={color} cx="12" cy="12" r="12"></circle>
        <polygon
          id="Path"
          fill="#FFFFFF"
          points="10.0855019 11.9938042 7 8.89591078 8.89591078 7 11.9938042 10.0855019 15.0916976 7 17 8.89591078 13.9021066 11.9938042 17 15.0916976 15.0916976 17 11.9938042 13.9021066 8.89591078 17 7 15.0916976"
        ></polygon>
      </g>
    </svg>
  );
};

export default FailedIcon;
