import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  HelpCircle,
  ShieldAlert,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PublicNav } from '@/components/layout/PublicNav';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { contactApi, getApiErrorMessage } from '@/lib/api';
import { toast } from 'sonner';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const defaultTopic = searchParams.get('topic') === 'abuse' ? 'abuse' : 'general';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: defaultTopic,
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await contactApi.submit(formData);
      setSubmitted(true);
      toast.success('Your message has been dispatched to our engineering team!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to send message. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      topic: 'general',
      message: '',
    });
  };

  const contactChannels = [
    {
      icon: MessageSquare,
      title: 'Customer & Technical Support',
      description: 'Need help with your links, API keys, or analytics tracking?',
      email: 'support@clickon.io',
      response: 'Typical response: < 2 hours',
    },
    {
      icon: Sparkles,
      title: 'Enterprise & High Volume',
      description: 'Custom SLA guarantees, dedicated IPs, and branded domain setup.',
      email: 'enterprise@clickon.io',
      response: 'Typical response: Same business day',
    },
    {
      icon: ShieldAlert,
      title: 'Trust, Safety & Link Abuse',
      description: 'Report suspected phishing, malware, or spam short links immediately.',
      email: 'abuse@clickon.io',
      response: 'Priority review: < 30 minutes',
    },
  ];

  const faqs = [
    {
      question: 'How quickly does our support team respond?',
      answer:
        'Standard technical inquiries are addressed within 2 to 4 hours. Critical abuse reports or security flags are escalated to our 24/7 on-call reliability engineers within 30 minutes.',
    },
    {
      question: 'How do I report a suspicious or phishing short link?',
      answer:
        'Select "Report Abuse / Phishing" in the topic dropdown or directly email abuse@clickon.io with the short link. Our automated sandbox investigates and deactivates verified malicious targets automatically.',
    },
    {
      question: 'Can I request a custom API rate limit or SLA for my company?',
      answer:
        'Yes! For high-throughput applications requiring millions of redirects per month, our team provides dedicated cluster deployment and custom rate limits.',
    },
    {
      question: 'Where can I find sample code and API endpoints?',
      answer:
        'Check our interactive Documentation page (/docs) which includes copy-paste code snippets for cURL, JavaScript Fetch, and Python requests.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <PublicNav activePage="contact" />

      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section className="relative pt-16 pb-14 md:pt-20 md:pb-16 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <Badge variant="outline" className="px-3 py-1 font-semibold text-primary border-primary/20 bg-primary/5">
              Contact & Support
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              We’re here to help you{' '}
              <span className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                build without limits.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
              Have questions, feedback, or need enterprise guidance? Send us a note and we will respond promptly.
            </p>
          </div>
        </section>

        {/* Main Section: Form & Info */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Direct channels and info (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">Direct Contact Channels</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the channel that best matches your request for immediate routing to the right specialist.
                  </p>
                </div>

                <div className="space-y-4">
                  {contactChannels.map((c) => (
                    <Card
                      key={c.title}
                      className="border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-200"
                    >
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                          <c.icon className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm">{c.title}</h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {c.description}
                          </p>
                          <a
                            href={`mailto:${c.email}`}
                            className="inline-block text-xs font-mono font-medium text-primary hover:underline pt-1"
                          >
                            {c.email}
                          </a>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
                            <Clock className="h-3 w-3" />
                            {c.response}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Headquarters & Hours */}
                <Card className="border-border/60 bg-muted/30">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Headquarters & Distributed Teams</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      ClickOn operates distributed edge nodes globally with primary developer hubs in San Francisco, London, and Tokyo.
                    </p>
                    <div className="pt-1 text-xs text-muted-foreground border-t border-border/50">
                      Standard Business Operations: Mon–Fri, 08:00 - 20:00 UTC
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Contact Form (7 cols) */}
              <div className="lg:col-span-7">
                <Card className="border-border/60 bg-card/70 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill in the details below and our team will get back to you shortly.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-2">
                    {submitted ? (
                      <div className="text-center py-12 px-4 space-y-4">
                        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight">Message Received!</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Thank you for reaching out, <span className="font-semibold text-foreground">{formData.name}</span>. We have sent a confirmation email to <span className="font-semibold text-foreground">{formData.email}</span>.
                        </p>
                        <div className="pt-4">
                          <Button variant="outline" onClick={handleReset}>
                            Send Another Message
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">
                              Your Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="name"
                              placeholder="Alex Mercer"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">
                              Email Address <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="alex@company.com"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="topic">Topic of Inquiry</Label>
                          <Select
                            value={formData.topic}
                            onValueChange={(val) => setFormData({ ...formData, topic: val })}
                          >
                            <SelectTrigger id="topic">
                              <SelectValue placeholder="Select a topic" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Inquiry</SelectItem>
                              <SelectItem value="support">Technical Support</SelectItem>
                              <SelectItem value="enterprise">Enterprise & Custom Plans</SelectItem>
                              <SelectItem value="abuse">Report Abuse / Phishing Link</SelectItem>
                              <SelectItem value="partnership">Partnership & Integrations</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">
                            Message or Request Details <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            rows={5}
                            placeholder="Please provide details about your question, short link issue, or enterprise volume..."
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({ ...formData, message: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="pt-2">
                          <Button
                            type="submit"
                            size="lg"
                            className="w-full gap-2 shadow-sm font-semibold"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending your message...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 border-t bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <Badge variant="outline" className="px-3 py-1 font-semibold text-primary border-primary/20 bg-primary/5">
                Quick Answers
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq) => (
                <Card key={faq.question} className="border-border/60 bg-card/60 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
