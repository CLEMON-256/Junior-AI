export default function SkillsSection() {
  const skills = [
    { name: 'React', category: 'Frontend' },
    { name: 'React Native & Android Studio', category: 'Mobile App Development' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Go', category: 'Backend' },
    { name: 'Gin', category: 'Go Framework' },
    { name: 'Django', category: 'Backend Framework' },
    { name: 'C#', category: 'Backend' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'DevOps & MLOps', category: 'Engineering' },
    { name: 'AI Agents', category: 'AI Engineering' },
    { name: 'PyTorch & TensorFlow', category: 'Machine Learning' },
    { name: 'Computer Vision', category: 'Machine Learning' },
    { name: 'CUDA & GPU Kernels', category: 'Parallel Computing' },
    { name: 'AI & Parallel Computing', category: 'Computing' },
    { name: 'AI Cybersecurity', category: 'Security' },
    { name: 'Cloud Computing', category: 'Infrastructure' },
    { name: 'LangGraph, CrewAI & AutoGen', category: 'AI Frameworks' },
  ];

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Tech Stack</h2>
        <p className="text-gray-600 mb-12">Tools and technologies I work with</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-emerald-500 transition cursor-pointer shadow-sm hover:shadow-md"
            >
              <p className="font-semibold text-gray-900">{skill.name}</p>
              <p className="text-sm text-emerald-600 mt-1">{skill.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
