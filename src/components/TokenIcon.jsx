import React from 'react';

const ICONS = {
  MON: "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f696d61676564656c69766572792e6e65742f63424e4447676b727345412d625f6978497039536b512f495f743872675f565f343030783430302e6a70672f7075626c6963",
  INX: "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f617277656176652e6e65742f32674167724f346a624573563672324659564a566b4b6b3072635070536569597a65366346664733645973",
  HYPE: "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f617277656176652e6e65742f51425264526f7038774934507053635352544b796962762d665175594275612d574f76433774754a794a6f",
  LIT: "https://statics.solscan.io/cdn/imgs/s60?ref=68747470733a2f2f617277656176652e6e65742f74536877746e7a4c71556a71745a632d59736f6b3637707051634f554948685833506745596c4f30326d45"
};

export default function TokenIcon({ symbol, size = 16 }) {
  const url = ICONS[symbol.toUpperCase()];
  if (!url) return null;
  return (
    <img 
      src={url} 
      alt={`${symbol} logo`} 
      width={size} 
      height={size} 
      style={{ borderRadius: '50%', objectFit: 'cover', display: 'inline-block' }} 
    />
  );
}
