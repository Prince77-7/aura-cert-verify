
import React from "react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { CheckIcon } from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Secure Certificate Verification Platform
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Issue, manage, and verify digital certificates with an enterprise-grade secure platform
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/verify">Verify a Certificate</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/login">Admin Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Enterprise-Grade Security
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our platform provides a secure, tamper-proof solution for certificate management
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center space-y-2 glass p-6 rounded-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Certificates</h3>
              <p className="text-muted-foreground text-center">
                Each certificate is uniquely verified with a secure identification code
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 glass p-6 rounded-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Instant Verification</h3>
              <p className="text-muted-foreground text-center">
                Quickly verify the authenticity of any certificate in our system
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 glass p-6 rounded-lg">
              <div className="p-3 rounded-full bg-primary/10">
                <CheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Compliant Standards</h3>
              <p className="text-muted-foreground text-center">
                Our platform meets government and enterprise compliance standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Start issuing tamper-proof digital certificates today
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button asChild className="w-full">
                <Link to="/login">Access Admin Portal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
