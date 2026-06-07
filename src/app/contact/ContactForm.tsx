"use client";

import React, { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlowCard } from '@/components/ui/GlowCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { FadeInSection } from '@/components/animations/FadeInSection';
import { Mail, MessageCircle, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { submitContactForm } from './actions';
import { normalizeWhatsAppNumber } from '@/lib/whatsapp';
import toast from 'react-hot-toast';

interface ContactFormProps {
  content: {
    heroTitle: string;
    heroSubtitle: string;
    email: string;
    whatsappNumber: string;
    whatsappLink: string;
    address: string;
    hours: string;
    responseTime: string;
  };
  services: Array<{
    id: string;
    title: string;
  }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <GradientButton type="submit" className="w-full py-4" disabled={pending}>
      {pending ? "Sending..." : "Submit Inquiry"}
    </GradientButton>
  );
}

export default function ContactForm({ content, services }: ContactFormProps) {
  const [state, formAction] = useFormState(submitContactForm, {
    success: false,
    warning: false,
    message: "",
    errors: {},
  });
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      if (state.warning) {
        toast(state.message || "Message received with warnings.", {
          icon: '⚠️',
          duration: 6000,
        });
      } else {
        toast.success(state.message || "Message sent successfully!");
      }
      formRef.current?.reset();
    } else if (state?.message && !state?.success) {
      toast.error(state.message);
    }
  }, [state]);

  const whatsappUrl = (content.whatsappLink && content.whatsappLink.startsWith('https://wa.me'))
    ? content.whatsappLink
    : `https://wa.me/${normalizeWhatsAppNumber(content.whatsappNumber || "923012475707")}`;

  const emailUrl = content.email ? `mailto:${content.email}` : "mailto:haditech313@gmail.com";

  return (
    <div className="flex flex-col gap-12 pb-12">
      <FadeInSection>
        <SectionHeader 
          badge="Contact" 
          title={content.heroTitle} 
          subtitle={content.heroSubtitle} 
        />
      </FadeInSection>

      <div className="grid lg:grid-cols-5 gap-8">
        <FadeInSection delay={0.1} className="lg:col-span-3">
          <GlowCard className="p-6 md:p-8">
            {state?.success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                {state.warning ? (
                  <>
                    <div className="w-16 h-16 bg-warning/20 text-warning rounded-full flex items-center justify-center">
                      <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-warning">Message Received with Warning</h3>
                    <p className="text-muted-foreground max-w-md">
                      {state.message || "Your message was saved, but email or WhatsApp notification failed. Please reach out to us directly."}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-2xl font-bold">Message Received!</h3>
                    <p className="text-muted-foreground">{state.message || "We'll be in touch shortly to discuss your project."}</p>
                  </>
                )}
                <button 
                  onClick={() => window.location.reload()} 
                  className="text-primary mt-4 underline underline-offset-4"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form ref={formRef} action={formAction} className="space-y-6" aria-label="Contact form">
                <input type="text" name="honeypot" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                    <input 
                      id="name" 
                      name="name" 
                      type="text" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
                      placeholder="John Doe" 
                      aria-required="true" 
                    />
                    {state?.errors?.name && <p className="text-destructive text-sm mt-1">{state.errors.name[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
                      placeholder="john@example.com" 
                      aria-required="true" 
                    />
                    {state?.errors?.email && <p className="text-destructive text-sm mt-1">{state.errors.email[0]}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number (Optional)</label>
                    <input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
                      placeholder="+1 (555) 000-0000" 
                    />
                    {state?.errors?.phone && <p className="text-destructive text-sm mt-1">{state.errors.phone[0]}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium">Service Needed</label>
                    <select 
                      id="service" 
                      name="service" 
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
                    >
                      <option value="">Select a service</option>
                      {services.map((s, idx) => (
                        <option key={s.id || idx} value={s.title}>{s.title}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                    {state?.errors?.service && <p className="text-destructive text-sm mt-1">{state.errors.service[0]}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="budget" className="text-sm font-medium">Estimated Budget</label>
                  <select 
                    id="budget" 
                    name="budget" 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none"
                  >
                    <option value="">Select a budget range</option>
                    <option value="<$5k">Under $5k</option>
                    <option value="$5k - $10k">$5k - $10k</option>
                    <option value="$10k - $25k">$10k - $25k</option>
                    <option value="$25k+">$25k+</option>
                  </select>
                  {state?.errors?.budget && <p className="text-destructive text-sm mt-1">{state.errors.budget[0]}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Project Details</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none" 
                    placeholder="Tell us about your requirements..." 
                    aria-required="true"
                  ></textarea>
                  {state?.errors?.message && <p className="text-destructive text-sm mt-1">{state.errors.message[0]}</p>}
                </div>

                <SubmitButton />
              </form>
            )}
          </GlowCard>
        </FadeInSection>

        <FadeInSection delay={0.2} className="lg:col-span-2 space-y-6">
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block">
              <GlowCard className="p-6 flex items-center gap-4 cursor-pointer hover:border-success/50 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chat with us</p>
                  <p className="font-semibold text-lg">{content.whatsappNumber}</p>
                </div>
              </GlowCard>
            </a>
          )}

          {emailUrl && (
            <a href={emailUrl} className="block">
              <GlowCard className="p-6 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email us</p>
                  <p className="font-semibold text-lg">{content.email}</p>
                </div>
              </GlowCard>
            </a>
          )}

          <div className="p-6 rounded-2xl bg-muted/30 border border-border flex items-center gap-3">
             <Clock className="text-warning" size={20} />
             <span className="text-sm font-medium">Avg. response time: {content.responseTime}</span>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
}
