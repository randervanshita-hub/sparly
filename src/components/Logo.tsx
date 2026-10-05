export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange to-orange-soft">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 1.5C8 1.5 10.2 5.3 10.2 7.8C10.2 9.57 8.98 11 7.4 11C6.04 11 4.9 9.9 4.9 8.55C4.9 7.65 5.35 6.9 6.1 6.1"
            stroke="#140a04"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8.3" cy="12.2" r="1.3" fill="#140a04" />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-cream">Sparly</span>
    </div>
  )
}
