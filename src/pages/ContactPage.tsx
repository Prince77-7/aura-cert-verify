import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactPage: React.FC = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder: Add form submission logic here (e.g., send email, API call)
    alert("Thank you for your message. We will get back to you shortly.");
    // Consider adding form clearing logic here
  };

  return (
    <div className="container py-12 md:py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Contact Information */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have questions about certificate verification or our training programs? 
            Reach out to us.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Shield of Steel LLC - Training Division</h3>
              <p className="text-muted-foreground">3540 SUMMER AVE, SUITE 305<br />MEMPHIS, TN 38122<br />United States</p>
            </div>
            <div>
              <h3 className="font-medium">General Inquiries</h3>
              <p className="text-muted-foreground">Email: <a href="mailto:training.info@shieldofsteel.com" className="text-primary hover:underline">training.info@shieldofsteel.com</a></p>
              <p className="text-muted-foreground">Phone: <a href="tel:+12022222225" className="text-primary hover:underline">202-222-2225</a></p>
            </div>
             <div>
              <h3 className="font-medium">Verification Support</h3>
              <p className="text-muted-foreground">For issues verifying a certificate, please email: <a href="mailto:verify.support@shieldofsteel.com" className="text-primary hover:underline">verify.support@shieldofsteel.com</a></p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll respond as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Certificate Verification Question" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Please describe your inquiry..." required rows={5} />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
