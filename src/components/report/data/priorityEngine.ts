import {
  STRESS_RISK_THRESHOLD,
  SLEEP_RISK_THRESHOLD,
  RECOVERY_RISK_THRESHOLD,
  INFLAMMATION_RISK_THRESHOLD,
  COGNITION_RISK_THRESHOLD,
  LONGEVITY_RISK_THRESHOLD,
} from '@/lib/scoreThresholds'

export function generatePriorityFocus(
  scores: Record<string, number>,
) {

  const priorities = []

  if (scores.stress <= STRESS_RISK_THRESHOLD) {
    priorities.push({
      title: 'Stress Modulation',
      impact: 'Immediate Attention',
      severity: 'critical'
    })
  }

  if (scores.sleep <= SLEEP_RISK_THRESHOLD) {
    priorities.push({
      title: 'Sleep Optimization',
      impact: 'Immediate Attention',
      severity: 'critical'
    })
  }

  if (scores.recovery <= RECOVERY_RISK_THRESHOLD) {
    priorities.push({
      title: 'Recovery Support',
      impact: 'Optimization Needed',
      severity: 'moderate',
    })
  }

  if (scores.inflammation <= INFLAMMATION_RISK_THRESHOLD) {
    priorities.push({
      title: 'Inflammatory Regulation',
      impact: 'Optimization Needed',
      severity: 'moderate',
    })
  }

  if (scores.cognition <= COGNITION_RISK_THRESHOLD) {
    priorities.push({
      title: 'Cognitive Optimization',
      impact: 'Optimization Needed',
      severity: 'moderate',
    })
  }

  if (scores.longevity <= LONGEVITY_RISK_THRESHOLD) {
    priorities.push({
      title: 'Longevity Resilience',
      impact: 'Immediate Attention',
      severity: 'critical'
    })
  }
if (scores.mobility <= RECOVERY_RISK_THRESHOLD) {
  priorities.push({
    title: 'Mobility Restoration',
    impact: 'Optimization Needed',
    severity: 'moderate',
  })
}
if (scores.social <= STRESS_RISK_THRESHOLD) {
  priorities.push({
    title: 'Psychosocial Resilience',
    impact: 'Optimization Needed',
    severity: 'moderate',
  })
}
if (scores.purpose <= SLEEP_RISK_THRESHOLD) {
  priorities.push({
    title: 'Purpose Alignment',
    impact: 'Optimization Needed',
    severity: 'moderate',
  })
}

if (scores.family <= INFLAMMATION_RISK_THRESHOLD) {
  priorities.push({
    title: 'Familial Risk Mitigation',
    impact: 'Immediate Attention',
    severity: 'critical',
  })
}


  if (priorities.length === 0) {
    priorities.push({
      title: 'Advanced Optimization',
      impact: 'Stable',
       severity: 'low',
    })
  }

  return priorities.slice(0, 3)
}