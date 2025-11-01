'use client';
import dynamic from 'next/dynamic';

const QuizApp = dynamic(() => import('@/components/QuizApp/QuizApp'), {
  ssr: false,
});

export default function HomePage() {
  return <QuizApp />;
}