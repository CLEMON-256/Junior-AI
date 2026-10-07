import { MessageCircle, Phone } from 'lucide-react';
import CodeIcon from '../assets/icons/6589131c-d79e-4698-a540-8206f059bc66.svg';
import WorkIcon from '../assets/icons/82f4a546-751e-4ad8-829c-a3736263371d.svg';
import ChatIcon from '../assets/icons/92eb447a-f25a-47f6-885d-a055ad3527ec.svg';
import MailIcon from '../assets/icons/8ffda7aa-7343-4bbc-8c60-3a08b81a242b.svg';
import PhoneIcon from '../assets/icons/117a7629-2735-489a-918c-dc2b4146c4fa (1).svg';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">About Me</h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/IMG-20260924-WA0001.jpg"
              alt="Yiga Junior"
              className="rounded-xl shadow-lg w-full"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Yiga Junior</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Based in Gayaza, Uganda, I am a full-stack AI engineer specializing in
                end-to-end machine-learning models and multi-agent systems. I use PyTorch,
                TensorFlow, CUDA, and computer vision in my machine-learning work, and build
                multi-agent systems with CrewAI, Microsoft AutoGen, and LangGraph. I also work
                with GPU kernels and integrate AI agents into Django and React applications
                as well as React Native, kotlin mobile apps.
              </p>
              <p className="text-gray-600 leading-relaxed">
                With 74+ GitHub repositories and experience across React, TypeScript, Go with
                Gin, C#, and Django, I build production-ready full-stack solutions with AI
                security and automation in mind. From application logic to cloud-deployed
                pipelines, I help turn complex problems into secure, practical products.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Get in Touch</h4>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <img src={MailIcon} alt="" aria-hidden="true" className="w-5 h-5" />
                  junioryiga91@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <img src={PhoneIcon} alt="" aria-hidden="true" className="w-5 h-5" />
                  +256 793 030 322
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <a aria-label="GitHub" href="https://github.com/CLEMON-256" target="_blank" rel="noreferrer" className="p-3 bg-gray-100 rounded-lg hover:bg-emerald-100 transition">
                <img src={CodeIcon} alt="" aria-hidden="true" className="w-6 h-6" />
              </a>
              <a aria-label="LinkedIn" href="https://www.linkedin.com/feed/" target="_blank" rel="noreferrer" className="p-3 bg-gray-100 rounded-lg hover:bg-emerald-100 transition">
                <img src={WorkIcon} alt="" aria-hidden="true" className="w-6 h-6" />
              </a>
              <a aria-label="Twitter" href="https://x.com/home" target="_blank" rel="noreferrer" className="p-3 bg-gray-100 rounded-lg hover:bg-emerald-100 transition">
                <img src={ChatIcon} alt="" aria-hidden="true" className="w-6 h-6" />
              </a>
              <a aria-label="Email" href="mailto:junioryiga91@gmail.com" className="p-3 bg-gray-100 rounded-lg hover:bg-emerald-100 transition">
                <img src={MailIcon} alt="" aria-hidden="true" className="w-6 h-6" />
              </a>
              <a aria-label="Chat on WhatsApp" href="https://wa.me/256793030322" target="_blank" rel="noreferrer" className="p-3 bg-gray-100 rounded-lg text-emerald-600 hover:bg-emerald-100 transition">
                <span className="relative block w-6 h-6">
                  <MessageCircle size={24} aria-hidden="true" />
                  <Phone size={11} aria-hidden="true" className="absolute left-[7px] top-[7px]" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
