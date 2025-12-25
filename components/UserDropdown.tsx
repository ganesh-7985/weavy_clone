'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserDropdown() {
  const { user, profile, signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="w-7 h-7 rounded-full bg-[rgba(255,255,255,0.08)] animate-pulse" />
        <div className="w-20 h-4 bg-[rgba(255,255,255,0.08)] rounded animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="flex items-center gap-2 px-4 py-2 bg-[#f6ffa8] text-black rounded-lg font-medium text-sm hover:bg-[#e5ee97] transition-colors"
      >
        Sign In
      </button>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();
  const credits = profile?.credits ?? 0;
  const plan = profile?.plan ?? 'free';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.08)] transition-colors"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
            {initials}
          </div>
        )}
        <span className="text-white text-sm truncate max-w-[120px]">{displayName}</span>
        <ChevronDown className={`w-4 h-4 text-[rgba(255,255,255,0.4)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-[#121212] border border-[rgba(255,255,255,0.12)] rounded-xl shadow-xl z-50 overflow-hidden">
          {/* User Info */}
          <div className="p-4 border-b border-[rgba(255,255,255,0.12)]">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-medium">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{displayName}&apos;s Workspace</p>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="p-4 border-b border-[rgba(255,255,255,0.12)]">
            <p className="text-[rgba(255,255,255,0.6)] text-xs mb-1">Credits</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f6ffa8]" />
                <span className="text-white font-medium">{credits.toFixed(1)}</span>
              </div>
              <button className="text-[#f6ffa8] text-sm hover:underline">
                Upgrade for more
              </button>
            </div>
          </div>

          {/* Plan */}
          <div className="p-4 border-b border-[rgba(255,255,255,0.12)]">
            <p className="text-[rgba(255,255,255,0.6)] text-xs mb-1">Plan</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-medium capitalize">{plan}</span>
              {plan === 'free' && (
                <button className="text-[#f6ffa8] text-sm hover:underline">
                  Upgrade
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-[rgba(255,255,255,0.6)] text-sm rounded-lg hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-[rgba(255,255,255,0.6)] text-sm rounded-lg hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
