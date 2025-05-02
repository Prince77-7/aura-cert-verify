
import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { CheckIcon, ShieldCheckIcon, DatabaseZapIcon, ScaleIcon, BriefcaseIcon, MailIcon, AwardIcon, ShieldIcon, Users2Icon } from "lucide-react"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; 

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section Updated */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Complete Security Training & Certification
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                From certified security guard programs to advanced tactical training, delivered by industry professionals and veteran experts with secure digital certification.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Only Verify button remains */}
              <Button asChild size="lg">
                <Link to="/verify">Verify a Certificate</Link>
              </Button>
              {/* Admin Login Button Removed */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section Updated */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Comprehensive Training Excellence
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                From entry-level security certifications to elite tactical training, all backed by verifiable digital credentials.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 Updated */}
            <div className="flex flex-col items-center space-y-2 text-center glass p-6 rounded-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <Users2Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Expert Instructors</h3>
              <p className="text-muted-foreground">
                Training delivered by seasoned security professionals and former special operations veterans with real-world experience.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center glass p-6 rounded-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <AwardIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Dual Training Tracks</h3>
              <p className="text-muted-foreground">
                Standard security guard certification programs alongside advanced tactical training for specialized operations.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center glass p-6 rounded-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <ShieldIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Recognized Credentials</h3>
              <p className="text-muted-foreground">
                Industry-accepted certifications for security professionals at all levels, verified through our secure platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Key Metrics/Impact Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
         <div className="container px-4 md:px-6">
           <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
             <div className="space-y-2">
               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Training Impact & Excellence</h2>
               <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                 Our commitment to professional security training at every level, from standard guard certification to elite tactical skills.
               </p>
             </div>
           </div>
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Professionals Trained</CardTitle>
                 <Users2Icon className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">20,000+</div> 
                 <p className="text-xs text-muted-foreground">Security guards and tactical specialists trained</p>
               </CardContent>
             </Card>
              <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Instructor Experience</CardTitle>
                 <AwardIcon className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">250+ Years</div>
                 <p className="text-xs text-muted-foreground">Combined tactical field experience</p>
               </CardContent>
             </Card>
              <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Training Programs</CardTitle>
                 <ShieldCheckIcon className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">40+ Training Programs</div>
                 <p className="text-xs text-muted-foreground">From guard certification to specialized tactical operations</p>
               </CardContent>
             </Card>
           </div>
         </div>
       </section>

      {/* NEW: Why Partner With Us Section */}
       <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
         <div className="container px-4 md:px-6">
           <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
             <div className="space-y-2">
               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Train with Shield of Steel</h2>
               <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl">
                 Comprehensive security training programs trusted by private security companies, government agencies, corporations, and military units worldwide.
               </p>
             </div>
           </div>
           <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
             <div className="grid gap-1">
               <h3 className="text-lg font-bold flex items-center"><ShieldCheckIcon className="h-5 w-5 mr-2 text-primary"/>Entry to Advanced Training</h3>
               <p className="text-sm text-muted-foreground">
                 From basic security guard certification to specialized tactical training by former special forces veterans.
               </p>
             </div>
             <div className="grid gap-1">
               <h3 className="text-lg font-bold flex items-center"><ScaleIcon className="h-5 w-5 mr-2 text-primary"/>Industry & Government Standards</h3>
               <p className="text-sm text-muted-foreground">
                 All programs designed to meet or exceed private industry, government, and international security standards.
               </p>
             </div>
             <div className="grid gap-1">
               <h3 className="text-lg font-bold flex items-center"><BriefcaseIcon className="h-5 w-5 mr-2 text-primary"/>Complete Career Path</h3>
               <p className="text-sm text-muted-foreground">
                 Start with basic security certification and advance to specialized tactical roles with our progressive training paths.
               </p>
             </div>
           </div>
         </div>
       </section>

      {/* CTA Section Updated */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Verify Your Training Certification
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Confirm the authenticity of your Shield of Steel tactical training certificate.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4">
               {/* Focus CTA on Verification */}
              <Button asChild className="w-full" size="lg">
                <Link to="/verify">Verify a Certificate Now</Link>
              </Button>
              {/* Optional: Add a contact link */}
               <Button variant="outline" asChild className="w-full" size="lg">
                 <Link to="/contact" className="flex items-center justify-center">
                   <MailIcon className="mr-2 h-4 w-4" /> Inquire About Training
                 </Link>
               </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
