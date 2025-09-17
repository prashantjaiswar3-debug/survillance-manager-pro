import React from 'react';
import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Surveillance Manager PRO Logo"
      width={40}
      height={40}
    />
  );
}
