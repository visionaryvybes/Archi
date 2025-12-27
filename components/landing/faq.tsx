'use client';

import { motion, AnimatePresence } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does the AI interior design work?',
    answer:
      'Our AI analyzes your room photo and understands the spatial layout, existing furniture, and architectural elements. It then applies your chosen design style while preserving the room structure. The process uses Google\'s Gemini 2.0 multimodal AI to generate photorealistic results in under 10 seconds.',
  },
  {
    id: 'faq-2',
    question: 'Can I use Visionary for commercial projects?',
    answer:
      'Absolutely! Pro and Enterprise plans include commercial usage rights. You can use generated images for client presentations, marketing materials, and portfolio showcases. Enterprise customers also get custom licensing options for specific use cases.',
  },
  {
    id: 'faq-3',
    question: 'What image quality and resolution are available?',
    answer:
      'Free users get standard quality at 1024x1024 resolution. Pro users enjoy 4K quality (4096x4096) which is perfect for print materials and high-resolution displays. Enterprise customers can request custom resolutions up to 8K for specialized applications.',
  },
  {
    id: 'faq-4',
    question: 'Is my data secure and private?',
    answer:
      'Yes, privacy is our top priority. All uploaded images are encrypted in transit and at rest. Images are automatically deleted from our servers after 24 hours unless you choose to save them to your project library. We are fully GDPR and CCPA compliant, and we never use your images to train our models without explicit consent.',
  },
  {
    id: 'faq-5',
    question: 'What happens if I exceed my monthly generation limit?',
    answer:
      'If you reach your monthly limit on the Free plan, you can upgrade to Pro for unlimited generations or wait until the next billing cycle. Pro users enjoy truly unlimited generations with no throttling or hidden caps. Enterprise customers get dedicated resources with guaranteed capacity.',
  },
];

function AccordionItem({ item, index }: { item: FAQItem; index: number }) {
  return (
    <Accordion.Item
      value={item.id}
      className="group"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
      >
        <Accordion.Header>
          <Accordion.Trigger className="w-full flex items-center justify-between gap-4 py-6 text-left group-first:pt-0">
            <span className="text-lg font-medium text-white group-hover:text-emerald-50 transition-colors">
              {item.question}
            </span>
            <motion.div
              className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 group-hover:bg-slate-700 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <Plus className="w-4 h-4 text-slate-400 group-data-[state=open]:rotate-45 transition-transform duration-300" />
            </motion.div>
          </Accordion.Trigger>
        </Accordion.Header>

        <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pb-6"
          >
            <p className="text-slate-400 leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        </Accordion.Content>
      </motion.div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
    </Accordion.Item>
  );
}

export function FAQ() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-black" />

      <div className="relative max-w-3xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-slate-400">
            Everything you need to know about Visionary.
          </p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          className="glass rounded-2xl p-6 lg:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion.Root type="single" collapsible className="space-y-0">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} item={faq} index={index} />
            ))}
          </Accordion.Root>
        </motion.div>

        {/* Still have questions */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-slate-400 mb-4">Still have questions?</p>
          <motion.a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gradient-border text-white font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get in touch
          </motion.a>
        </motion.div>
      </div>

      {/* Add the accordion keyframes to the page */}
      <style jsx global>{`
        @keyframes accordion-down {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: var(--radix-accordion-content-height);
            opacity: 1;
          }
        }

        @keyframes accordion-up {
          from {
            height: var(--radix-accordion-content-height);
            opacity: 1;
          }
          to {
            height: 0;
            opacity: 0;
          }
        }

        .animate-accordion-down {
          animation: accordion-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-accordion-up {
          animation: accordion-up 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  );
}

export default FAQ;
