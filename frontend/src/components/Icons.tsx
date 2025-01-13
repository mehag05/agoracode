import React from 'react';

// Define a type that includes only the properties applicable to HTMLImageElement
type ImageProps = Omit<React.SVGProps<SVGSVGElement>, 'onCopy' | 'ref' | 'xmlns' | 'xmlnsXlink' | 'viewBox' | 'shapeRendering' | 'textRendering'>;

interface LucideProps extends ImageProps {
  size?: number;
  absoluteStrokeWidth?: number;
}

// TODO: convert logo to SVG and potentially make it simpler

export const Icons = {
  logo: (props: LucideProps) => {
    const { height = 60, width = 40, style, className } = props;

    return (
      <img
        src="/thumbnail.png" // Ensure this path is correct
        alt="Logo"
        width={width}
        height={height}
        style={style}
        className={className}
      />
    );
  },
}
