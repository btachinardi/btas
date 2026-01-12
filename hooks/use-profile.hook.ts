import { useMemo } from 'react';
import { usePortfolioData } from './use-portfolio-data.hook';
import { useLocale } from '../contexts/locale.context';
import type { Profile, SocialLinks } from '../types/portfolio-data.types';

export interface ResolvedProfile {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  photo: string;
  social: SocialLinks;
  summary: string;
  focusAreas: string[];
}

/**
 * Hook to get the profile with localized text
 */
export function useProfile(): {
  profile: ResolvedProfile | null;
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();
  const { locale, t, td } = useLocale();

  const profile = useMemo(() => {
    if (!data) return null;

    const p = data.profile;

    return {
      id: p.id,
      displayName: p.displayName,
      firstName: p.name.first,
      lastName: p.name.last,
      title: t(p.title),
      email: p.email,
      phone: p.phone,
      location: `${p.location.city}, ${p.location.country}`,
      photo: p.photo,
      social: p.social,
      summary: td(p.summary),
      focusAreas: p.focusAreas.map((area) => t(area)),
    };
  }, [data, locale, t, td]);

  return { profile, isLoading };
}

/**
 * Hook to get contact information only
 */
export function useContactInfo(): {
  email: string;
  phone: string;
  location: string;
  social: SocialLinks;
  isLoading: boolean;
} {
  const { profile, isLoading } = useProfile();

  return {
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    location: profile?.location ?? '',
    social: profile?.social ?? {},
    isLoading,
  };
}

/**
 * Hook to get social links
 */
export function useSocialLinks(): {
  links: Array<{ type: keyof SocialLinks; url: string; label: string }>;
  isLoading: boolean;
} {
  const { data, isLoading } = usePortfolioData();

  const links = useMemo(() => {
    if (!data) return [];

    const social = data.profile.social;
    const result: Array<{ type: keyof SocialLinks; url: string; label: string }> = [];

    if (social.linkedin) {
      result.push({ type: 'linkedin', url: social.linkedin, label: 'LinkedIn' });
    }
    if (social.github) {
      result.push({ type: 'github', url: social.github, label: 'GitHub' });
    }
    if (social.youtube) {
      result.push({ type: 'youtube', url: social.youtube, label: 'YouTube' });
    }
    if (social.twitter) {
      result.push({ type: 'twitter', url: social.twitter, label: 'Twitter' });
    }
    if (social.website) {
      result.push({ type: 'website', url: social.website, label: 'Website' });
    }

    return result;
  }, [data]);

  return { links, isLoading };
}
