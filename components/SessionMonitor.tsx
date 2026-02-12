'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { SessionManager } from '@/lib/security';

/**
 * Session Monitor Component
 * Tracks user activity and automatically logs out inactive users
 * Prevents unauthorized access to sensitive tax data
 */
export default function SessionMonitor() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    // Track user activity
    const updateActivity = useCallback(() => {
        SessionManager.updateActivity();
    }, []);

    // Check session validity
    const checkSession = useCallback(async () => {
        // Skip check on login page
        if (pathname === '/') return;

        // Check if session has expired
        if (SessionManager.isSessionExpired()) {
            // Clear session and redirect to login
            await supabase.auth.signOut();
            SessionManager.clearSession();
            router.push('/?session_expired=true');
            return;
        }

        // Verify with Supabase
        const { data: { session } } = await supabase.auth.getSession();
        if (!session && pathname !== '/') {
            router.push('/');
        }
    }, [pathname, router, supabase]);

    useEffect(() => {
        // Initial session check
        checkSession();

        // Track user activity on various events
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        events.forEach(event => {
            window.addEventListener(event, updateActivity);
        });

        // Check session every minute
        const sessionCheckInterval = setInterval(checkSession, 60 * 1000);

        // Cleanup
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, updateActivity);
            });
            clearInterval(sessionCheckInterval);
        };
    }, [updateActivity, checkSession]);

    // Monitor visibility changes (tab switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [checkSession]);

    return null; // This is a utility component, no UI
}
