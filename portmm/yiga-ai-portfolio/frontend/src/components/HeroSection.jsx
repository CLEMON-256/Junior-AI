import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-emerald-50 to-cyan-50 py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Full-Stack AI Engineer
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Building end-to-end Machine-Learning models and multi-agent infrastructures with CrewAI, LangGraph, and Microsoft AutoGen, CUDA from code to cloud
          Ready for immediate production impact.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="#chat"
            className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
          >
            Chat with My Agent <ArrowRight size={18} />
          </a>
          <a
            href="#about"
            className="border-2 border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
