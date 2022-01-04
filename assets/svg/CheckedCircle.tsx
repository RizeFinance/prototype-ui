import React from 'react';

interface IProps {
  height?: number;
}

const CheckedCircle: React.FC<IProps> = ({ height = 16 }) => {
  const origW = 24;
  const origH = 24;
  const viewBox = `0 0 ${origW} ${origH}`;
  const scaledW = (origW * height) / origH;

  return (
    <svg
      width={scaledW}
      height={height}
      viewBox={viewBox}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="title"
    >
      <title>Checked Circle Icon</title>
      <g
        id="icon/main/status/approved"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <path
          d="M13.2122572,12.00025 L17.7491414,7.46336585 C18.0842862,7.128221 18.0842862,6.58650349 17.7491414,6.25135864 C17.4139965,5.91621379 16.872279,5.91621379 16.5371341,6.25135864 L12.00025,10.7882428 L7.46336585,6.25135864 C7.128221,5.91621379 6.58650349,5.91621379 6.25135864,6.25135864 C5.91621379,6.58650349 5.91621379,7.128221 6.25135864,7.46336585 L10.7882428,12.00025 L6.25135864,16.5371341 C5.91621379,16.872279 5.91621379,17.4139965 6.25135864,17.7491414 C6.41850249,17.9162852 6.63793237,18.0002857 6.85736225,18.0002857 C7.07679212,18.0002857 7.296222,17.9162852 7.46336585,17.7491414 L12.00025,13.2122572 L16.5371341,17.7491414 C16.704278,17.9162852 16.9237079,18.0002857 17.1431378,18.0002857 C17.3625676,18.0002857 17.5819975,17.9162852 17.7491414,17.7491414 C18.0842862,17.4139965 18.0842862,16.872279 17.7491414,16.5371341 L13.2122572,12.00025 Z"
          id="Fill-1"
          fill="#FFFFFF"
        ></path>
        <g id="Group-4" fill={'#0EDD4D'}>
          <circle id="Oval" cx="12" cy="12" r="12"></circle>
        </g>
        <polygon
          id="Path"
          fill="#FFFFFF"
          fillRule="nonzero"
          points="8.10598016 11.0785449 10.1001313 12.7696298 14.4053092 7 17 8.82839392 10.6390607 17.3529412 6 13.4190389"
        ></polygon>
      </g>
    </svg>
  );
};

export default CheckedCircle;
