export function generatePriorityFocus(
  scores: Record<string, number>,
) {

  const priorities = []

  if (scores.stress <= 65) {
    priorities.push({
      title: 'Stress Modulation',
      impact: 'HIGH',
      severity: 'critical'
    })
  }

  if (scores.sleep <= 70) {
    priorities.push({
      title: 'Sleep Optimization',
      impact: 'HIGH',
      severity: 'critical'
    })
  }

  if (scores.recovery <= 70) {
    priorities.push({
      title: 'Recovery Support',
      impact: 'MEDIUM',
      severity: 'moderate',
    })
  }

  if (scores.inflammation <= 65) {
    priorities.push({
      title: 'Inflammatory Regulation',
      impact: 'MEDIUM',
      severity: 'moderate',
    })
  }

  if (scores.cognition <= 65) {
    priorities.push({
      title: 'Cognitive Optimization',
      impact: 'MEDIUM',
      severity: 'moderate',
    })
  }

  if (scores.longevity <= 70) {
    priorities.push({
      title: 'Longevity Resilience',
      impact: 'HIGH',
      severity: 'critical'
    })
  }

  if (priorities.length === 0) {
    priorities.push({
      title: 'Advanced Optimization',
      impact: 'LOW',
       severity: 'low',
    })
  }

  return priorities.slice(0, 3)
}