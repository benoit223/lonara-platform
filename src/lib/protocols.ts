import {
  SCORE_THRESHOLD_LOW,
} from '@/lib/scoreThresholds'

type ProtocolIntervention = {
  label: string
}

type ProtocolSystem = {
  title: string
  description: string
  interventions: ProtocolIntervention[]
}

type ProtocolPhase = {
  title: string
  period: string
  objective: string
  strategicFocus: string
  systems: ProtocolSystem[]
}

export function generateProtocols(
  scores: Record<string, number>,
): ProtocolPhase[] {

  const protocols: ProtocolPhase[] = []

  /**
   * SCORES
   */

  const energy =
    scores.energy || 0

  const cognition =
    scores.cognition || 0

  const stress =
    scores.stress || 0

  const inflammation =
    scores.inflammation || 0

  const recovery =
    scores.recovery || 0

  const sleep =
    scores.sleep || 0

  /**
   * MORNING
   */

  protocols.push({

    title:
      'Morning Activation Protocol',

    period:
      'Morning',

    objective:
      energy < SCORE_THRESHOLD_LOW

        ? 'Restore mitochondrial responsiveness, stabilize adaptive energy signaling, and improve morning metabolic efficiency through targeted activation of cellular energy pathways.'

        : 'Maintain metabolic flexibility, cognitive responsiveness, and sustained adaptive energy regulation throughout the morning activation cycle.',

    strategicFocus:
      'Prioritize mitochondrial efficiency, circadian synchronization, cognitive activation, and adaptive hydration support.',

    systems: [

      {
        title:
          'Mitochondrial Activation Sequence',

        description:
          energy < SCORE_THRESHOLD_LOW

            ? 'Support ATP production, mitochondrial signaling pathways, and adaptive cellular energy restoration.'

            : 'Preserve cellular energy efficiency and sustain metabolic responsiveness.',

        interventions: [

          {
            label:
              'CoQ10 mitochondrial support',
          },

          {
            label:
              'PQQ cellular energy activation',
          },

          {
            label:
              'NAD+ restoration support',
          },

          {
            label:
              'Morning electrolyte hydration',
          },
        ],
      },

      {
        title:
          'Neurocognitive Priming',

        description:
          cognition < SCORE_THRESHOLD_LOW

            ? 'Improve neurotransmitter support, cognitive responsiveness, and neurological activation stability.'

            : 'Maintain cognitive clarity, executive function, and sustained neuroadaptive performance.',

        interventions: [

          {
            label:
              'Lion’s Mane neuro-support',
          },

          {
            label:
              'Citicoline cognitive activation',
          },

          {
            label:
              'Morning focus stabilization',
          },
        ],
      },

      {
        title:
          'Circadian Synchronization',

        description:
          'Reinforce circadian rhythm alignment, morning cortisol regulation, and physiological activation timing.',

        interventions: [

          {
            label:
              'Morning sunlight exposure',
          },

          {
            label:
              'Outdoor circadian walk',
          },

          {
            label:
              'Early hydration timing',
          },
        ],
      },
    ],
  })

  /**
   * MIDDAY
   */

  protocols.push({

    title:
      'Midday Regulation Protocol',

    period:
      'Midday',

    objective:
      stress < SCORE_THRESHOLD_LOW

        ? 'Reduce sympathetic overload, stabilize autonomic regulation, and preserve adaptive resilience capacity under cumulative physiological demand.'

        : 'Maintain autonomic equilibrium, sustained cognitive performance, and balanced systemic regulation throughout peak activity exposure.',

    strategicFocus:
      'Support autonomic resilience, inflammatory balance, metabolic stability, and adaptive stress modulation.',

    systems: [

      {
        title:
          'Autonomic Nervous System Regulation',

        description:
          stress < SCORE_THRESHOLD_LOW

            ? 'Reduce excessive sympathetic activation and stabilize stress-response signaling pathways.'

            : 'Maintain autonomic balance and adaptive stress-response efficiency.',

        interventions: [

          {
            label:
              'L-Theanine nervous system regulation',
          },

          {
            label:
              'Ashwagandha adaptive stress support',
          },

          {
            label:
              'Breathwork reset sequence',
          },

          {
            label:
              'Parasympathetic recovery reset',
          },
        ],
      },

      {
        title:
          'Inflammatory Modulation Support',

        description:
          inflammation < SCORE_THRESHOLD_LOW

            ? 'Support inflammatory regulation, cellular defense systems, and oxidative stress recovery.'

            : 'Preserve inflammatory equilibrium and systemic cellular protection.',

        interventions: [

          {
            label:
              'Curcumin inflammatory regulation',
          },

          {
            label:
              'Omega-3 cellular defense support',
          },

          {
            label:
              'Oxidative stress reduction',
          },
        ],
      },

      {
        title:
          'Metabolic Stability Control',

        description:
          'Maintain glucose stability, adaptive metabolic efficiency, and sustained physiological performance output.',

        interventions: [

          {
            label:
              'Protein recovery support',
          },

          {
            label:
              'Electrolyte stabilization',
          },

          {
            label:
              'Circadian movement exposure',
          },
        ],
      },
    ],
  })

  /**
   * EVENING
   */

  protocols.push({

    title:
      'Evening Recovery Protocol',

    period:
      'Evening',

    objective:
      recovery < SCORE_THRESHOLD_LOW

        ? 'Deepen parasympathetic recovery, improve sleep architecture, and enhance overnight regenerative efficiency through systemic restoration support.'

        : 'Maintain restorative recovery stability, regenerative signaling, and overnight physiological repair efficiency.',

    strategicFocus:
      'Optimize parasympathetic recovery, circadian downregulation, overnight regeneration, and sleep recovery architecture.',

    systems: [

      {
        title:
          'Circadian Recovery Optimization',

        description:
          sleep < SCORE_THRESHOLD_LOW

            ? 'Support melatonin signaling, sleep architecture stabilization, and circadian downregulation efficiency.'

            : 'Maintain restorative sleep quality and circadian recovery synchronization.',

        interventions: [

          {
            label:
              'Blue light reduction',
          },

          {
            label:
              'Sleep environment cooling',
          },

          {
            label:
              'Evening nervous system downregulation',
          },

          {
            label:
              'Sleep optimization routine',
          },
        ],
      },

      {
        title:
          'Systemic Regeneration Support',

        description:
          recovery < SCORE_THRESHOLD_LOW

            ? 'Promote overnight cellular repair, recovery signaling, and physiological restoration capacity.'

            : 'Sustain regenerative efficiency and adaptive overnight recovery stability.',

        interventions: [

          {
            label:
              'Magnesium glycinate recovery support',
          },

          {
            label:
              'Apigenin relaxation support',
          },

          {
            label:
              'Glycine sleep recovery support',
          },

          {
            label:
              'Protein recovery optimization',
          },
        ],
      },

      {
        title:
          'Parasympathetic Restoration',

        description:
          'Reduce nighttime physiological stress load and reinforce autonomic recovery depth.',

        interventions: [

          {
            label:
              'Breath-guided recovery transition',
          },

          {
            label:
              'Low stimulation evening environment',
          },

          {
            label:
              'Overnight stress-load reduction',
          },
        ],
      },
    ],
  })

  return protocols
}