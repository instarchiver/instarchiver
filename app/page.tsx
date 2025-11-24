import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Globe } from 'lucide-react';
import Star32 from '@/components/stars/s32';
import Star11 from '@/components/stars/s11';

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-main via-main to-main p-4 sm:p-6 lg:p-8 flex items-center justify-center overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        {/* Main Card */}
        <div className="bg-secondary-background rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border-2 border-border">
          {/* Logo and Since Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12 gap-4 sm:gap-0">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center">
                <Star32 size={32} color="white" />
              </div>
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                InstArchiver
              </span>
            </div>
            <div className="bg-foreground text-secondary-background px-4 py-2 sm:px-6 rounded-full text-sm sm:text-lg font-medium">
              Since 2024
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground leading-tight tracking-tight">
              INSTAGRAM ARCHIVER
            </h1>
          </div>

          {/* Navigation Arrows and Service Badge */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-16 gap-6 sm:gap-4">
            <div className="flex space-x-4">
              <Button variant="default" size="icon" asChild>
                <Link href="/users">
                  <ArrowRight size={20} />
                </Link>
              </Button>
              <Button variant="default" size="icon" asChild>
                <Link href="/stories">
                  <ArrowRight size={20} />
                </Link>
              </Button>
            </div>

            <div className="bg-main text-main-foreground px-4 py-2 sm:px-6 lg:px-8 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-semibold flex items-center space-x-2 text-center">
              <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                <Star11 size={16} color="white" />
              </div>
              <span>Content Archiving & Management</span>
            </div>
          </div>

          {/* Contact/Info Bar */}
          <div className="bg-secondary-background border-2 border-border rounded-full p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center text-foreground gap-4 sm:gap-2">
              <div className="flex items-center space-x-3">
                <Code className="w-5 h-5" />
                <span className="text-sm sm:text-base lg:text-lg font-medium">
                  Open Source Project
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5" />
                <span className="text-sm sm:text-base lg:text-lg font-medium">
                  Next.js • React Query
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-main rounded-full"></div>
                <span className="text-sm sm:text-base lg:text-lg font-medium">
                  Neo Brutalist Design
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
