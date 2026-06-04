import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'

Font.registerHyphenationCallback(
  (word) => [word]
)

type PDFReportProps = {
  fullName: string
  scores: Record<string, number>
  insights: string[]
  protocols: any[]
  longevityScore: number
biologicalAge: number
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#020617',
    paddingTop: 36,
    paddingBottom: 46,
    paddingHorizontal: 40,
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Helvetica',
  },

  section: {
    marginBottom: 16,
    padding: 18,
    borderRadius: 18,
    border: '1px solid #1e293b',
    backgroundColor: '#0f172a',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },

 logo: {
  width: 82,
  height: 82,

},

  brand: {
    fontSize: 11,
    color: '#67e8f9',
    letterSpacing: 2,
    marginBottom: 10,
    textTransform: 'uppercase',
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
    lineHeight: 1.3,
  },

  subtitle: {
    color: '#94a3b8',
    lineHeight: 1.7,
    maxWidth: 380,
    fontSize: 11,
  },

  generatedDate: {
    color: '#67e8f9',
    marginTop: 14,
    fontSize: 10,
  },

  grid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },

  metricCard: {
    flex: 1,
    backgroundColor: '#071926',
    border: '1px solid #164e63',
    borderRadius: 16,
    padding: 14,
  },

  metricLabel: {
    color: '#67e8f9',
    fontSize: 10,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 1,
  },

  metricValue: {
    fontSize: 20,
    fontWeight: 700,
  },

  nameValue: {
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.4,
  },

  metricSubtext: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 8,
    lineHeight: 1.6,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 22,
  },

  introBlock: {
    marginBottom: 18,
  },

  introText: {
    color: '#94a3b8',
    lineHeight: 1.7,
    fontSize: 11,
  },

  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  scoreCard: {
    width: '48%',
    marginBottom: 18,
  },

  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  scoreLabel: {
    textTransform: 'capitalize',
    color: '#e2e8f0',
    fontSize: 11,
  },

  scoreValue: {
    color: '#67e8f9',
    fontWeight: 700,
    fontSize: 11,
  },

  progressBackground: {
    height: 10,
    backgroundColor: '#111827',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressFill: {
    height: 10,
    borderRadius: 999,
  },

  insightCard: {
    backgroundColor: '#071926',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    border: '1px solid #164e63',
  },

  insightText: {
    color: '#cbd5e1',
    lineHeight: 1.9,
    fontSize: 11,
  },

  protocolCard: {
    backgroundColor: '#071926',
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
    border: '1px solid #164e63',
  },

  protocolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  protocolTitle: {
    fontSize: 15,
    fontWeight: 700,
  },

  protocolPriority: {
    color: '#67e8f9',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  protocolDescription: {
    color: '#cbd5e1',
    lineHeight: 1.8,
    marginBottom: 14,
    fontSize: 11,
  },

  recommendationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  recommendation: {
    border: '1px solid #164e63',
    backgroundColor: '#020617',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#67e8f9',
    fontSize: 9,
    lineHeight: 1.3,
  },

  privacyCard: {
    backgroundColor: '#071926',
    borderRadius: 16,
    padding: 20,
    border: '1px solid #164e63',
  },

  privacyTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
  },

  privacyText: {
    color: '#94a3b8',
    lineHeight: 1.8,
    fontSize: 10,
    marginBottom: 8,
  },

  footer: {
    marginTop: 24,
    paddingTop: 18,
    borderTop: '1px solid #1e293b',
    color: '#64748b',
    fontSize: 9,
    lineHeight: 1.8,
  },

  footerText: {
    marginTop: 6,
  },

  pageNumber: {
    position: 'absolute',
    bottom: 18,
    right: 40,
    color: '#64748b',
    fontSize: 10,
  },
})

