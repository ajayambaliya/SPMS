'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const isActive = (path: string) => pathname === path;

    if (pathname === '/') return null;

    return (
        <nav className="glass-panel" style={{
            margin: '1rem',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '1rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: 'white'
                }}>
                    T
                </div>
                <span style={{ fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>TaxAnalyzer</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link
                    href="/payroll"
                    className={isActive('/payroll') ? 'btn-primary' : ''}
                    style={{
                        color: isActive('/payroll') ? 'white' : 'var(--text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                >
                    📊 Upload
                </Link>
                <Link
                    href="/admin"
                    className={isActive('/admin') ? 'btn-primary' : ''}
                    style={{
                        color: isActive('/admin') ? 'white' : 'var(--text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                >
                    👤 Employees
                </Link>
                <Link
                    href="/reports"
                    className={isActive('/reports') ? 'btn-primary' : ''}
                    style={{
                        color: isActive('/reports') ? 'white' : 'var(--text-muted)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                >
                    📑 Reports
                </Link>
            </div>

            <div>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
