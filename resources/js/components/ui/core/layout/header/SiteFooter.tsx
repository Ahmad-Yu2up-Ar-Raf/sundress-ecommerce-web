'use client';
import { Link } from '@inertiajs/react';
import { Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { Logo } from '@/components/ui/fragments/svg/logo';

const footerColumns = [
  {
    title: 'Solutions',
    links: [
      'Business Automation',
      'Cloud Services',
      'Analytics',
      'Integrations',
      'Support',
    ],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Case Studies', 'Blog', 'Webinars', 'Community'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Contact', 'Partners', 'Press'],
  },
];

const legalLinks = [
  'Terms of Service',
  'Privacy Policy',
  'Cookie Settings',
  'Accessibility',
];

const socialIcons = [
  { icon: <Instagram className="h-5 w-5" />, href: '#' },
  { icon: <Twitter className="h-5 w-5" />, href: '#' },
  { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  { icon: <Youtube className="h-5 w-5" />, href: '#' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-background mt-7 border-t text-foreground relative w-full pt-20 pb-10">

      <div className="relative z-10  container px-5 sm:px-6 lg:px-14">
      
        <div className="mb-16 grid  grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-6 flex items-center space-x-2">
        <Logo/>
            </div>
            <p className="text-foreground/60 mb-6">
              Empowering businesses with reliable, scalable, and innovative
              solutions.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="glass-effect hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full transition"
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-lg font-semibold">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((text) => (
                  <li key={text}>
                    <Link
                      href="#"
                      className="text-foreground/60 hover:text-foreground transition"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-foreground/10 flex flex-col items-center justify-between border-t pt-8 md:flex-row">
          <p className="text-foreground/60 mb-4 text-sm md:mb-0">
            © 2023 Acme Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((text) => (
              <Link
                key={text}
                href="#"
                className="text-foreground/60 hover:text-foreground text-sm"
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}