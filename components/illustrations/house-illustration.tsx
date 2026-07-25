export function HouseIllustration() {
  return (
    <svg viewBox="0 0 560 560" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      {/* arxa fon dairə */}
      <circle cx="300" cy="270" r="230" fill="#2F6F63" opacity="0.08" />
      <circle cx="300" cy="270" r="170" fill="#C98A3B" opacity="0.06" />

      {/* günəş */}
      <circle cx="470" cy="90" r="34" fill="#C98A3B" opacity="0.85" />

      {/* bulud */}
      <g opacity="0.5">
        <ellipse cx="110" cy="110" rx="46" ry="22" fill="#FBF8F2" />
        <ellipse cx="145" cy="100" rx="34" ry="18" fill="#FBF8F2" />
        <ellipse cx="80" cy="102" rx="30" ry="16" fill="#FBF8F2" />
      </g>

      {/* torpaq xətti */}
      <line x1="60" y1="470" x2="500" y2="470" stroke="#16302C" strokeOpacity="0.15" strokeWidth="3" />

      {/* ev kölgəsi */}
      <ellipse cx="290" cy="472" rx="150" ry="16" fill="#16302C" opacity="0.08" />

      {/* dam (kərpic rəngi) */}
      <polygon points="150,240 290,120 430,240" fill="#A84B34" stroke="#16302C" strokeWidth="4" strokeLinejoin="round" />
      <rect x="140" y="228" width="300" height="22" rx="6" fill="#8F3D29" />

      {/* baca */}
      <rect x="350" y="140" width="30" height="70" fill="#8F3D29" stroke="#16302C" strokeWidth="3" />

      {/* divarlar */}
      <rect x="175" y="248" width="230" height="222" fill="#FBF8F2" stroke="#16302C" strokeWidth="4" />

      {/* sol pəncərə */}
      <rect x="205" y="285" width="70" height="70" rx="4" fill="#2F6F63" fillOpacity="0.18" stroke="#16302C" strokeWidth="3.5" />
      <line x1="240" y1="285" x2="240" y2="355" stroke="#16302C" strokeWidth="3" />
      <line x1="205" y1="320" x2="275" y2="320" stroke="#16302C" strokeWidth="3" />

      {/* sağ pəncərə */}
      <rect x="315" y="285" width="70" height="70" rx="4" fill="#2F6F63" fillOpacity="0.18" stroke="#16302C" strokeWidth="3.5" />
      <line x1="350" y1="285" x2="350" y2="355" stroke="#16302C" strokeWidth="3" />
      <line x1="315" y1="320" x2="385" y2="320" stroke="#16302C" strokeWidth="3" />

      {/* qapı */}
      <rect x="258" y="370" width="64" height="100" rx="4" fill="#C98A3B" stroke="#16302C" strokeWidth="3.5" />
      <circle cx="304" cy="422" r="4.5" fill="#16302C" />

      {/* çiçəklər/kol */}
      <circle cx="170" cy="452" r="20" fill="#2F6F63" opacity="0.7" />
      <circle cx="150" cy="460" r="14" fill="#2F6F63" opacity="0.55" />
      <circle cx="410" cy="452" r="20" fill="#2F6F63" opacity="0.7" />
      <circle cx="432" cy="462" r="14" fill="#2F6F63" opacity="0.55" />

      {/* üzən "kirayə" kartı - saytın öz kart dizaynına istinad */}
      <g transform="translate(30,330) rotate(-6)">
        <rect x="0" y="0" width="150" height="86" rx="8" fill="#FBF8F2" stroke="#C8BFAD" strokeWidth="2" />
        <rect x="14" y="14" width="122" height="34" rx="4" fill="#B9C4B3" />
        <text x="14" y="70" fontFamily="IBM Plex Mono, monospace" fontSize="22" fontWeight="700" fill="#A84B34">
          450 ₼
        </text>
      </g>

      {/* ürək ikonu kiçik nişan */}
      <g transform="translate(410,330)">
        <circle cx="30" cy="30" r="30" fill="#FBF8F2" stroke="#C8BFAD" strokeWidth="2" />
        <path
          d="M30 42 C18 33 12 26 12 18.5 C12 12.5 16.5 8 22.5 8 C26 8 29 9.8 30 12.6 C31 9.8 34 8 37.5 8 C43.5 8 48 12.5 48 18.5 C48 26 42 33 30 42 Z"
          fill="#A84B34"
        />
      </g>
    </svg>
  );
}