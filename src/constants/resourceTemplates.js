const categoryTemplates = {
  'Mental Health': {
    summary:
      '{{title}} supports emotional wellness with practical strategies you can use during class weeks, exams, and personal stress spikes.',
    steps: [
      'Complete a short intake and choose your preferred support format (in-person or virtual).',
      'Book your first session and define two measurable goals for the next 2-4 weeks.',
      'Follow the weekly reflection plan and track mood, sleep, and stress triggers.',
    ],
    tips: [
      'Pair this with a consistent sleep routine and low-caffeine evenings.',
      'Use the provided grounding techniques before high-pressure classes or presentations.',
      'Reach out early if symptoms worsen instead of waiting for a crisis moment.',
    ],
  },
  Fitness: {
    summary:
      '{{title}} helps you build strength, cardio endurance, and recovery habits with student-friendly routines.',
    steps: [
      'Choose a beginner, intermediate, or advanced routine based on current fitness level.',
      'Schedule 3 focused sessions per week and log effort (easy, moderate, intense).',
      'Review progress weekly and adjust intensity to avoid plateaus or overtraining.',
    ],
    tips: [
      'Hydrate before every session and include light mobility warm-ups.',
      'Focus on consistency first; intensity can scale after week two.',
      'Recover with stretching and sleep to reduce soreness and injury risk.',
    ],
  },
  Nutrition: {
    summary:
      '{{title}} turns nutrition goals into simple daily actions you can sustain on a student budget.',
    steps: [
      'Set one realistic food goal for the week (example: balanced breakfast 4 days).',
      'Use the meal planning checklist to prep snacks and key ingredients in advance.',
      'Track energy levels after meals and refine portions over time.',
    ],
    tips: [
      'Keep protein + fiber snacks available during long study blocks.',
      'Batch-cook once or twice weekly to reduce stress eating.',
      'Prioritize hydration and regular meal timing during exams.',
    ],
  },
  'General Wellness': {
    summary:
      '{{title}} provides a balanced well-being plan across sleep, stress, movement, and study-life rhythm.',
    steps: [
      'Start with a weekly wellness check-in across energy, focus, and recovery.',
      'Pick two habits to improve this month and define when you will do them.',
      'Review your progress every weekend and reset priorities for the next week.',
    ],
    tips: [
      'Small routines beat perfect plans; keep actions short and repeatable.',
      'Use campus support channels early when pressure is building.',
      'Protect recovery time as seriously as study time.',
    ],
  },
}

const fallbackTemplate = categoryTemplates['General Wellness']

const withTitle = (text, title) => text.replace('{{title}}', title || 'This resource')

export const getTemplateDescription = (category, title) => {
  const template = categoryTemplates[category] || fallbackTemplate
  const lines = [
    withTitle(template.summary, title),
    '',
    'Recommended flow:',
    ...template.steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    'Pro tips:',
    ...template.tips.map((t) => `- ${t}`),
  ]
  return lines.join('\n')
}

export const getResourceExperience = (resource) => {
  const template = categoryTemplates[resource?.category] || fallbackTemplate
  return {
    headline: `${resource?.category || 'Wellness'} support plan`,
    summary: withTitle(template.summary, resource?.title),
    steps: template.steps,
    tips: template.tips,
  }
}
