import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = { sm: 'avatar--sm', md: 'avatar--md', lg: 'avatar--lg', xl: 'avatar--xl' };
const px = { sm: 28, md: 36, lg: 48, xl: 64 };

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const dim = px[size];

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        width={dim}
        height={dim}
        onError={() => setImgError(true)}
        className={`avatar ${sizeMap[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`avatar avatar--fallback ${sizeMap[size]} ${className}`}
      style={{ width: dim, height: dim, fontSize: size === 'xl' ? '1.25rem' : '0.75rem' }}
      aria-label={name}
      role="img"
    >
      {initials(name)}
    </div>
  );
}