export default function PDFReport({
  fullName,
  scores,
  insights,
  protocols,
  longevityScore,
  biologicalAge,
}: PDFReportProps) {
  const reportDate = new Date().toLocaleString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
  )

   return (
    <Document>
      <Page
        size="A4"
        style={styles.page}
        wrap
      >
        {/* HEADER */}
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.brand}>
                Lonara Labs
              </Text>

              <Text style={styles.title}>
                Premium Longevity Report
              </Text>

              <Text style={styles.subtitle}>
                Advanced biological intelligence,
                recovery optimization and resilience
                analysis powered by the Lonara
                Longevity Intelligence Platform.
              </Text>

              <Text style={styles.generatedDate}>
                Generated on {reportDate}
              </Text>
            </View>

          <Image
            src="/lonara-logo.png"
            style={styles.logo}
            />
          </View>

          <View style={styles.grid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                Vital Index
              </Text>

              <Text style={styles.metricValue}>
                {longevityScore}
              </Text>

              <Text style={styles.metricSubtext}>
                Global biological resilience
                estimation across recovery,
                stress adaptation and metabolic
                performance systems.
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                Biological Age
              </Text>

              <Text style={styles.metricValue}>
                {biologicalAge}
              </Text>

              <Text style={styles.metricSubtext}>
                Estimated biological recovery
                profile relative to chronological
                aging markers.
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>
                Generated For
              </Text>

              <Text style={styles.nameValue}>
                {fullName}
              </Text>

              <Text style={styles.metricSubtext}>
                Confidential individualized
                longevity optimization assessment.
              </Text>
            </View>
          </View>
        </View>

        {/* INTRO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Biological Performance Overview
          </Text>

          <View style={styles.introBlock}>
            <Text style={styles.introText}>
              Lonara evaluates multidimensional
              biological resilience patterns
              including mitochondrial efficiency,
              nervous system regulation,
              inflammatory load, recovery
              capacity, metabolic flexibility and
              long-term longevity optimization
              markers.
            </Text>
          </View>
        </View>

        {/* SCORES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Biological Scores
          </Text>

          <View style={styles.scoresGrid}>
            {Object.entries(scores).map(
              ([label, value]) => (
                <View
                  key={label}
                  style={styles.scoreCard}
                >
                  <View
                    style={styles.scoreHeader}
                  >
                    <Text
                      style={styles.scoreLabel}
                    >
                      {label}
                    </Text>

                    <Text
                      style={styles.scoreValue}
                    >
                      {value}/100
                    </Text>
                  </View>

                  <View
                    style={
                      styles.progressBackground
                    }
                  >
                    <View
                      style={{
                        ...styles.progressFill,

                       backgroundColor:
                     value >= 75
                       ? '#10b981'
                      : value >= 41
                          ? '#f59e0b'
                          : '#ef4444',

                        width: `${Math.max(
                          value,
                          6,
                        )}%`,
                      }}
                    />
                  </View>
                </View>
              ),
            )}
          </View>
        </View>

        {/* INSIGHTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            AI Biological Insights
          </Text>

          {insights.map(
            (insight, index) => (
              <View
                key={index}
                style={styles.insightCard}
              >
                <Text
                  style={styles.insightText}
                >
                  {insight}
                </Text>
              </View>
            ),
          )}
        </View>
</Page>
{/* VISUAL ANALYTICS PAGE */}
<Page
  size="A4"
  style={styles.page}
>
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      Biological Visual Analytics
    </Text>

    <Text style={styles.introText}>
      Advanced visualization of biological
      resilience, recovery dynamics and
      physiological optimization markers.
    </Text>
  </View>

  {/* HEATMAP */}
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>
      Biological Systems Heatmap
    </Text>

    {Object.entries(scores)
      .slice(0, 8)
      .map(([label, value]) => (
        <View
          key={label}
          style={{
            marginBottom: 14,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent:
                'space-between',
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                color: '#e2e8f0',
                textTransform:
                  'capitalize',
              }}
            >
              {label}
            </Text>

            <Text
              style={{
                color:
                  value >= 75
                    ? '#10b981'
                    : value >= 41
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            >
              {value >= 75
                ? 'Optimized'
                : value >= 41
                ? 'Moderate'
                : 'Critical'}
            </Text>
          </View>

          <View
            style={{
              height: 12,
              borderRadius: 999,
              backgroundColor:
                '#111827',
            }}
          >
            <View
              style={{
                height: 12,
                borderRadius: 999,
                width: `${value}%`,
                backgroundColor:
                  value >= 75
                    ? '#10b981'
                    : value >= 41
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            />
          </View>
        </View>
      ))}
  </View>

  {/* BIO AGE */}
<View
  style={{
    ...styles.section,
    padding: 12,
    marginBottom: 8,
  }}
>
    <Text style={styles.sectionTitle}>
      Biological Age Analysis
    </Text>

    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#67e8f9',
        }}
      >
        {biologicalAge}
      </Text>

      <Text
       style={{
  marginTop: 4,
  color: '#94a3b8',
  textAlign: 'center',
  lineHeight: 1.4,
  fontSize: 10,
}}
      >
        Estimated physiological resilience
        suggests optimized biological
        recovery patterns and adaptive
        longevity markers.
      </Text>
    </View>
  </View>
</Page>


<Page
  size="A4"
  style={styles.page}
>


        {/* PROTOCOLS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recommended Protocols
          </Text>

          {protocols.map(
            (protocol, index) => (
              <View
                key={index}
                style={styles.protocolCard}
              >
                <View
                  style={
                    styles.protocolHeader
                  }
                >
                  <Text
                    style={
                      styles.protocolTitle
                    }
                  >
                    {protocol.title}
                  </Text>

                  <Text
                    style={
                      styles.protocolPriority
                    }
                  >
                    {protocol.priority}
                  </Text>
                </View>

                <Text
                  style={
                    styles.protocolDescription
                  }
                >
                  {protocol.description}
                </Text>

                <View
                  style={
                    styles.recommendationContainer
                  }
                >
                  {protocol.recommendations.map(
                    (
                      item: string,
                    ) => (
                      <Text
                        key={item}
                        style={
                          styles.recommendation
                        }
                      >
                        {item}
                      </Text>
                    ),
                  )}
                </View>
              </View>
            ),
          )}
        </View>

        {/* PRIVACY */}
        <View style={styles.section}>
          <View style={styles.privacyCard}>
            <Text style={styles.privacyTitle}>
              Privacy & Data Protection
            </Text>

            <Text style={styles.privacyText}>
              All personal and biological
              information collected through the
              Lonara platform is treated as
              strictly confidential.
            </Text>

            <Text style={styles.privacyText}>
              Your data is never sold, shared or
              disclosed to third parties without
              your explicit consent.
            </Text>

            <Text style={styles.privacyText}>
              Lonara Labs implements
              industry-standard security practices
              to protect all personal health and
              assessment data.
            </Text>

            <Text style={styles.privacyText}>
              This assessment is intended
              exclusively for wellness and
              longevity optimization purposes and
              does not replace professional
              medical advice, diagnosis or
              treatment.
            </Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            Confidential Longevity Intelligence Report
          </Text>

          <Text style={styles.footerText}>
            This report is intended exclusively
            for wellness and longevity
            optimization purposes and does not
            constitute medical diagnosis,
            treatment or clinical care.
          </Text>

          <Text
            style={{
              marginTop: 10,
              color: '#475569',
            }}
          >
            All biological and personal data
            remain strictly confidential and
            protected under Lonara Labs privacy
            standards.
          </Text>

          <Text style={styles.footerText}>
            www.lonaralabs.com    —    All Rights Reserved © Lonara Labs 2026
          </Text>

        </View>

        {/* PAGE NUMBER */}
        <Text
          fixed
          style={styles.pageNumber}
          render={({
            pageNumber,
            totalPages,
          }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  )
}