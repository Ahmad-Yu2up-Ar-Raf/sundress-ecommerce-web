import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { MinimalistHero } from '@/components/ui/fragments/custom-ui/Minimalis-hero';
import LogoCloudDemoPage from '@/components/ui/fragments/animate-ui/marquee-brands';

const MinimalistHeroDemo = () => {
  const navLinks = [
    { label: 'HOME', href: '#' },
    { label: 'PRODUCT', href: '#' },
    { label: 'STORE', href: '#' },
    { label: 'ABOUT US', href: '#' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Instagram, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Linkedin, href: '#' },
  ];

  return (
    <section>
    <MinimalistHero
      logoText="Sundress."
      navLinks={navLinks}
      mainText="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultrices, justo vel tempus."
      readMoreLink="#"
      imageSrc="https://ik.imagekit.io/fpxbgsota/image%2013.png?updatedAt=1753531863793"
      imageAlt="A portrait of a person in a black turtleneck, in profile."
      overlayText={{
        part1: 'less is',
        part2: 'more.',
      }}
      socialLinks={socialLinks}
      locationText="Arlington Heights, IL"
    />
    <div className="flex justify-center gap-5 py-2 md:py-7 bg-secondary rounded-b-2xl w-full">
        <div className="overflow-x-hidden max-w-6xl m-auto w-full">
          <LogoCloudDemoPage />
        </div>
      </div>
    </section>
  );
};

export default MinimalistHeroDemo;
