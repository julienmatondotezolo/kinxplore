'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2431';

export default function ConfirmEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('No confirmation token provided.');
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/confirm?token=${encodeURIComponent(token)}`, {
      redirect: 'manual',
    })
      .then((res) => {
        if (res.ok || res.type === 'opaqueredirect' || res.status === 302) {
          setStatus('success');
          setTimeout(() => {
            router.push('/login?confirmed=true');
          }, 3000);
        } else {
          return res.json().then((data) => {
            throw new Error(data.message || 'Confirmation failed');
          });
        }
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message || 'Something went wrong. Please try again.');
      });
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {status === 'loading' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirming your email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Confirmed!</h2>
            <p className="text-gray-600 mb-4">
              Your email has been verified. Redirecting you to login...
            </p>
            <Link
              href="/login?confirmed=true"
              className="inline-block mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirmation Failed</h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <Link
              href="/register"
              className="inline-block mt-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
            >
              Try Again
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}
