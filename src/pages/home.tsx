import React from 'react';
import { Layout } from '../app/layout';
import { Hero } from '../components/home/hero';
import { Features } from '../components/home/features';
import { SocialProof } from '../components/home/social-proof';
import { CTA } from '../components/home/cta';

interface HomePageProps {
  onSignIn: () => void;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
}

export default function HomePage({ onSignIn, onNavigate, isAuthenticated }: HomePageProps) {
  return (
    <Layout onSignIn={onSignIn} onNavigate={onNavigate} isAuthenticated={isAuthenticated}>
      <Hero onSignIn={onSignIn} />
      <Features onNavigate={onNavigate} />
      <SocialProof />
      <CTA onSignIn={onSignIn} />
    </Layout>
  );
}