import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Image, Font,
} from '@react-pdf/renderer'

Font.registerHyphenationCallback((word) => [word])

// ── TRADUCTIONS PDF ───────────────────────────────────────────────────────────

const PDF_STRINGS: Record<string, Record<string, string | string[]>> = {
  // ── HEADERS ──
  page1_brand:        { en: 'Summary', fr: 'Résumé', es: 'Resumen' },
  page1_title:        { en: 'Executive Longevity Dossier', fr: 'Dossier Exécutif de Longévité', es: 'Dosier Ejecutivo de Longevidad' },
  page1_sub:          { en: 'Biological intelligence assessment — Lonara Platform', fr: 'Évaluation d\'intelligence biologique — Plateforme Lonara', es: 'Evaluación de inteligencia biológica — Plataforma Lonara' },
  page1_generated:    { en: 'Generated', fr: 'Généré le', es: 'Generado el' },
  page1_at:           { en: 'at', fr: 'à', es: 'a las' },
  page1_confidential: { en: 'Confidential', fr: 'Confidentiel', es: 'Confidencial' },
  page1_pagenum:      { en: 'PAGE 1 / 3', fr: 'PAGE 1 / 3', es: 'PÁGINA 1 / 3' },
  page1b_brand:       { en: 'Biological Pattern Analysis', fr: 'Analyse des Patterns Biologiques', es: 'Análisis de Patrones Biológicos' },
  page1b_title:       { en: 'Cross-Domain Signal Detection', fr: 'Détection de Signaux Inter-Domaines', es: 'Detección de Señales Inter-Dominios' },
  page2a_brand:       { en: 'Biological Intelligence', fr: 'Intelligence Biologique', es: 'Inteligencia Biológica' },
  page2a_title:       { en: 'Systemic Analysis', fr: 'Analyse Systémique', es: 'Análisis Sistémico' },
  page2a_sub:         { en: 'Multi-system biological interpretation based on recovery dynamics, stress conductivity, inflammatory load, and adaptive resilience.', fr: 'Interprétation biologique multi-systèmes basée sur la dynamique de récupération, la conductivité du stress, la charge inflammatoire et la résilience adaptative.', es: 'Interpretación biológica multi-sistémica basada en dinámica de recuperación, conductividad del estrés, carga inflamatoria y resiliencia adaptativa.' },
  page2a_pagenum:     { en: 'PAGE 2 / 3', fr: 'PAGE 2 / 3', es: 'PÁGINA 2 / 3' },
  page2b_title:       { en: 'Advanced Biological Signals', fr: 'Signaux Biologiques Avancés', es: 'Señales Biológicas Avanzadas' },
  page2b_analyzed:    { en: 'analyzed · Values calibrated against clinical optimal ranges', fr: 'analysés · Valeurs calibrées par rapport aux plages optimales cliniques', es: 'analizados · Valores calibrados contra rangos óptimos clínicos' },
  page3a_brand:       { en: 'Optimization Protocol', fr: 'Protocole d\'Optimisation', es: 'Protocolo de Optimización' },
  page3a_title:       { en: 'Daily Longevity Ritual', fr: 'Rituel Quotidien de Longévité', es: 'Ritual Diario de Longevidad' },
  page3a_sub:         { en: 'Personalized biological optimization protocol designed to support resilience, recovery, longevity, and systemic balance.', fr: 'Protocole d\'optimisation biologique personnalisé conçu pour soutenir la résilience, la récupération, la longévité et l\'équilibre systémique.', es: 'Protocolo de optimización biológica personalizado diseñado para apoyar la resiliencia, la recuperación, la longevidad y el equilibrio sistémico.' },
  page3a_pagenum:     { en: 'PAGE 3 / 3', fr: 'PAGE 3 / 3', es: 'PÁGINA 3 / 3' },
  page3b_brand:       { en: 'Longevity Roadmap', fr: 'Feuille de Route Longévité', es: 'Hoja de Ruta de Longevidad' },
  page3b_title:       { en: 'Adaptive Biological Evolution', fr: 'Évolution Biologique Adaptative', es: 'Evolución Biológica Adaptativa' },
  page3c_brand:       { en: 'Lonara Labs Protocol', fr: 'Protocole Lonara Labs', es: 'Protocolo Lonara Labs' },
  page3c_title:       { en: 'Longevity Optimization Stack', fr: 'Stack d\'Optimisation Longévité', es: 'Stack de Optimización de Longevidad' },

  // ── LABELS GLOBAUX ──
  report_date:        { en: 'Report Date', fr: 'Date du Rapport', es: 'Fecha del Informe' },
  signal_integrity:   { en: 'Signal Integrity', fr: 'Intégrité du Signal', es: 'Integridad de Señal' },
  profile:            { en: 'Profile', fr: 'Profil', es: 'Perfil' },
  client:             { en: 'Client', fr: 'Client', es: 'Cliente' },
  email:              { en: 'Email', fr: 'Email', es: 'Email' },
  membership:         { en: 'Membership', fr: 'Adhésion', es: 'Membresía' },
  age:                { en: 'Age', fr: 'Âge', es: 'Edad' },
  sex:                { en: 'Sex', fr: 'Sexe', es: 'Sexo' },
  height:             { en: 'Height', fr: 'Taille', es: 'Altura' },
  weight:             { en: 'Weight', fr: 'Poids', es: 'Peso' },
  years:              { en: 'years', fr: 'ans', es: 'años' },
  years_cap:          { en: 'Years', fr: 'Ans', es: 'Años' },

  // ── PAGE 1 ──
  longevity_score:    { en: 'Longevity Score', fr: 'Score de Longévité', es: 'Puntuación de Longevidad' },
  population_ranking: { en: 'Population Ranking', fr: 'Classement Population', es: 'Clasificación Poblacional' },
  top:                { en: 'Top', fr: 'Top', es: 'Top' },
  biological_age:     { en: 'Biological Age', fr: 'Âge Biologique', es: 'Edad Biológica' },
  younger:            { en: 'years younger', fr: 'ans de moins', es: 'años más joven' },
  older:              { en: 'years older', fr: 'ans de plus', es: 'años mayor' },
  bio_signature:      { en: 'Biological Signature', fr: 'Signature Biologique', es: 'Firma Biológica' },
  focus:              { en: 'Focus', fr: 'Focus', es: 'Foco' },
  key_insight:        { en: 'Key Insight', fr: 'Insight Clé', es: 'Perspectiva Clave' },
  primary_priorities: { en: 'Primary Priorities', fr: 'Priorités Principales', es: 'Prioridades Principales' },
  immediate:          { en: 'Immediate', fr: 'Immédiat', es: 'Inmediato' },
  optimize:           { en: 'Optimize', fr: 'Optimiser', es: 'Optimizar' },
  monitor:            { en: 'Monitor', fr: 'Surveiller', es: 'Monitorear' },
  bio_strengths:      { en: 'Biological Strengths', fr: 'Forces Biologiques', es: 'Fortalezas Biológicas' },
  ai_interpretation:  { en: 'Lonara AI Interpretation', fr: 'Interprétation IA Lonara', es: 'Interpretación IA Lonara' },
  optim_axes:         { en: 'Primary optimization axes', fr: 'Axes d\'optimisation principaux', es: 'Ejes de optimización principales' },
  critical_badge:     { en: 'CRITICAL', fr: 'CRITIQUE', es: 'CRÍTICO' },
  warning_badge:      { en: 'WARNING', fr: 'AVERTISSEMENT', es: 'ADVERTENCIA' },
  monitor_badge:      { en: 'MONITOR', fr: 'SURVEILLER', es: 'MONITOREAR' },

  // ── PAGE 1 PILIERS ──
  pillar_activate:    { en: 'ACTIVATE', fr: 'ACTIVER', es: 'ACTIVAR' },
  pillar_balance:     { en: 'BALANCE', fr: 'ÉQUILIBRE', es: 'EQUILIBRIO' },
  pillar_protect:     { en: 'PROTECT', fr: 'PROTÉGER', es: 'PROTEGER' },
  pillar_restore:     { en: 'RESTORE', fr: 'RESTAURER', es: 'RESTAURAR' },
  desc_activate:      { en: 'Energy, cognition and metabolic activation.', fr: 'Énergie, cognition et activation métabolique.', es: 'Energía, cognición y activación metabólica.' },
  desc_balance:       { en: 'Autonomic stability and stress regulation.', fr: 'Stabilité autonome et régulation du stress.', es: 'Estabilidad autónoma y regulación del estrés.' },
  desc_protect:       { en: 'Inflammation and oxidative defense.', fr: 'Inflammation et défense oxydative.', es: 'Inflamación y defensa oxidativa.' },
  desc_restore:       { en: 'Recovery depth and regenerative quality.', fr: 'Profondeur de récupération et qualité régénérative.', es: 'Profundidad de recuperación y calidad regenerativa.' },

  // ── PAGE 1B ──
  risk_projection:    { en: 'Biological Risk Projection', fr: 'Projection de Risque Biologique', es: 'Proyección de Riesgo Biológico' },
  vuln_signals:       { en: 'Adaptive Vulnerability Signals', fr: 'Signaux de Vulnérabilité Adaptative', es: 'Señales de Vulnerabilidad Adaptativa' },
  priority_domains:   { en: 'Priority Domains', fr: 'Domaines Prioritaires', es: 'Dominios Prioritarios' },
  clinical_consult:   { en: 'Clinical Consultation Recommended', fr: 'Consultation Clinique Recommandée', es: 'Consulta Clínica Recomendada' },
  clinical_desc:      { en: 'Given the severity of certain biological signals in your profile, Lonara recommends complementing your optimization protocol with a consultation with one or more of the following specialists:', fr: 'Compte tenu de la gravité de certains signaux biologiques dans votre profil, Lonara recommande de compléter votre protocole d\'optimisation par une consultation avec un ou plusieurs des spécialistes suivants :', es: 'Dada la gravedad de ciertas señales biológicas en su perfil, Lonara recomienda complementar su protocolo de optimización con una consulta con uno o más de los siguientes especialistas:' },
  spec_gp:            { en: 'General Practitioner', fr: 'Médecin Généraliste', es: 'Médico de Cabecera' },
  spec_gp_reason:     { en: 'Analyze critical biological signals detected across systems.', fr: 'Analyser les signaux biologiques critiques détectés dans les systèmes.', es: 'Analizar las señales biológicas críticas detectadas en los sistemas.' },
  spec_sleep:         { en: 'Sleep Medicine Specialist', fr: 'Spécialiste en Médecine du Sommeil', es: 'Especialista en Medicina del Sueño' },
  spec_sleep_reason:  { en: 'Chronic sleep disruption requiring clinical evaluation.', fr: 'Perturbation chronique du sommeil nécessitant une évaluation clinique.', es: 'Perturbación crónica del sueño que requiere evaluación clínica.' },
  spec_psych:         { en: 'Psychologist or Therapist', fr: 'Psychologue ou Thérapeute', es: 'Psicólogo o Terapeuta' },
  spec_psych_reason:  { en: 'Elevated stress and emotional load counseling, adaptive capacity.', fr: 'Counseling pour stress élevé et charge émotionnelle, capacité adaptative.', es: 'Asesoramiento para estrés elevado y carga emocional, capacidad adaptativa.' },
  spec_nutri:         { en: 'Physician or Nutritionist', fr: 'Médecin ou Nutritionniste', es: 'Médico o Nutricionista' },
  spec_nutri_reason:  { en: 'Chronic inflammatory burden requiring investigation.', fr: 'Charge inflammatoire chronique nécessitant une investigation.', es: 'Carga inflamatoria crónica que requiere investigación.' },
  spec_endo:          { en: 'Endocrinologist', fr: 'Endocrinologue', es: 'Endocrinólogo' },
  spec_endo_reason:   { en: 'Possible hormonal imbalance investigation.', fr: 'Investigation d\'un éventuel déséquilibre hormonal.', es: 'Investigación de posible desequilibrio hormonal.' },
  clinical_disclaimer:{ en: 'This report is not a clinical diagnosis. These recommendations are provided as a complement to professional clinical evaluation.', fr: 'Ce rapport n\'est pas un diagnostic clinique. Ces recommandations sont fournies en complément d\'une évaluation clinique professionnelle.', es: 'Este informe no es un diagnóstico clínico. Estas recomendaciones se proporcionan como complemento a la evaluación clínica profesional.' },

  // ── PAGE 2A ──
  age_timeline:       { en: 'Age Timeline', fr: 'Chronologie de l\'Âge', es: 'Línea de Tiempo de Edad' },
  bio_intel:          { en: 'Biological Intelligence', fr: 'Intelligence Biologique', es: 'Inteligencia Biológica' },
  chrono:             { en: 'Chrono', fr: 'Chrono', es: 'Crono' },
  biological:         { en: 'Biological', fr: 'Biologique', es: 'Biológica' },
  optimized:          { en: 'Optimized', fr: 'Optimisé', es: 'Optimizada' },
  current:            { en: 'Current', fr: 'Actuel', es: 'Actual' },
  months6:            { en: '6 months', fr: '6 mois', es: '6 meses' },
  months12:           { en: '12 months', fr: '12 mois', es: '12 meses' },
  bio_delta:          { en: 'Bio Delta', fr: 'Delta Bio', es: 'Delta Bio' },
  potential:          { en: 'Potential', fr: 'Potentiel', es: 'Potencial' },
  domains_label:      { en: 'Biological Domains', fr: 'Domaines Biologiques', es: 'Dominios Biológicos' },
  scores_32:          { en: '32 System Scores', fr: '32 Scores Systémiques', es: '32 Puntuaciones Sistémicas' },
  ai_clinical:        { en: 'AI Clinical Biomarker Intelligence', fr: 'Intelligence Clinique IA sur les Biomarqueurs', es: 'Inteligencia Clínica IA de Biomarcadores' },
  markers_analyzed:   { en: 'markers analyzed', fr: 'marqueurs analysés', es: 'marcadores analizados' },
  traj_label:         { en: 'Longevity Trajectory', fr: 'Trajectoire de Longévité', es: 'Trayectoria de Longevidad' },
  optim_horizon:      { en: 'Optimization Horizon', fr: 'Horizon d\'Optimisation', es: 'Horizonte de Optimización' },
  current_score:      { en: 'Current Score', fr: 'Score Actuel', es: 'Puntuación Actual' },
  bio_age_gain:       { en: 'Bio Age Gain', fr: 'Gain d\'Âge Bio', es: 'Ganancia de Edad Bio' },
  achievable:         { en: 'achievable in 12 months', fr: 'réalisable en 12 mois', es: 'alcanzable en 12 meses' },
  delta:              { en: 'Delta', fr: 'Delta', es: 'Delta' },
  younger_chrono:     { en: 'younger than chrono', fr: 'plus jeune que l\'âge chrono', es: 'más joven que la edad crono' },
  older_chrono:       { en: 'older than chrono', fr: 'plus âgé que l\'âge chrono', es: 'mayor que la edad crono' },
  optimal_label:      { en: 'Optimal', fr: 'Optimal', es: 'Óptimo' },
  good_label:         { en: 'Good', fr: 'Bon', es: 'Bueno' },
  moderate_label:     { en: 'Moderate', fr: 'Modéré', es: 'Moderado' },
  critical_label:     { en: 'Critical', fr: 'Critique', es: 'Crítico' },

  // ── PAGE 2B PANELS ──
  panel_metabolic:    { en: 'Metabolic Panel', fr: 'Panel Métabolique', es: 'Panel Metabólico' },
  panel_hormonal:     { en: 'Hormonal Panel', fr: 'Panel Hormonal', es: 'Panel Hormonal' },
  panel_inflammatory: { en: 'Inflammatory Panel', fr: 'Panel Inflammatoire', es: 'Panel Inflamatorio' },
  panel_epigenetic:   { en: 'Epigenetic Panel', fr: 'Panel Épigénétique', es: 'Panel Epigenético' },
  panel_telomere:     { en: 'Telomere Panel', fr: 'Panel Télomères', es: 'Panel de Telómeros' },
  panel_omics:        { en: 'Multi-Omics Panel', fr: 'Panel Multi-Omiques', es: 'Panel Multi-Ómico' },
  panel_neuro:        { en: 'Neurological Panel', fr: 'Panel Neurologique', es: 'Panel Neurológico' },
  panel_cardio:       { en: 'Cardiovascular Panel', fr: 'Panel Cardiovasculaire', es: 'Panel Cardiovascular' },
  optim_horizon2:     { en: 'Optimization Horizon', fr: 'Horizon d\'Optimisation', es: 'Horizonte de Optimización' },
  longevity_traj:     { en: 'Longevity Trajectory', fr: 'Trajectoire de Longévité', es: 'Trayectoria de Longevidad' },

  // ── PAGE 3A MORNING ──
  period_morning:     { en: 'Morning', fr: 'Matin', es: 'Mañana' },
  period_midday:      { en: 'Midday', fr: 'Midi', es: 'Mediodía' },
  period_evening:     { en: 'Evening', fr: 'Soir', es: 'Tarde-Noche' },
  strategic_focus:    { en: 'Strategic Focus', fr: 'Focus Stratégique', es: 'Enfoque Estratégico' },

  morning_title:      { en: 'Nervous System Activation', fr: 'Activation du Système Nerveux', es: 'Activación del Sistema Nervioso' },
  morning_obj:        { en: 'Begin the day with deliberate nervous system regulation before any stimulation. This sequence primes your autonomic balance for the hours ahead and counteracts chronic sympathetic overdrive.', fr: 'Commencez la journée par une régulation délibérée du système nerveux avant toute stimulation. Cette séquence prépare votre équilibre autonome pour les heures à venir et contrecarre la suractivation sympathique chronique.', es: 'Comience el día con una regulación deliberada del sistema nervioso antes de cualquier estimulación. Esta secuencia prepara su equilibrio autonómico para las horas siguientes y contrarresta la sobreactivación simpática crónica.' },
  morning_focus:      { en: 'Your balance pillar is the primary limiting factor. Morning is your highest-leverage window to establish parasympathetic baseline before cortisol peaks.', fr: 'Votre pilier équilibre est le facteur limitant principal. Le matin est votre fenêtre à plus fort effet de levier pour établir une base parasympathique avant les pics de cortisol.', es: 'Su pilar de equilibrio es el factor limitante principal. La mañana es su ventana de mayor apalancamiento para establecer una línea base parasimpática antes de los picos de cortisol.' },
  morning_s1_title:   { en: 'Circadian Anchor', fr: 'Ancrage Circadien', es: 'Ancla Circadiana' },
  morning_s1_desc:    { en: 'Immediate outdoor light exposure upon waking to synchronize cortisol awakening response and establish circadian timing for the full day.', fr: 'Exposition immédiate à la lumière extérieure au réveil pour synchroniser la réponse cortisolique d\'éveil et établir le timing circadien pour toute la journée.', es: 'Exposición inmediata a la luz exterior al despertar para sincronizar la respuesta de cortisol al despertar y establecer el ritmo circadiano para todo el día.' },
  morning_s2_title:   { en: 'Autonomic Priming', fr: 'Amorçage Autonome', es: 'Preparación Autonómica' },
  morning_s2_desc:    { en: 'Structured breathwork before any stimulant or task activates the prefrontal cortex and dampens amygdala reactivity for 4-6 hours.', fr: 'La respiration structurée avant tout stimulant ou tâche active le cortex préfrontal et atténue la réactivité de l\'amygdale pendant 4 à 6 heures.', es: 'La respiración estructurada antes de cualquier estimulante o tarea activa la corteza prefrontal y reduce la reactividad de la amígdala durante 4-6 horas.' },
  morning_s3_title:   { en: 'Nutritional Foundation', fr: 'Base Nutritionnelle', es: 'Base Nutricional' },
  morning_s3_desc:    { en: 'Front-load protein and healthy fats to stabilize blood glucose and prevent cortisol spikes from hypoglycemia.', fr: 'Privilégiez les protéines et les graisses saines le matin pour stabiliser la glycémie et prévenir les pics de cortisol liés à l\'hypoglycémie.', es: 'Priorice las proteínas y las grasas saludables por la mañana para estabilizar la glucosa en sangre y prevenir los picos de cortisol por hipoglucemia.' },
  morning_items_s1:   { en: ['Morning Sunlight 10-20 min', 'Consistent Wake Time', 'Avoid Screens First 30 min'], fr: ['Lumière Solaire Matinale 10-20 min', 'Heure de Réveil Constante', 'Éviter les Écrans les 30 Premières min'], es: ['Luz Solar Matutina 10-20 min', 'Hora de Despertar Consistente', 'Evitar Pantallas los Primeros 30 min'] },
  morning_items_s2:   { en: ['Box Breathing 4-7-8', 'Cold Shower 90s', 'HRV Check'], fr: ['Respiration Carrée 4-7-8', 'Douche Froide 90s', 'Vérification HRV'], es: ['Respiración en Caja 4-7-8', 'Ducha Fría 90s', 'Control HRV'] },
  morning_items_s3:   { en: ['Protein-First Breakfast', 'Omega-3', 'Avoid High-Glycemic Foods', 'Vitamin D3 + K2'], fr: ['Petit-Déjeuner Protéiné', 'Oméga-3', 'Éviter les Aliments à IG Élevé', 'Vitamine D3 + K2'], es: ['Desayuno Rico en Proteínas', 'Omega-3', 'Evitar Alimentos de Alto IG', 'Vitamina D3 + K2'] },

  // ── PAGE 3A MIDDAY ──
  midday_title:       { en: 'Nervous System Bridge', fr: 'Pont du Système Nerveux', es: 'Puente del Sistema Nervioso' },
  midday_obj:         { en: 'Midday is your critical nervous system checkpoint. After the morning activation sequence, this window determines whether stress accumulates or dissipates. A 15-minute structured reset prevents cortisol from compounding into the afternoon.', fr: 'Le midi est votre point de contrôle critique du système nerveux. Après la séquence d\'activation matinale, cette fenêtre détermine si le stress s\'accumule ou se dissipe. Une réinitialisation structurée de 15 minutes empêche le cortisol de s\'accumuler dans l\'après-midi.', es: 'El mediodía es su punto de control crítico del sistema nervioso. Tras la secuencia de activación matutina, esta ventana determina si el estrés se acumula o se disipa. Un reinicio estructurado de 15 minutos evita que el cortisol se acumule en la tarde.' },
  midday_focus:       { en: 'For your balance profile, midday stress management is non-negotiable. What you do at noon determines your evening recovery quality — and therefore your sleep architecture tonight.', fr: 'Pour votre profil équilibre, la gestion du stress à midi est non négociable. Ce que vous faites à midi détermine la qualité de votre récupération en soirée — et donc l\'architecture de votre sommeil cette nuit.', es: 'Para su perfil de equilibrio, la gestión del estrés al mediodía no es negociable. Lo que haga al mediodía determina la calidad de su recuperación nocturna — y por tanto la arquitectura de su sueño esta noche.' },
  midday_s1_title:    { en: 'Stress Reset Protocol', fr: 'Protocole de Réinitialisation du Stress', es: 'Protocolo de Reinicio del Estrés' },
  midday_s1_desc:     { en: 'A deliberate midday break from cognitive load allows the prefrontal cortex to recover and prevents stress hormones from cascading into the afternoon.', fr: 'Une pause délibérée de la charge cognitive à midi permet au cortex préfrontal de récupérer et prévient la cascade des hormones de stress dans l\'après-midi.', es: 'Una pausa deliberada de la carga cognitiva al mediodía permite que la corteza prefrontal se recupere y evita que las hormonas del estrés se acumulen en la tarde.' },
  midday_s2_title:    { en: 'Nutritional Stability', fr: 'Stabilité Nutritionnelle', es: 'Estabilidad Nutricional' },
  midday_s2_desc:     { en: 'Blood glucose crashes at midday spike cortisol and amplify stress reactivity. Protein-anchored meals prevent this cascade.', fr: 'Les chutes de glycémie à midi font monter le cortisol et amplifient la réactivité au stress. Les repas riches en protéines préviennent cette cascade.', es: 'Las caídas de glucosa en sangre al mediodía elevan el cortisol y amplifican la reactividad al estrés. Las comidas ricas en proteínas previenen esta cascada.' },
  midday_s3_title:    { en: 'Adaptogenic Support', fr: 'Soutien Adaptogène', es: 'Apoyo Adaptogénico' },
  midday_s3_desc:     { en: 'Midday is the optimal second dosing window for adaptogens that modulate the HPA axis and cortisol response.', fr: 'Le midi est la deuxième fenêtre de dosage optimale pour les adaptogènes qui modulent l\'axe HPA et la réponse au cortisol.', es: 'El mediodía es la segunda ventana de dosificación óptima para los adaptógenos que modulan el eje HPA y la respuesta al cortisol.' },
  midday_items_s1:    { en: ['Screen Break 10 min', 'Breathwork 4-7-8', 'Nature Walk if Possible'], fr: ['Pause Écran 10 min', 'Respiration 4-7-8', 'Marche en Nature si Possible'], es: ['Pausa de Pantalla 10 min', 'Respiración 4-7-8', 'Paseo por la Naturaleza si es Posible'] },
  midday_items_s2:    { en: ['Protein-First Lunch', 'Avoid High-Glycemic Foods', 'Magnesium with Meal'], fr: ['Déjeuner Protéiné', 'Éviter les Aliments à IG Élevé', 'Magnésium avec le Repas'], es: ['Almuerzo Rico en Proteínas', 'Evitar Alimentos de Alto IG', 'Magnesio con la Comida'] },
  midday_items_s3:    { en: ['Ashwagandha', 'Rhodiola Rosea', 'L-Theanine', 'Vitamin C'], fr: ['Ashwagandha', 'Rhodiola Rosea', 'L-Théanine', 'Vitamine C'], es: ['Ashwagandha', 'Rhodiola Rosea', 'L-Teanina', 'Vitamina C'] },

  // ── PAGE 3A EVENING ──
  evening_title:      { en: 'Nervous System Downregulation', fr: 'Régulation Descendante du Système Nerveux', es: 'Regulación Descendente del Sistema Nervioso' },
  evening_obj:        { en: 'The evening protocol is your most critical nervous system intervention. After a day of sympathetic activation, this sequence orchestrates the transition to parasympathetic dominance required for deep recovery.', fr: 'Le protocole du soir est votre intervention la plus critique sur le système nerveux. Après une journée d\'activation sympathique, cette séquence orchestre la transition vers la dominance parasympathique nécessaire à une récupération profonde.', es: 'El protocolo nocturno es su intervención más crítica del sistema nervioso. Tras un día de activación simpática, esta secuencia orquesta la transición hacia la dominancia parasimpática necesaria para una recuperación profunda.' },
  evening_focus:      { en: 'For your balance profile, evening is when you have the highest leverage. Every hour of proper downregulation before sleep compounds overnight recovery by 30-40%.', fr: 'Pour votre profil équilibre, le soir est le moment où vous avez le plus grand effet de levier. Chaque heure de régulation appropriée avant le sommeil amplifie la récupération nocturne de 30 à 40 %.', es: 'Para su perfil de equilibrio, la noche es cuando tiene mayor apalancamiento. Cada hora de regulación adecuada antes del sueño potencia la recuperación nocturna en un 30-40%.' },
  evening_s1_title:   { en: 'Stress Clearance', fr: 'Élimination du Stress', es: 'Eliminación del Estrés' },
  evening_s1_desc:    { en: 'Deliberate transition rituals signal the nervous system that the threat phase is over. Without this signal, cortisol remains elevated and disrupts sleep architecture.', fr: 'Les rituels de transition délibérés signalent au système nerveux que la phase de menace est terminée. Sans ce signal, le cortisol reste élevé et perturbe l\'architecture du sommeil.', es: 'Los rituales de transición deliberados señalan al sistema nervioso que la fase de amenaza ha terminado. Sin esta señal, el cortisol permanece elevado y altera la arquitectura del sueño.' },
  evening_s2_title:   { en: 'Sleep Architecture Stack', fr: 'Stack Architecture du Sommeil', es: 'Stack de Arquitectura del Sueño' },
  evening_s2_desc:    { en: 'Targeted supplementation 60-90 minutes before sleep onset to prime GABA, lower core temperature, and prepare for deep sleep phases.', fr: 'Supplémentation ciblée 60 à 90 minutes avant l\'endormissement pour amorcer le GABA, abaisser la température centrale et préparer les phases de sommeil profond.', es: 'Suplementación específica 60-90 minutos antes de dormir para preparar el GABA, reducir la temperatura central y prepararse para las fases de sueño profundo.' },
  evening_s3_title:   { en: 'Recovery Environment', fr: 'Environnement de Récupération', es: 'Entorno de Recuperación' },
  evening_s3_desc:    { en: 'Environmental optimization is as important as supplementation — temperature, darkness and silence directly determine slow-wave sleep depth.', fr: 'L\'optimisation environnementale est aussi importante que la supplémentation — la température, l\'obscurité et le silence déterminent directement la profondeur du sommeil à ondes lentes.', es: 'La optimización ambiental es tan importante como la suplementación — la temperatura, la oscuridad y el silencio determinan directamente la profundidad del sueño de ondas lentas.' },
  evening_items_s1:   { en: ['Digital Cutoff 2h Before Bed', 'Blue Light Glasses', 'Journaling 10 min'], fr: ['Coupure Numérique 2h Avant le Coucher', 'Lunettes Anti-Lumière Bleue', 'Journal Intime 10 min'], es: ['Corte Digital 2h Antes de Dormir', 'Gafas Anti-Luz Azul', 'Diario 10 min'] },
  evening_items_s2:   { en: ['Magnesium Glycinate', 'Apigenin', 'L-Theanine', 'Glycine'], fr: ['Glycinate de Magnésium', 'Apigénine', 'L-Théanine', 'Glycine'], es: ['Glicinato de Magnesio', 'Apigenina', 'L-Teanina', 'Glicina'] },
  evening_items_s3:   { en: ['Room Temperature 65-68°F', 'Complete Darkness', 'White Noise if Needed'], fr: ['Température Chambre 18-20°C', 'Obscurité Totale', 'Bruit Blanc si Nécessaire'], es: ['Temperatura Habitación 18-20°C', 'Oscuridad Total', 'Ruido Blanco si es Necesario'] },

  // ── PAGE 3A MATRIX ──
  matrix_label:       { en: 'Longevity Intelligence Matrix', fr: 'Matrice d\'Intelligence Longévité', es: 'Matriz de Inteligencia de Longevidad' },
  optim_protocol:     { en: 'Optimization Protocol', fr: 'Protocole d\'Optimisation', es: 'Protocolo de Optimización' },
  optim_phase:        { en: 'Optimization Phase', fr: 'Phase d\'Optimisation', es: 'Fase de Optimización' },

  // ── PAGE 3B ROADMAP ──
  roadmap_intro:      { en: 'Your personalized optimization trajectory is built around your specific biological profile — prioritizing', fr: 'Votre trajectoire d\'optimisation personnalisée est construite autour de votre profil biologique spécifique — en priorisant', es: 'Su trayectoria de optimización personalizada está construida alrededor de su perfil biológico específico — priorizando' },
  roadmap_intro2:     { en: 'system restoration as the primary lever, with progressive expansion across all four pillars over 12 months.', fr: 'la restauration du système comme levier principal, avec une expansion progressive sur les quatre piliers sur 12 mois.', es: 'la restauración del sistema como palanca principal, con expansión progresiva en los cuatro pilares durante 12 meses.' },
  r30_time:           { en: '30 DAYS', fr: '30 JOURS', es: '30 DÍAS' },
  r30_title:          { en: 'Foundation Stabilization', fr: 'Stabilisation des Fondations', es: 'Estabilización de Fundamentos' },
  r30_systems_label:  { en: 'Systems', fr: 'Systèmes', es: 'Sistemas' },
  r30_metrics_label:  { en: 'Metrics', fr: 'Métriques', es: 'Métricas' },
  r30_interventions:  { en: 'Key Interventions', fr: 'Interventions Clés', es: 'Intervenciones Clave' },
  r90_time:           { en: '90 DAYS', fr: '90 JOURS', es: '90 DÍAS' },
  r90_title:          { en: 'Adaptive Restoration', fr: 'Restauration Adaptative', es: 'Restauración Adaptativa' },
  r6m_time:           { en: '6 MONTHS', fr: '6 MOIS', es: '6 MESES' },
  r6m_title:          { en: 'Systemic Optimization', fr: 'Optimisation Systémique', es: 'Optimización Sistémica' },
  r12m_time:          { en: '12 MONTHS', fr: '12 MOIS', es: '12 MESES' },
  r12m_title:         { en: 'Longevity Expansion', fr: 'Expansion de la Longévité', es: 'Expansión de la Longevidad' },
  next_step:          { en: '→', fr: '→', es: '→' },
  stabilization:      { en: 'Stabilization', fr: 'Stabilisation', es: 'Estabilización' },
  recovery_l:         { en: 'Recovery', fr: 'Récupération', es: 'Recuperación' },
  restoration:        { en: 'Restoration', fr: 'Restauration', es: 'Restauración' },
  optimization_l:     { en: 'Optimization', fr: 'Optimisation', es: 'Optimización' },
  enhancement:        { en: 'Enhancement', fr: 'Amélioration', es: 'Mejora' },
  regulation:         { en: 'Regulation', fr: 'Régulation', es: 'Regulación' },
  autonomic_flex:     { en: 'Autonomic Flexibility', fr: 'Flexibilité Autonome', es: 'Flexibilidad Autonómica' },
  recovery_sync:      { en: 'Recovery Synchronization', fr: 'Synchronisation de la Récupération', es: 'Sincronización de la Recuperación' },
  cellular_res:       { en: 'Cellular Resilience', fr: 'Résilience Cellulaire', es: 'Resiliencia Celular' },
  senolytic:          { en: 'Senolytic Protocols', fr: 'Protocoles Sénolytiques', es: 'Protocolos Senolíticos' },
  mastery:            { en: 'Mastery', fr: 'Maîtrise', es: 'Maestría' },
  bio_age_abbr:       { en: 'Bio Age', fr: 'Âge Bio', es: 'Edad Bio' },
  hormonal_bal:       { en: 'Hormonal Balance', fr: 'Équilibre Hormonal', es: 'Equilibrio Hormonal' },
  foundation_complete:{ en: 'Foundation Complete — Continuous optimization', fr: 'Fondation Complète — Optimisation continue', es: 'Fundamento Completo — Optimización continua' },
  unlocks:            { en: 'Unlocks', fr: 'Débloque', es: 'Desbloquea' },
  vitality:           { en: 'Vitality', fr: 'Vitalité', es: 'Vitalidad' },
  resilience_l:       { en: 'Resilience', fr: 'Résilience', es: 'Resiliencia' },
  performance_l:      { en: 'Performance', fr: 'Performance', es: 'Rendimiento' },

  // ── PAGE 3C ──
  core_stack:         { en: 'Core Longevity Stack', fr: 'Stack Longévité de Base', es: 'Stack de Longevidad Central' },
  coming_soon:        { en: 'Product launch coming soon — Our precision supplementation protocol range is being finalized.', fr: 'Lancement produit bientôt — Notre gamme de protocoles de supplémentation de précision est en cours de finalisation.', es: 'Lanzamiento de productos próximamente — Nuestra gama de protocolos de suplementación de precisión está siendo finalizada.' },
  no_products:        { en: 'Protocol products will be listed here once available.', fr: 'Les produits du protocole seront listés ici une fois disponibles.', es: 'Los productos del protocolo se listarán aquí una vez disponibles.' },
  cumulative:         { en: 'Cumulative Intake Analysis', fr: 'Analyse d\'Apport Cumulatif', es: 'Análisis de Ingesta Acumulativa' },
  daily_overlap:      { en: 'Daily Ingredient Overlap', fr: 'Chevauchement d\'Ingrédients Quotidien', es: 'Superposición Diaria de Ingredientes' },
  overlap_note:       { en: 'Based on Core Longevity Stack. Selecting an alternative product may affect cumulative totals below.', fr: 'Basé sur le Stack Longévité de Base. La sélection d\'un produit alternatif peut affecter les totaux cumulatifs ci-dessous.', es: 'Basado en el Stack de Longevidad Central. Seleccionar un producto alternativo puede afectar los totales acumulativos.' },
  ingredient:         { en: 'Ingredient', fr: 'Ingrédient', es: 'Ingrediente' },
  intake:             { en: 'Intake', fr: 'Apport', es: 'Ingesta' },
  col_optimal:        { en: 'Optimal', fr: 'Optimal', es: 'Óptimo' },
  col_status:         { en: 'Status', fr: 'Statut', es: 'Estado' },
  status_limit:       { en: 'LIMIT', fr: 'LIMITE', es: 'LÍMITE' },
  status_high:        { en: 'HIGH', fr: 'ÉLEVÉ', es: 'ALTO' },
  status_elevated:    { en: 'ELEVATED', fr: 'ÉLEVÉ', es: 'ELEVADO' },
  status_optimal:     { en: 'OPTIMAL', fr: 'OPTIMAL', es: 'ÓPTIMO' },
  exec_synthesis:     { en: 'Executive Synthesis', fr: 'Synthèse Exécutive', es: 'Síntesis Ejecutiva' },
  confidentiality:    { en: 'Confidentiality', fr: 'Confidentialité', es: 'Confidencialidad' },
  conf_p1:            { en: 'All personal and biological information contained within this report is generated using encrypted analytical systems and confidential computational methodologies.', fr: 'Toutes les informations personnelles et biologiques contenues dans ce rapport sont générées à l\'aide de systèmes analytiques chiffrés et de méthodologies computationnelles confidentielles.', es: 'Toda la información personal y biológica contenida en este informe se genera mediante sistemas analíticos encriptados y metodologías computacionales confidenciales.' },
  conf_p2:            { en: 'Lonara does not sell, distribute, or share identifiable biological information with external entities without explicit user authorization.', fr: 'Lonara ne vend, ne distribue ni ne partage d\'informations biologiques identifiables avec des entités externes sans autorisation explicite de l\'utilisateur.', es: 'Lonara no vende, distribuye ni comparte información biológica identificable con entidades externas sin autorización explícita del usuario.' },
  conf_p3:            { en: 'Data may be utilized anonymously to improve adaptive modeling systems, AI interpretation engines, and longitudinal optimization frameworks.', fr: 'Les données peuvent être utilisées de manière anonyme pour améliorer les systèmes de modélisation adaptative, les moteurs d\'interprétation IA et les cadres d\'optimisation longitudinale.', es: 'Los datos pueden utilizarse de forma anónima para mejorar los sistemas de modelado adaptativo, los motores de interpretación de IA y los marcos de optimización longitudinal.' },
  disclaimer:         { en: 'Disclaimer', fr: 'Avertissement', es: 'Aviso Legal' },
  disc_p1:            { en: 'This report is intended exclusively for educational, wellness, and optimization purposes and does not constitute medical diagnosis, treatment, or clinical healthcare services.', fr: 'Ce rapport est destiné exclusivement à des fins éducatives, de bien-être et d\'optimisation et ne constitue pas un diagnostic médical, un traitement ou des services de soins de santé cliniques.', es: 'Este informe está destinado exclusivamente a fines educativos, de bienestar y optimización y no constituye diagnóstico médico, tratamiento ni servicios de atención sanitaria clínica.' },
  disc_p2:            { en: 'Users should consult a qualified physician or healthcare professional before implementing any nutritional, supplemental, recovery, or lifestyle interventions discussed in this report.', fr: 'Les utilisateurs doivent consulter un médecin qualifié ou un professionnel de la santé avant de mettre en œuvre les interventions nutritionnelles, supplémentaires, de récupération ou de style de vie abordées dans ce rapport.', es: 'Los usuarios deben consultar a un médico calificado o profesional de la salud antes de implementar cualquier intervención nutricional, de suplementación, recuperación o estilo de vida discutida en este informe.' },
  disc_p3:            { en: 'Lonara assumes no liability for decisions, actions, or outcomes resulting from the use or interpretation of this report.', fr: 'Lonara n\'assume aucune responsabilité pour les décisions, actions ou résultats résultant de l\'utilisation ou de l\'interprétation de ce rapport.', es: 'Lonara no asume ninguna responsabilidad por decisiones, acciones o resultados derivados del uso o interpretación de este informe.' },
  copyright:          { en: '© 2026 Lonara Labs — All Rights Reserved', fr: '© 2026 Lonara Labs — Tous Droits Réservés', es: '© 2026 Lonara Labs — Todos los Derechos Reservados' },
  proprietary:        { en: 'Proprietary Biological Intelligence System', fr: 'Système d\'Intelligence Biologique Propriétaire', es: 'Sistema de Inteligencia Biológica Propietario' },
  generated_through:  { en: 'Generated through adaptive Lonara longevity scoring.', fr: 'Généré via le scoring de longévité adaptatif Lonara.', es: 'Generado a través del sistema de puntuación de longevidad adaptativo de Lonara.' },

  // ── FOOTERS ──
  footer_p1:          { en: 'Lonara Labs — Executive Longevity Dossier — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Dossier Exécutif de Longévité — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Dosier Ejecutivo de Longevidad — Confidencial — www.lonaralabs.com' },
  footer_p1b:         { en: 'Lonara Labs — Biological Pattern Analysis — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Analyse des Patterns Biologiques — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Análisis de Patrones Biológicos — Confidencial — www.lonaralabs.com' },
  footer_p2a:         { en: 'Lonara Labs — Biological Intelligence — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Intelligence Biologique — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Inteligencia Biológica — Confidencial — www.lonaralabs.com' },
  footer_p2b:         { en: 'Lonara Labs — Advanced Biological Signals — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Signaux Biologiques Avancés — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Señales Biológicas Avanzadas — Confidencial — www.lonaralabs.com' },
  footer_p3a:         { en: 'Lonara Labs — Daily Longevity Ritual — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Rituel Quotidien de Longévité — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Ritual Diario de Longevidad — Confidencial — www.lonaralabs.com' },
  footer_p3b:         { en: 'Lonara Labs — Longevity Roadmap — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Feuille de Route Longévité — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Hoja de Ruta de Longevidad — Confidencial — www.lonaralabs.com' },
  footer_p3c:         { en: 'Lonara Labs — Longevity Optimization Stack — Confidential — www.lonaralabs.com', fr: 'Lonara Labs — Stack d\'Optimisation Longévité — Confidentiel — www.lonaralabs.com', es: 'Lonara Labs — Stack de Optimización de Longevidad — Confidencial — www.lonaralabs.com' },

impact_immediate:   { en: 'Immediate Attention', fr: 'Attention Immédiate', es: 'Atención Inmediata' },
  impact_optimization:{ en: 'Optimization Needed', fr: 'Optimisation Requise', es: 'Optimización Requerida' },
  impact_stable:      { en: 'Stable',              fr: 'Stable',             es: 'Estable' },
  impact_intelligent: { en: 'Intelligent Attention',fr: 'Attention Intelligente', es: 'Atención Inteligente' },
sex_male:           { en: 'Male',   fr: 'Masculin', es: 'Masculino' },
  sex_female:         { en: 'Female', fr: 'Féminin',  es: 'Femenino' },
  sex_other:          { en: 'Other',  fr: 'Autre',    es: 'Otro' },


  // ── ROADMAP INTERVENTIONS ──
  r30_inter: { en: ['Consistent Sleep Schedule', 'Morning Sunlight Protocol', 'Breathwork Daily', 'Protein Optimization', 'Magnesium Glycinate'], fr: ['Programme de Sommeil Constant', 'Protocole Lumière Matinale', 'Respiration Quotidienne', 'Optimisation Protéique', 'Glycinate de Magnésium'], es: ['Horario de Sueño Consistente', 'Protocolo de Luz Matutina', 'Respiración Diaria', 'Optimización de Proteínas', 'Glicinato de Magnesio'] },
  r90_inter: { en: ['Zone 2 Cardio 3x/week', 'Cold Exposure Protocol', 'Creatine + CoQ10', 'Omega-3 Optimization', 'Sleep Architecture'], fr: ['Cardio Zone 2 3x/semaine', 'Protocole Exposition au Froid', 'Créatine + CoQ10', 'Optimisation Oméga-3', 'Architecture du Sommeil'], es: ['Cardio Zona 2 3x/semana', 'Protocolo de Exposición al Frío', 'Creatina + CoQ10', 'Optimización Omega-3', 'Arquitectura del Sueño'] },
  r6m_inter: { en: ['Curcumin + Piperine', 'Sauna Protocol', 'Intermittent Fasting', 'Advanced Supplementation', 'Biomarker Tracking'], fr: ['Curcumine + Pipérine', 'Protocole Sauna', 'Jeûne Intermittent', 'Supplémentation Avancée', 'Suivi des Biomarqueurs'], es: ['Curcumina + Piperina', 'Protocolo Sauna', 'Ayuno Intermitente', 'Suplementación Avanzada', 'Seguimiento de Biomarcadores'] },
  r12m_inter: { en: ['NMN/NR Protocol', 'Rapamycin Micro-dosing Research', 'Epigenetic Tracking', 'Longevity Biomarkers', 'Precision Supplementation'], fr: ['Protocole NMN/NR', 'Recherche Micro-dosage Rapamycine', 'Suivi Épigénétique', 'Biomarqueurs de Longévité', 'Supplémentation de Précision'], es: ['Protocolo NMN/NR', 'Investigación Micro-dosificación Rapamicina', 'Seguimiento Epigenético', 'Biomarcadores de Longevidad', 'Suplementación de Precisión'] },
}

function tr(key: string, locale: string): string {
  const entry = PDF_STRINGS[key]
  if (!entry) return key
  const val = entry[locale] ?? entry['en'] ?? key
  return Array.isArray(val) ? val.join(', ') : val as string
}

function tra(key: string, locale: string): string[] {
  const entry = PDF_STRINGS[key]
  if (!entry) return []
  const val = entry[locale] ?? entry['en']
  return Array.isArray(val) ? val as unknown as string[] : []
}

export type PDFReportProps = {
  fullName: string
  scores: Record<string, number>
  insights: string[]
  protocols: any[]
  longevityScore: number
  biologicalAge: number
  report?: any
  variant?: 'bw' | 'color'
  tier?: string
  showPage1?: boolean
  showPage2?: boolean
  showPage3?: boolean
  logoPath?: string
  watermarkPath?: string
  locale?: string
}

// ── PALETTES SOLIDES ──────────────────────────────────────────────────────────

const C = {
  // Fonds
  bgPage:       '#020617',
  bgCard:       '#07111D',
  bgCardDeep:   '#0D1829',
  bgCritical:   '#1A0509',
  bgWarning:    '#1A1000',
  bgGood:       '#051209',
  bgBlue:       '#050F1A',
  bgGold:       '#120E03',
  // Bordures
  borderNormal: '#1E3A5F',
  borderGold:   '#C7AC60',
  borderCrit:   '#7A1528',
  borderWarn:   '#7A4A00',
  borderGood:   '#1A5C2E',
  borderBlue:   '#1E4A8A',
  // Textes
  text:         '#EAE4D5',
  textMuted:    '#94A3B8',
  textLight:    '#64748B',
  // Accents
  gold:         '#C7AC60',
  goldLight:    '#E7D19A',
  blue:         '#5C96D8',
  good:         '#4ADE80',
  moderate:     '#FF9F43',
  critical:     '#FF4D6D',
  // Piliers
  activate:     '#7EE2A8',
  balance:      '#5C96D8',
  protect:      '#FF9F43',
  restore:      '#C7AC60',
}

const BW = {
  bgPage:       '#FFFFFF',
  bgCard:       '#F7F7F7',
  bgCardDeep:   '#EFEFEF',
  bgCritical:   '#FFF5F5',
  bgWarning:    '#FFFAF0',
  bgGood:       '#F0FFF5',
  bgBlue:       '#F0F5FF',
  bgGold:       '#FFFDF0',
  borderNormal: '#DEDEDE',
  borderGold:   '#BBBBBB',
  borderCrit:   '#FFAAAA',
  borderWarn:   '#FFCC88',
  borderGood:   '#88DDAA',
  borderBlue:   '#88AADD',
  text:         '#111111',
  textMuted:    '#555555',
  textLight:    '#888888',
  gold:         '#5A4A1A',
  goldLight:    '#7A6A2A',
  blue:         '#1A3A6B',
  good:         '#1A6B35',
  moderate:     '#8A4E00',
  critical:     '#8B1A1A',
  activate:     '#1A6B35',
  balance:      '#1A3A6B',
  protect:      '#8A4E00',
  restore:      '#5A4A1A',
}

function p(v: 'bw' | 'color') { return v === 'color' ? C : BW }

function scoreColor(val: number, v: 'bw' | 'color') {
  const pal = p(v)
  return val >= 75 ? pal.good : val >= 45 ? pal.moderate : pal.critical
}

function scoreBg(val: number, v: 'bw' | 'color') {
  if (v === 'bw') return val >= 75 ? BW.bgGood : val >= 45 ? BW.bgWarning : BW.bgCritical
  return val >= 75 ? C.bgGood : val >= 45 ? C.bgWarning : C.bgCritical
}

function scoreBorder(val: number, v: 'bw' | 'color') {
  if (v === 'bw') return val >= 75 ? BW.borderGood : val >= 45 ? BW.borderWarn : BW.borderCrit
  return val >= 75 ? C.borderGood : val >= 45 ? C.borderWarn : C.borderCrit
}

function pillarCol(key: string, v: 'bw' | 'color') {
  const pal = p(v)
  const map: Record<string, { text: string; border: string; bg: string }> = {
    activate: { text: pal.activate, border: v === 'color' ? '#1A5C35' : BW.borderGood, bg: v === 'color' ? '#051209' : BW.bgGood },
    balance:  { text: pal.balance,  border: v === 'color' ? C.borderBlue : BW.borderBlue, bg: v === 'color' ? C.bgBlue : BW.bgBlue },
    protect:  { text: pal.protect,  border: v === 'color' ? C.borderWarn : BW.borderWarn, bg: v === 'color' ? C.bgWarning : BW.bgWarning },
    restore:  { text: pal.restore,  border: v === 'color' ? '#3D2E0A' : BW.borderGold, bg: v === 'color' ? C.bgGold : BW.bgGold },
  }
  return map[key] ?? { text: pal.gold, border: pal.borderNormal, bg: pal.bgCard }
}

const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

const ARCHETYPE_NAMES_FR: Record<string, string> = {
  'archetype_longevity_optimized': 'Longévité Optimisée',
  'archetype_high_performer_nervous': 'Haute Performance Sous Pression Nerveuse',
  'archetype_exhausted_under_regenerating': 'Épuisé et Sous-Régénéré',
  'archetype_neuro_regenerative_collapse': 'Effondrement Neuro-Régénératif',
  'archetype_performing_through_inflammation': 'Performance Malgré l\'Inflammation',
  'archetype_biologically_vulnerable': 'Biologiquement Vulnérable',
  'archetype_critical_biological_state': 'État Biologique Critique',
  'archetype_resilient_but_inflamed': 'Résilient mais Enflammé',
  'archetype_strong_recovery_low_output': 'Forte Récupération, Faible Rendement',
  'archetype_balanced_optimizer': 'Optimiseur Équilibré',
}
const ARCHETYPE_NAMES_ES: Record<string, string> = {
  'archetype_longevity_optimized': 'Longevidad Optimizada',
  'archetype_high_performer_nervous': 'Alto Rendimiento Bajo Presión Nerviosa',
  'archetype_exhausted_under_regenerating': 'Agotado y Sub-Regenerado',
  'archetype_neuro_regenerative_collapse': 'Colapso Neuro-Regenerativo',
  'archetype_performing_through_inflammation': 'Rendimiento a Pesar de la Inflamación',
  'archetype_biologically_vulnerable': 'Biológicamente Vulnerable',
  'archetype_critical_biological_state': 'Estado Biológico Crítico',
  'archetype_resilient_but_inflamed': 'Resiliente pero Inflamado',
  'archetype_strong_recovery_low_output': 'Fuerte Recuperación, Bajo Rendimiento',
  'archetype_balanced_optimizer': 'Optimizador Equilibrado',
}
const ARCHETYPE_DESCS_FR: Record<string, string> = {
  'archetype_longevity_optimized_desc': 'Les quatre piliers biologiques fonctionnent à haute efficacité. Vous représentez le niveau supérieur de l\'optimisation biologique.',
  'archetype_high_performer_nervous_desc': 'Fort rendement physique mais système autonome surchargé. La performance n\'est durable qu\'avec un soutien immédiat du système nerveux.',
  'archetype_exhausted_under_regenerating_desc': 'La génération d\'énergie et la récupération sont toutes deux critiquement compromises. Le corps est dans une spirale d\'épuisement qui nécessite une intervention urgente.',
  'archetype_neuro_regenerative_collapse_desc': 'La dérégulation du système nerveux empêche une récupération adéquate. Sommeil, stress et régénération forment une boucle de rétroaction destructrice.',
  'archetype_performing_through_inflammation_desc': 'Maintien des performances malgré une charge inflammatoire significative. Les dommages cellulaires s\'accumulent silencieusement sous la performance.',
  'archetype_biologically_vulnerable_desc': 'La protection et la régénération sont toutes deux compromises. Le corps manque à la fois des défenses et de la capacité de récupération pour maintenir une santé à long terme.',
  'archetype_critical_biological_state_desc': 'Au moins un pilier a atteint un seuil critique. Une intervention structurée immédiate est essentielle pour prévenir un déclin biologique supplémentaire.',
  'archetype_resilient_but_inflamed_desc': 'Bonne énergie et équilibre mental, mais la charge inflammatoire est la menace cachée pour la vitalité à long terme et l\'âge biologique.',
  'archetype_strong_recovery_low_output_desc': 'Excellente capacité régénérative mais la génération d\'énergie est sous-performante. Le potentiel de récupération est là — l\'activation est la clé manquante.',
  'archetype_balanced_optimizer_desc': 'Aucun déficit critique dans aucun pilier. Un profil biologique équilibré avec des voies claires pour une optimisation ciblée.',
}
const ARCHETYPE_DESCS_ES: Record<string, string> = {
  'archetype_longevity_optimized_desc': 'Los cuatro pilares biológicos funcionan con alta eficiencia. Representa el nivel superior de optimización biológica.',
  'archetype_high_performer_nervous_desc': 'Fuerte rendimiento físico pero sistema autónomo sobrecargado. El rendimiento solo es sostenible con soporte inmediato del sistema nervioso.',
  'archetype_exhausted_under_regenerating_desc': 'La generación de energía y la recuperación están críticamente comprometidas. El cuerpo está en una espiral de agotamiento que requiere intervención urgente.',
  'archetype_neuro_regenerative_collapse_desc': 'La desregulación del sistema nervioso impide una recuperación adecuada. Sueño, estrés y regeneración forman un bucle de retroalimentación destructivo.',
  'archetype_performing_through_inflammation_desc': 'Mantenimiento del rendimiento a pesar de una carga inflamatoria significativa. El daño celular se acumula silenciosamente bajo el rendimiento.',
  'archetype_biologically_vulnerable_desc': 'Tanto la protección como la regeneración están comprometidas. El cuerpo carece de defensas y capacidad de recuperación para mantener la salud a largo plazo.',
  'archetype_critical_biological_state_desc': 'Al menos un pilar ha alcanzado un umbral crítico. La intervención estructurada inmediata es esencial para prevenir un mayor declive biológico.',
  'archetype_resilient_but_inflamed_desc': 'Buena energía y equilibrio mental, pero la carga inflamatoria es la amenaza oculta para la vitalidad a largo plazo y la edad biológica.',
  'archetype_strong_recovery_low_output_desc': 'Excelente capacidad regenerativa pero la generación de energía está por debajo. El potencial de recuperación está ahí — la activación es la clave que falta.',
  'archetype_balanced_optimizer_desc': 'Sin déficits críticos en ningún pilar. Un perfil biológico equilibrado con caminos claros para una optimización específica.',
}


const ARCHETYPE_NAMES: Record<string, string> = {
  'archetype_exhausted_under_regenerating': 'Exhausted and Under-Regenerating',
  'archetype_longevity_optimized': 'Longevity Optimized',
  'archetype_high_performer_nervous': 'High Performer Under Nervous Pressure',
  'archetype_neuro_regenerative_collapse': 'Neuro-Regenerative Collapse',
  'archetype_performing_through_inflammation': 'Performing Through Inflammation',
  'archetype_biologically_vulnerable': 'Biologically Vulnerable',
  'archetype_critical_biological_state': 'Critical Biological State',
  'archetype_resilient_but_inflamed': 'Resilient but Inflamed',
  'archetype_strong_recovery_low_output': 'Strong Recovery, Low Output',
  'archetype_balanced_optimizer': 'Balanced Optimizer',
}

const ARCHETYPE_DESCS: Record<string, string> = {
  'archetype_exhausted_under_regenerating_desc': 'Both energy generation and recovery are critically compromised. The body is in a depletion spiral that requires urgent intervention.',
  'archetype_longevity_optimized_desc': 'All four biological pillars operating at high efficiency. You represent the top tier of biological optimization.',
  'archetype_high_performer_nervous_desc': 'Strong physical output but autonomic system overloaded. Performance is sustainable only with immediate nervous system support.',
  'archetype_neuro_regenerative_collapse_desc': 'Nervous system dysregulation is preventing adequate recovery. Sleep, stress and regeneration form a destructive feedback loop.',
  'archetype_performing_through_inflammation_desc': 'Maintaining output despite significant inflammatory burden. Cellular damage is accumulating silently beneath the performance.',
  'archetype_biologically_vulnerable_desc': 'Both protection and regeneration are compromised. The body lacks both the defenses and the recovery capacity to maintain long-term health.',
  'archetype_critical_biological_state_desc': 'At least one pillar has reached a critical threshold. Immediate structured intervention is essential to prevent further biological decline.',
  'archetype_resilient_but_inflamed_desc': 'Good energy and mental balance, but inflammatory burden is the hidden threat to long-term vitality and biological age.',
  'archetype_strong_recovery_low_output_desc': 'Excellent regenerative capacity but energy generation is underperforming. Recovery potential is there — activation is the missing key.',
  'archetype_balanced_optimizer_desc': 'No critical deficits across any pillar. A well-rounded biological profile with clear pathways for targeted optimization.',
}

function resolveArchetypeName(key: string, locale?: string) {
  if (locale === 'fr') return ARCHETYPE_NAMES_FR[key] ?? ARCHETYPE_NAMES[key] ?? cap(key.replace('archetype_', '').replace(/_/g, ' '))
  if (locale === 'es') return ARCHETYPE_NAMES_ES[key] ?? ARCHETYPE_NAMES[key] ?? cap(key.replace('archetype_', '').replace(/_/g, ' '))
  return ARCHETYPE_NAMES[key] ?? cap(key.replace('archetype_', '').replace(/_/g, ' '))
}
function resolveArchetypeDesc(key: string, locale?: string) {
  if (locale === 'fr') return ARCHETYPE_DESCS_FR[key] ?? ARCHETYPE_DESCS[key] ?? key
  if (locale === 'es') return ARCHETYPE_DESCS_ES[key] ?? ARCHETYPE_DESCS[key] ?? key
  return ARCHETYPE_DESCS[key] ?? key
}

const PRIORITY_LABELS: Record<string, Record<string, string>> = {
  priority_sleep:          { en: 'Sleep Quality',         fr: 'Qualité du Sommeil',       es: 'Calidad del Sueño' },
  priority_stress:         { en: 'Stress Regulation',     fr: 'Régulation du Stress',     es: 'Regulación del Estrés' },
  priority_energy:         { en: 'Energy Production',     fr: 'Production d\'Énergie',    es: 'Producción de Energía' },
  priority_inflammation:   { en: 'Inflammation Load',     fr: 'Charge Inflammatoire',     es: 'Carga Inflamatoria' },
  priority_recovery:       { en: 'Recovery Capacity',     fr: 'Capacité de Récupération', es: 'Capacidad de Recuperación' },
  priority_gut:            { en: 'Gut Health',            fr: 'Santé Intestinale',        es: 'Salud Intestinal' },
  priority_cognition:      { en: 'Cognitive Performance', fr: 'Performance Cognitive',    es: 'Rendimiento Cognitivo' },
  priority_hormonal:       { en: 'Hormonal Balance',      fr: 'Équilibre Hormonal',       es: 'Equilibrio Hormonal' },
  priority_cardiovascular: { en: 'Cardiovascular Health', fr: 'Santé Cardiovasculaire',   es: 'Salud Cardiovascular' },
  priority_immune:         { en: 'Immune Resilience',     fr: 'Résilience Immunitaire',   es: 'Resiliencia Inmune' },
  priority_metabolism:     { en: 'Metabolic Function',    fr: 'Fonction Métabolique',     es: 'Función Metabólica' },
  priority_longevity:      { en: 'Longevity Capital',     fr: 'Capital Longévité',        es: 'Capital de Longevidad' },
  priority_aging:          { en: 'Biological Aging',      fr: 'Vieillissement Biologique', es: 'Envejecimiento Biológico' },
  priority_resilience:     { en: 'Adaptive Resilience',   fr: 'Résilience Adaptative',    es: 'Resiliencia Adaptativa' },
  priority_emotional:      { en: 'Emotional Resilience',  fr: 'Résilience Émotionnelle',  es: 'Resiliencia Emocional' },
  priority_mindset:        { en: 'Longevity Mindset',     fr: 'Mentalité Longévité',      es: 'Mentalidad de Longevidad' },
  priority_purpose:        { en: 'Purpose Alignment',     fr: 'Alignement Sens',          es: 'Alineación de Propósito' },
  priority_nutrition:      { en: 'Nutritional Quality',   fr: 'Qualité Nutritionnelle',   es: 'Calidad Nutricional' },
  priority_exercise:       { en: 'Physical Conditioning', fr: 'Conditionnement Physique',  es: 'Acondicionamiento Físico' },
  priority_mobility:       { en: 'Mobility Function',     fr: 'Fonction Mobilité',        es: 'Función de Movilidad' },
  priority_social:         { en: 'Social Resilience',     fr: 'Résilience Sociale',       es: 'Resiliencia Social' },
  priority_skin:           { en: 'Skin Vitality',         fr: 'Vitalité Cutanée',         es: 'Vitalidad de la Piel' },
  priority_sexual:         { en: 'Sexual Wellness',       fr: 'Bien-être Sexuel',         es: 'Bienestar Sexual' },
  priority_biohacking:     { en: 'Biohacking Engagement', fr: 'Engagement Biohacking',    es: 'Compromiso Biohacking' },
  priority_advanced:       { en: 'Advanced Optimization', fr: 'Optimisation Avancée',     es: 'Optimización Avanzada' },
  priority_wellness:       { en: 'Global Wellness',       fr: 'Bien-être Global',         es: 'Bienestar Global' },
  priority_circadian:      { en: 'Circadian Alignment',   fr: 'Alignement Circadien',     es: 'Alineación Circadiana' },
  priority_detox:          { en: 'Detoxification',        fr: 'Détoxification',           es: 'Detoxificación' },
  priority_environment:    { en: 'Environmental Health',  fr: 'Santé Environnementale',   es: 'Salud Ambiental' },
  priority_family:         { en: 'Family Predisposition', fr: 'Prédisposition Familiale', es: 'Predisposición Familiar' },
  priority_lifestyle:      { en: 'Lifestyle Balance',     fr: 'Équilibre de Vie',         es: 'Equilibrio de Vida' },
  priority_performance:    { en: 'Performance Output',    fr: 'Performance Générale',     es: 'Rendimiento General' },
}

const FLAG_LABELS: Record<string, Record<string, string>> = {
  'flag_sleep_critical':         { en: 'Severe sleep disruption detected — absolute priority for intervention', fr: 'Perturbation sévère du sommeil détectée — priorité absolue d\'intervention', es: 'Perturbación grave del sueño detectada — prioridad absoluta de intervención' },
  'flag_stress_critical':        { en: 'Simultaneously elevated stress and emotional load — burnout risk identified', fr: 'Stress et charge émotionnelle simultanément élevés — risque de burnout identifié', es: 'Estrés y carga emocional simultáneamente elevados — riesgo de agotamiento identificado' },
  'flag_inflammation_warning':   { en: 'Probable systemic inflammation — gut-immunity axis requires investigation', fr: 'Inflammation systémique probable — l\'axe intestin-immunité nécessite investigation', es: 'Inflamación sistémica probable — el eje intestino-inmunidad requiere investigación' },
  'flag_cardiovascular_warning': { en: 'Cardiovascular risk combined with family history — active monitoring recommended', fr: 'Risque cardiovasculaire combiné à antécédents familiaux — surveillance active recommandée', es: 'Riesgo cardiovascular combinado con historial familiar — monitoreo activo recomendado' },
}

const DOMAIN_LABELS: Record<string, Record<string, string>> = {
  energy:         { en: 'ENERGY',         fr: 'ÉNERGIE',       es: 'ENERGÍA' },
  cognition:      { en: 'COGNITION',      fr: 'COGNITION',     es: 'COGNICIÓN' },
  performance:    { en: 'PERFORMANCE',    fr: 'PERFORMANCE',   es: 'RENDIMIENTO' },
  exercise:       { en: 'EXERCISE',       fr: 'EXERCICE',      es: 'EJERCICIO' },
  mobility:       { en: 'MOBILITY',       fr: 'MOBILITÉ',      es: 'MOVILIDAD' },
  metabolism:     { en: 'METABOLISM',     fr: 'MÉTABOLISME',   es: 'METABOLISMO' },
  nutrition:      { en: 'NUTRITION',      fr: 'NUTRITION',     es: 'NUTRITION' },
  sexual:         { en: 'SEXUAL',         fr: 'SEXUEL',        es: 'SEXUAL' },
  stress:         { en: 'STRESS',         fr: 'STRESS',        es: 'ESTRÉS' },
  sleep:          { en: 'SLEEP',          fr: 'SOMMEIL',       es: 'SUEÑO' },
  hormonal:       { en: 'HORMONAL',       fr: 'HORMONAL',      es: 'HORMONAL' },
  emotional:      { en: 'EMOTIONAL',      fr: 'ÉMOTIONNEL',    es: 'EMOCIONAL' },
  circadian:      { en: 'CIRCADIAN',      fr: 'CIRCADIEN',     es: 'CIRCADIANO' },
  social:         { en: 'SOCIAL',         fr: 'SOCIAL',        es: 'SOCIAL' },
  lifestyle:      { en: 'LIFESTYLE',      fr: 'STYLE DE VIE',  es: 'ESTILO DE VIDA' },
  inflammation:   { en: 'INFLAMMATION',   fr: 'INFLAMMATION',  es: 'INFLAMACIÓN' },
  immune:         { en: 'IMMUNE',         fr: 'IMMUN',         es: 'INMUNE' },
  cardiovascular: { en: 'CARDIOVASCULAR', fr: 'CARDIO',        es: 'CARDIO' },
  gut:            { en: 'GUT',            fr: 'INTESTIN',      es: 'INTESTINO' },
  detox:          { en: 'DETOX',          fr: 'DÉTOX',         es: 'DETOX' },
  environment:    { en: 'ENVIRONMENT',    fr: 'ENVIRONNEMENT', es: 'ENTORNO' },
  family:         { en: 'FAMILY',         fr: 'FAMILLE',       es: 'FAMILIA' },
  skin:           { en: 'SKIN',           fr: 'PEAU',          es: 'PIEL' },
  recovery:       { en: 'RECOVERY',       fr: 'RÉCUPÉRATION',  es: 'RECUPERACIÓN' },
  resilience:     { en: 'RESILIENCE',     fr: 'RÉSILIENCE',    es: 'RESILIENCIA' },
  longevity:      { en: 'LONGEVITY',      fr: 'LONGÉVITÉ',     es: 'LONGEVIDAD' },
  aging:          { en: 'AGING',          fr: 'VIEILLISSEMENT', es: 'ENVEJECIMIENTO' },
  mindset:        { en: 'MINDSET',        fr: 'MINDSET',       es: 'MENTALIDAD' },
  purpose:        { en: 'PURPOSE',        fr: 'SENS',          es: 'PROPÓSITO' },
  biohacking:     { en: 'BIOHACKING',     fr: 'BIOHACKING',    es: 'BIOHACKING' },
  advanced:       { en: 'ADVANCED',       fr: 'AVANCÉ',        es: 'AVANZADO' },
  wellness:       { en: 'WELLNESS',       fr: 'BIEN-ÊTRE',     es: 'BIENESTAR' },
}

function resolveFlag(key: string, locale?: string) {
  if (FLAG_LABELS[key]) return FLAG_LABELS[key][locale ?? 'en'] ?? FLAG_LABELS[key]['en'] ?? key
  return key?.startsWith('flag_') ? cap(key.replace('flag_', '').replace(/_/g, ' ')) : key
}
function resolvePriority(key: string, locale?: string) {
  if (PRIORITY_LABELS[key]) return PRIORITY_LABELS[key][locale ?? 'en'] ?? PRIORITY_LABELS[key]['en'] ?? cap(key.replace('priority_', ''))
  return key?.startsWith('priority_') ? cap(key.replace('priority_', '')) : resolveFlag(key, locale)
}

// ── STYLES ────────────────────────────────────────────────────────────────────

function makeStyles(v: 'bw' | 'color') {
  const pal = p(v)
  return StyleSheet.create({
    page: {
      backgroundColor: pal.bgPage,
      paddingTop: 32, paddingBottom: 44, paddingHorizontal: 36,
      color: pal.text, fontSize: 10, fontFamily: 'Helvetica',
    },
    // Header
    pageHeader: {
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
      marginBottom: 18, paddingBottom: 14,
      borderBottomWidth: 1, borderBottomColor: pal.borderGold, borderBottomStyle: 'solid',
    },
    logo: { width: 52, height: 52 },
    brand: { fontSize: 7, color: pal.gold, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5 },
    pageTitle: { fontSize: 20, fontWeight: 700, color: pal.text, marginBottom: 5 },
    pageSub: { fontSize: 8, color: pal.textMuted, lineHeight: 1.5, maxWidth: 300 },
    pageDate: { fontSize: 7, color: pal.textLight, marginTop: 6 },
    pageNumTop: { fontSize: 7, color: pal.textLight, letterSpacing: 1 },
    // Dividers
    divider: { height: 1, backgroundColor: pal.borderNormal, marginVertical: 10 },
    dividerGold: { height: 1, backgroundColor: pal.borderGold, marginVertical: 10 },
    // Labels
    label: { fontSize: 7, textTransform: 'uppercase', letterSpacing: 2, color: pal.gold, marginBottom: 6 },
    labelBlue: { fontSize: 7, textTransform: 'uppercase', letterSpacing: 2, color: pal.blue, marginBottom: 6 },
    // Cards
    card: {
      marginBottom: 8, padding: 12, borderRadius: 8,
      borderWidth: 1, borderStyle: 'solid',
      borderColor: pal.borderNormal, backgroundColor: pal.bgCard,
    },
    cardGold: {
      marginBottom: 8, padding: 12, borderRadius: 8,
      borderWidth: 1, borderStyle: 'solid',
      borderColor: pal.borderGold, backgroundColor: v === 'color' ? C.bgGold : BW.bgGold,
    },
    cardBlue: {
      marginBottom: 8, padding: 12, borderRadius: 8,
      borderWidth: 1, borderStyle: 'solid',
      borderColor: pal.borderBlue, backgroundColor: pal.bgBlue,
    },
    // Text
    body: { color: pal.textMuted, lineHeight: 1.8, fontSize: 9 },
    bodySmall: { color: pal.textMuted, lineHeight: 1.7, fontSize: 8 },
    // Progress bar
    progressBg: { height: 4, borderRadius: 999, backgroundColor: v === 'color' ? '#0D1829' : '#E0E0E0' },
    // Tags
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 5 },
    tag: {
      borderRadius: 999, paddingVertical: 2, paddingHorizontal: 7,
      fontSize: 7, borderWidth: 1, borderStyle: 'solid',
      borderColor: pal.borderGold, backgroundColor: v === 'color' ? C.bgGold : BW.bgGold,
      color: pal.gold,
    },
    // Table
    tableHeader: {
      flexDirection: 'row', paddingBottom: 5, marginBottom: 3,
      borderBottomWidth: 1, borderBottomColor: pal.borderNormal, borderBottomStyle: 'solid',
    },
    tableRow: {
      flexDirection: 'row', paddingVertical: 5, alignItems: 'center',
      borderBottomWidth: 1, borderBottomColor: pal.borderNormal, borderBottomStyle: 'solid',
    },
    // Footer
    footer: {
      marginTop: 14, paddingTop: 8,
      borderTopWidth: 1, borderTopColor: pal.borderNormal, borderTopStyle: 'solid',
      color: pal.textLight, fontSize: 7.5,
    },
    pageNum: { position: 'absolute', bottom: 18, right: 36, color: pal.textLight, fontSize: 7.5 },
    watermark: { position: 'absolute', top: '20%', left: '5%', width: '90%', opacity: 0.07 },
  })
}

// ── SHARED ────────────────────────────────────────────────────────────────────

function Bar({ value, color, s }: any) {
  return (
    <View style={s.progressBg}>
      <View style={{ height: 4, borderRadius: 999, width: `${Math.max(2, value)}%`, backgroundColor: color }} />
    </View>
  )
}

function SevBadge({ severity, v }: any) {
  const pal = p(v)
  const color = severity === 'critical' ? pal.critical : severity === 'warning' ? pal.moderate : pal.good
  const bg    = severity === 'critical' ? pal.bgCritical : severity === 'warning' ? pal.bgWarning : pal.bgGood
  const brd   = severity === 'critical' ? pal.borderCrit : severity === 'warning' ? pal.borderWarn : pal.borderGood
  const label = severity === 'critical' ? 'CRITICAL' : severity === 'warning' ? 'WARNING' : 'MONITOR'
  return (
    <Text style={{ fontSize: 6, color, borderWidth: 1, borderStyle: 'solid', borderColor: brd, borderRadius: 3, paddingVertical: 2, paddingHorizontal: 5, backgroundColor: bg }}>
      {label}
    </Text>
  )
}

// ── PAGE 1A — EXECUTIVE OVERVIEW ─────────────────────────────────────────────

function Page1A({ report, fullName, longevityScore, biologicalAge, scores, v, s, logoPath, watermarkPath, l }: any) {
  const pal = p(v)
  const pillarScores   = report?.pillarScores ?? {}
  const strengths      = report?.strengths ?? []
  const weaknesses     = report?.weaknesses ?? []
  const aiNarrative    = report?.aiNarrative ?? ''
  const aiKeyInsight   = report?.aiKeyInsight ?? ''
  const priorities     = report?.priorities ?? []
  const archetype      = report?.profileVector?.archetype
  const archetypeName  = resolveArchetypeName(archetype?.name ?? '', l)
  const archetypeDesc  = resolveArchetypeDesc(archetype?.description ?? '', l)
  const signalIntegrity = report?.signalIntegrity ?? null
  const chronoAge      = report?.user?.age ?? 40
  const delta          = chronoAge - biologicalAge
  const percentile     = report?.percentile ?? 0
  const dominantPillar = report?.dominantPillar ?? 'balance'
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <Page size="A4" style={s.page} wrap>
      {watermarkPath && <Image src={watermarkPath} style={s.watermark} fixed />}
      {/* HEADER */}
      <View style={s.pageHeader}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          {logoPath && <Image src={logoPath} style={s.logo} />}
          <View>
            <Text style={s.brand}>{tr('page1_brand', l)}</Text>
            <Text style={s.pageTitle}>{tr('page1_title', l)}</Text>
            <Text style={s.pageSub}>{tr('page1_sub', l)}{archetypeName ? `\n${tr('profile', l)}: ${archetypeName}` : ''}</Text>
            <Text style={s.pageDate}>{tr('page1_generated', l)} {date} {tr('page1_at', l)} {time} — {tr('page1_confidential', l)}</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <Text style={s.pageNumTop}>{tr('page1_pagenum', l)}</Text>
          <Text style={[s.label, { marginBottom: 2 }]}>{tr('report_date', l)}</Text>
          <Text style={{ fontSize: 8, color: pal.gold }}>{date}</Text>
         {signalIntegrity != null && (
              <View style={{ marginTop: 6, alignItems: 'flex-end' }}>
                <Text style={[s.label, { marginBottom: 2 }]}>{tr('signal_integrity', l)}</Text>
              <Text style={{ fontSize: 18, fontWeight: 700, color: scoreColor(signalIntegrity, v) }}>{signalIntegrity}%</Text>
            </View>
          )}
        </View>
      </View>

      {/* CLIENT INFO ROW */}
      <View style={{ flexDirection: 'row', gap: 5, marginBottom: 14, flexWrap: 'wrap' }}>
        {[
          { label: tr('client', l),     value: fullName },
          { label: tr('email', l),      value: report?.user?.email ?? '—' },
          { label: tr('membership', l), value: cap(report?.user?.memberType ?? '—') },
          { label: tr('age', l),        value: `${chronoAge} ${tr('years', l)}` },
          { label: tr('sex', l),        value: report?.user?.sex ? tr(`sex_${report.user.sex}`, l) : '—' },
          { label: tr('height', l),     value: report?.user?.height ? `${report.user.height} cm` : '—' },
          { label: tr('weight', l),     value: report?.user?.weight ? `${report.user.weight} kg` : '—' },
        ].map((item, i) => (
          <View key={i} style={{ paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderStyle: 'solid', borderColor: pal.borderNormal, backgroundColor: pal.bgCardDeep }}>
            <Text style={{ fontSize: 6, color: pal.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{item.label}</Text>
            <Text style={{ fontSize: 8, color: pal.text, fontWeight: 700 }}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* MAIN 3-COL */}
      <View style={{ flexDirection: 'row', gap: 10 }}>

        {/* LEFT */}
        <View style={{ width: '26%' }}>
          {/* Longevity Score */}
          <View style={[s.card, { alignItems: 'center', paddingVertical: 14 }]}>
            <Text style={s.label}>{tr('longevity_score', l)}</Text>
            <Text style={{ fontSize: 44, fontWeight: 700, color: scoreColor(longevityScore, v), lineHeight: 1 }}>{longevityScore}</Text>
            <Text style={{ fontSize: 7, color: pal.textLight, marginTop: 2 }}>/100</Text>
            <View style={[s.divider, { width: '70%', marginVertical: 8 }]} />
            <Text style={s.label}>{tr('population_ranking', l)}</Text>
            <Text style={{ fontSize: 14, fontWeight: 700, color: pal.blue }}>{tr('top', l)} {100 - percentile}%</Text>
          </View>

          {/* Biological Age */}
          <View style={[s.card, {
            borderColor: scoreBorder(delta >= 0 ? 80 : 35, v),
            backgroundColor: scoreBg(delta >= 0 ? 80 : 35, v),
            alignItems: 'center',
            paddingVertical: 14,
          }]}>
            <Text style={s.label}>{tr('biological_age', l)}</Text>
            <Text style={{ fontSize: 38, fontWeight: 700, color: scoreColor(delta >= 0 ? 80 : 35, v), lineHeight: 1 }}>{biologicalAge}</Text>
            <Text style={{ fontSize: 7, color: pal.textLight }}>{tr('years', l)}</Text>
            <View style={[s.divider, { width: '70%', marginVertical: 8 }]} />
            <Text style={{ fontSize: 8.5, color: scoreColor(delta >= 0 ? 80 : 35, v), marginTop: 4 }}>
              {Math.abs(delta).toFixed(1)} {delta >= 0 ? tr('younger', l) : tr('older', l)}
            </Text>
          </View>

          {/* Signature */}
          {archetypeName ? (
            <View style={s.cardGold}>
              <Text style={s.label}>{tr('bio_signature', l)}</Text>
              <Text style={{ fontSize: 10, fontWeight: 700, color: pal.text, marginBottom: 5, lineHeight: 1.3 }}>{archetypeName}</Text>
              <Text style={s.bodySmall}>{archetypeDesc}</Text>
              <View style={{ marginTop: 6 }}>
                <Text style={[s.tag, { alignSelf: 'flex-start' }]}>{tr('focus', l)}: {cap(dominantPillar)}</Text>
              </View>
            </View>
          ) : null}

          
        </View>

        {/* CENTER */}
        <View style={{ width: '29%' }}>
          

          {/* Bar details per pillar */}
          {(['activate', 'balance', 'protect', 'restore'] as const).map((key) => {
            const score = pillarScores[key] ?? 0
            const pc = pillarCol(key, v)
            const descs: Record<string, string> = {
              activate: tr('desc_activate', l),
              balance:  tr('desc_balance', l),
              protect:  tr('desc_protect', l),
              restore:  tr('desc_restore', l),
            }
            return (
              <View key={key} style={{ marginBottom: 8, padding: 8, borderRadius: 7, borderWidth: 1, borderStyle: 'solid', borderColor: pc.border, backgroundColor: pc.bg }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text style={{ fontSize: 7, color: pc.text, textTransform: 'uppercase', letterSpacing: 1 }}>{tr(`pillar_${key}`, l)}</Text>
                  <Text style={{ fontSize: 11, fontWeight: 700, color: pc.text }}>{score}</Text>
                </View>
                <Bar value={score} color={pc.text} s={s} />
                <Text style={[s.bodySmall, { marginTop: 4, fontSize: 7.5 }]}>{descs[key]}</Text>
              </View>
            )
          })}

          {/* Key Insight */}
          {aiKeyInsight ? (
            <View style={s.cardBlue}>
              <Text style={s.labelBlue}>{tr('key_insight', l)}</Text>
              <Text style={s.bodySmall}>{aiKeyInsight}</Text>
            </View>
          ) : null}
        </View>

        {/* RIGHT */}
        <View style={{ flex: 1 }}>
          <Text style={s.label}>{tr('primary_priorities', l)}</Text>
          {priorities.slice(0, 5).map((pr: any, i: number) => {
            const sev = pr.severity ?? 'moderate'
            const color = sev === 'critical' ? pal.critical : sev === 'warning' ? pal.moderate : pal.good
            const bg    = sev === 'critical' ? pal.bgCritical : sev === 'warning' ? pal.bgWarning : pal.bgGood
            const brd   = sev === 'critical' ? pal.borderCrit : sev === 'warning' ? pal.borderWarn : pal.borderGood
            return (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 9, borderRadius: 7, marginBottom: 5, borderWidth: 1, borderStyle: 'solid', borderColor: brd, backgroundColor: bg }}>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={{ fontSize: 8.5, color: pal.text, lineHeight: 1.4 }}>{resolvePriority(pr.title, l)}</Text>
                  {pr.impact && <Text style={{ fontSize: 6.5, color: pal.textLight, marginTop: 2, textTransform: 'uppercase' }}>{tr(`impact_${pr.impact.replace('impact_', '')}`, l)}</Text>}
                </View>
                <Text style={{ fontSize: 5.5, color, borderWidth: 1, borderStyle: 'solid', borderColor: brd, borderRadius: 3, paddingVertical: 2, paddingHorizontal: 4, backgroundColor: bg, textTransform: 'uppercase' }}>
                  {sev === 'critical' ? tr('immediate', l) : sev === 'moderate' ? tr('optimize', l) : tr('monitor', l)}
                </Text>
              </View>
            )
          })}

          <View style={s.dividerGold} />

          {/* Strengths */}
          {strengths.length > 0 && (
            <View style={s.card}>
              <Text style={s.label}>{tr('bio_strengths', l)}</Text>
              {strengths.slice(0, 4).map((str: string, i: number) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                  <View style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: pal.good }} />
                  <Text style={{ fontSize: 8.5, color: pal.text, flex: 1 }}>{DOMAIN_LABELS[str]?.[l] ?? cap(str)}</Text>
                  {scores[str] != null && <Text style={{ fontSize: 8, color: pal.good }}>{scores[str]}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={s.footer}><Text>{tr('footer_p1', l)}</Text></View>
      <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>
  )
}

// ── PAGE 1B — PATTERNS + VULNERABILITY ───────────────────────────────────────

function Page1B({ report, scores, v, s, logoPath, watermarkPath, l }: any) {
  const pal = p(v)
  const patterns   = report?.patterns ?? []
  const flags      = report?.flags ?? []
  const weaknesses = report?.weaknesses ?? []
  const critFlags  = flags.filter((f: any) => f.severity === 'critical')
  const warnFlags  = flags.filter((f: any) => f.severity === 'warning')

  return (
    <Page size="A4" style={s.page} wrap>
      {watermarkPath && <Image src={watermarkPath} style={s.watermark} fixed />}
      <View style={[s.pageHeader, { marginBottom: 14 }]}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {logoPath && <Image src={logoPath} style={[s.logo, { width: 38, height: 38 }]} />}
          <View>
            <Text style={s.brand}>{tr('page1b_brand', l)}</Text>
            <Text style={[s.pageTitle, { fontSize: 17 }]}>{tr('page1b_title', l)}</Text>
          </View>
        </View>
        <Text style={s.pageNumTop}>{tr('page1_pagenum', l)} — continued</Text>
      </View>

{/* AI INTERPRETATION — pleine largeur */}
      {report?.aiNarrative ? (
        <View style={[s.cardBlue, { marginBottom: 14 }]}>
          <Text style={s.labelBlue}>{tr('ai_interpretation', l)}</Text>
          <Text style={s.body}>{report.aiNarrative}</Text>
          {report?.weaknesses?.length > 0 && (
            <Text style={[s.body, { marginTop: 8, color: pal.textMuted }]}>
              {tr('optim_axes', l)}: {report.weaknesses.slice(0, 3).map((w: string) => {
                const names: Record<string, string> = {
                  sleep: 'Sleep Quality', stress: 'Stress Resilience', energy: 'Energy Levels',
                  gut: 'Gut Health', inflammation: 'Inflammation', immune: 'Immune Function',
                  emotional: 'Emotional Resilience', cognition: 'Cognitive Performance',
                  recovery: 'Recovery Capacity', hormonal: 'Hormonal Balance',
                  cardiovascular: 'Cardiovascular Health', longevity: 'Longevity',
                  aging: 'Aging', metabolism: 'Metabolism', nutrition: 'Nutrition',
                }
                return names[w] ?? (w.charAt(0).toUpperCase() + w.slice(1))
              }).join(', ')}.
            </Text>
          )}
          {report?.flags?.filter((f: any) => f.severity === 'critical').map((flag: any, i: number) => {
            const msg = flag.message ?? ''
            const resolved = resolveFlag(msg, l)
            return (
              <Text key={i} style={[s.body, { marginTop: 4, color: pal.moderate }]}>⚠ {resolved}</Text>
            )
          })}
        </View>
      ) : null}

      {/* PATTERNS GRID */}
      {patterns.length > 0 && (
        <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {patterns.map((pt: any, i: number) => {
              const sev = pt.severity ?? pt.level ?? 'moderate'
              const pc = pillarCol(pt.pillar ?? 'balance', v)
              const brd = sev === 'critical' ? pal.borderCrit : pal.borderWarn
              const bg  = sev === 'critical' ? pal.bgCritical : pal.bgWarning
              const color = sev === 'critical' ? pal.critical : pal.moderate
              return (
                <View key={i} style={{ width: '48%', padding: 10, borderRadius: 7, borderWidth: 1, borderStyle: 'solid', borderColor: brd, backgroundColor: bg }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: 6.5, color: pc.text, textTransform: 'uppercase', letterSpacing: 1 }}>{tr(`pillar_${pt.pillar ?? 'balance'}`, l)} — {sev === 'critical' ? tr('critical_badge', l) : tr('warning_badge', l)}</Text>
                    <Text style={{ fontSize: 6, color, borderWidth: 1, borderStyle: 'solid', borderColor: brd, borderRadius: 3, paddingVertical: 1, paddingHorizontal: 4 }}>{sev === 'critical' ? tr('critical_badge', l) : tr('warning_badge', l)}</Text>
                  </View>
                  <Text style={{ fontSize: 9, fontWeight: 700, color: pal.text, marginBottom: 4, lineHeight: 1.3 }}>{pt.name ?? pt.title ?? cap(pt.category ?? '')}</Text>
                  <Text style={s.bodySmall}>{pt.description ?? pt.message ?? ''}</Text>
                </View>
              )
            })}
          </View>
          <View style={s.divider} />
        </>
      )}

      {/* VULNERABILITY SIGNALS */}
      <View wrap={false} break>
      <Text style={[s.label, { marginBottom: 8 }]}>{tr('risk_projection', l)}</Text>
      <Text style={[s.pageTitle, { fontSize: 15, marginBottom: 10 }]}>{tr('vuln_signals', l)}</Text>
      {[...critFlags, ...warnFlags].slice(0, 6).map((flag: any, i: number) => {
        const isCrit = flag.severity === 'critical'
        const color = isCrit ? pal.critical : pal.moderate
        const bg    = isCrit ? pal.bgCritical : pal.bgWarning
        const brd   = isCrit ? pal.borderCrit : pal.borderWarn
        return (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 9, borderRadius: 7, marginBottom: 5, borderWidth: 1, borderStyle: 'solid', borderColor: brd, backgroundColor: bg }}>
            <Text style={{ fontSize: 8.5, color: pal.text, flex: 1, paddingRight: 10, lineHeight: 1.4 }}>{resolveFlag(flag.message ?? flag.label ?? '', l)}</Text>
            <Text style={{ fontSize: 6, color, borderWidth: 1, borderStyle: 'solid', borderColor: brd, borderRadius: 3, paddingVertical: 2, paddingHorizontal: 5, backgroundColor: bg, textTransform: 'uppercase' }}>{isCrit ? tr('critical_label', l) : tr('warning_badge', l)}</Text>
          </View>
        )
      })}
 </View>
      {/* PRIORITY DOMAINS */}
      {weaknesses.length > 0 && (
        <>
          <View style={s.divider} />
          <Text style={s.label}>{tr('priority_domains', l)}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
            {weaknesses.map((w: string, i: number) => (
              <View key={i} style={{ borderRadius: 999, paddingVertical: 3, paddingHorizontal: 8, borderWidth: 1, borderStyle: 'solid', borderColor: pal.borderCrit, backgroundColor: pal.bgCritical }}>
                <Text style={{ fontSize: 7.5, color: pal.critical }}>{cap(w)}{scores[w] != null ? `  ${scores[w]}/100` : ''}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={s.divider} />

      {/* CLINICAL CONSULTATION */}
      <View style={s.cardGold}>
        <Text style={s.label}>{tr('clinical_consult', l)}</Text>
        <Text style={[s.bodySmall, { marginBottom: 8 }]}>{tr('clinical_desc', l)}</Text>
        {[
          { role: tr('spec_gp', l),    reason: tr('spec_gp_reason', l) },
          { role: tr('spec_sleep', l), reason: tr('spec_sleep_reason', l) },
          { role: tr('spec_psych', l), reason: tr('spec_psych_reason', l) },
          { role: tr('spec_nutri', l), reason: tr('spec_nutri_reason', l) },
          { role: tr('spec_endo', l),  reason: tr('spec_endo_reason', l) },
        ].map((c2, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 6, marginBottom: 5 }}>
            <Text style={{ fontSize: 8, color: pal.gold, marginTop: 1 }}>·</Text>
            <View>
              <Text style={{ fontSize: 8.5, color: pal.text, fontWeight: 700 }}>{c2.role}</Text>
              <Text style={{ fontSize: 7.5, color: pal.textMuted, lineHeight: 1.4 }}>{c2.reason}</Text>
            </View>
          </View>
        ))}
        <Text style={[s.bodySmall, { marginTop: 6, color: pal.textLight, fontStyle: 'italic' }]}>{tr('clinical_disclaimer', l)}</Text>
      </View>

      <View style={s.footer}><Text>{tr('footer_p1b', l)}</Text></View>
      <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>
  )
}

// ── PAGE 2A — BIOLOGICAL INTELLIGENCE ────────────────────────────────────────

function Page2A({ report, longevityScore, biologicalAge, scores, v, s, logoPath, watermarkPath, l }: any) {
  const pal = p(v)
  const chronoAge  = report?.user?.age ?? 40
  const delta      = chronoAge - biologicalAge
  const IF         = (100 - longevityScore) / 100
  const proj12m    = Math.max(18, biologicalAge - Math.round(IF * 3.2))
  const pillarScores = report?.pillarScores ?? {}
  const aiBiomarker = report?.aiBiomarkerAnalysis ?? ''
  const biomarkers  = report?.biomarkers ?? []

  const domainGroups = [
    { key: 'activate', domains: ['energy','cognition','performance','exercise','mobility','metabolism','nutrition','sexual'] },
    { key: 'balance',  domains: ['stress','sleep','hormonal','emotional','circadian','social','lifestyle'] },
    { key: 'protect',  domains: ['inflammation','immune','cardiovascular','gut','detox','environment','family','skin'] },
    { key: 'restore',  domains: ['recovery','resilience','longevity','aging','mindset','purpose','biohacking','advanced','wellness'] },
  ]

  return (
    <Page size="A4" style={s.page} wrap>
      {watermarkPath && <Image src={watermarkPath} style={s.watermark} fixed />}
      <View style={[s.pageHeader, { marginBottom: 14 }]}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {logoPath && <Image src={logoPath} style={[s.logo, { width: 38, height: 38 }]} />}
          <View>
            <Text style={s.brand}>{tr('page2a_brand', l)}</Text>
            <Text style={[s.pageTitle, { fontSize: 17 }]}>{tr('page2a_title', l)}</Text>
            <Text style={[s.pageSub, { fontSize: 7.5 }]}>{tr('page2a_sub', l)}</Text>
          </View>
        </View>
        <Text style={s.pageNumTop}>{tr('page2a_pagenum', l)}</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>

        {/* AGE TIMELINE */}
        <View style={{ width: '32%' }}>
          <Text style={s.label}>{tr('bio_intel', l)}</Text>
          <Text style={{ fontSize: 11, fontWeight: 700, color: pal.text, marginBottom: 8 }}>{tr('age_timeline', l)}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            {[
              { label: tr('chrono', l),     value: chronoAge,    color: pal.textMuted },
              { label: tr('biological', l), value: biologicalAge, color: scoreColor(delta >= 0 ? 80 : 35, v) },
              { label: tr('optimized', l),  value: proj12m,       color: pal.blue },
            ].map((item, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 6.5, color: pal.textLight, textTransform: 'uppercase', marginBottom: 3 }}>{item.label}</Text>
                <Text style={{ fontSize: 22, fontWeight: 700, color: item.color, lineHeight: 1 }}>{item.value}</Text>
              </View>
            ))}
          </View>
          {[
            { label: tr('current', l),  age: biologicalAge,                                      color: scoreColor(delta >= 0 ? 80 : 35, v) },
            { label: '30d',             age: Math.max(18, biologicalAge - Math.round(IF * 0.3)), color: pal.blue },
            { label: '90d',             age: Math.max(18, biologicalAge - Math.round(IF * 0.8)), color: pal.blue },
            { label: tr('months6', l),  age: Math.max(18, biologicalAge - Math.round(IF * 1.8)), color: pal.gold },
            { label: tr('months12', l), age: proj12m,                                             color: pal.good },
          ].map((m, i) => {
            const minA = proj12m - 2
            const maxA = Math.max(chronoAge, biologicalAge) + 2
            const pct  = Math.max(4, Math.min(100, ((m.age - minA) / (maxA - minA)) * 100))
            return (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 }}>
                <Text style={{ width: 55, fontSize: 7, color: pal.textMuted, textAlign: 'right', textTransform: 'uppercase' }}>{m.label}</Text>
                <View style={{ flex: 1, height: 4, borderRadius: 999, backgroundColor: v === 'color' ? '#0D1829' : '#E0E0E0' }}>
                  <View style={{ height: 4, borderRadius: 999, width: `${pct}%`, backgroundColor: m.color }} />
                </View>
                <Text style={{ width: 22, fontSize: 9, fontWeight: 700, color: m.color, textAlign: 'right' }}>{m.age}</Text>
              </View>
            )
          })}
          <View style={{ flexDirection: 'row', gap: 5, marginTop: 6 }}>
            <View style={[s.card, { flex: 1, padding: 7, marginBottom: 0, borderColor: scoreBorder(delta >= 0 ? 80 : 35, v), backgroundColor: scoreBg(delta >= 0 ? 80 : 35, v) }]}>
              <Text style={{ fontSize: 6, color: pal.textLight, textTransform: 'uppercase', marginBottom: 2 }}>{tr('bio_delta', l)}</Text>
              <Text style={{ fontSize: 12, fontWeight: 700, color: scoreColor(delta >= 0 ? 80 : 35, v) }}>{delta >= 0 ? '-' : '+'}{Math.abs(delta).toFixed(1)}y</Text>
            </View>
            <View style={[s.cardBlue, { flex: 1, padding: 7, marginBottom: 0 }]}>
              <Text style={{ fontSize: 6, color: pal.textLight, textTransform: 'uppercase', marginBottom: 2 }}>{tr('potential', l)}</Text>
              <Text style={{ fontSize: 12, fontWeight: 700, color: pal.blue }}>-{biologicalAge - proj12m}y</Text>
            </View>
          </View>
        </View>

        {/* 32 DOMAIN SCORES */}
        <View style={{ flex: 1 }}>
          <Text style={s.label}>{tr('domains_label', l)}</Text>
          <Text style={{ fontSize: 11, fontWeight: 700, color: pal.text, marginBottom: 8 }}>{tr('scores_32', l)}</Text>
          {domainGroups.map((group) => {
            const pc = pillarCol(group.key, v)
            return (
              <View key={group.key} style={{ marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 }}>
                  <View style={{ width: 4, height: 4, borderRadius: 999, backgroundColor: pc.text }} />
                  <Text style={{ fontSize: 6.5, color: pc.text, textTransform: 'uppercase', letterSpacing: 1 }}>{tr(`pillar_${group.key}`, l)}</Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
                  {group.domains.map((domain) => {
                    const val   = scores[domain] ?? 0
                    const color = scoreColor(val, v)
                    const bg    = scoreBg(val, v)
                    const brd   = scoreBorder(val, v)
                    return (
                      <View key={domain} style={{ width: '11%', borderRadius: 5, padding: 4, borderWidth: 1, borderStyle: 'solid', borderColor: brd, backgroundColor: bg }}>
                        <Text style={{ fontSize: 5.5, color: pal.textLight, textTransform: 'uppercase', marginBottom: 2 }}>{DOMAIN_LABELS[domain]?.[l] ?? domain.toUpperCase()}</Text>
                        <Text style={{ fontSize: 10, fontWeight: 700, color }}>{val}</Text>
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          })}
        </View>
      </View>

      {/* AI BIOMARKER */}
      {aiBiomarker ? (
        <>
          <View style={s.divider} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <Text style={s.label}>{tr('ai_clinical', l)}</Text>
          {biomarkers.length > 0 && (
              <View style={{ borderRadius: 10, paddingVertical: 2, paddingHorizontal: 8, borderWidth: 1, borderStyle: 'solid', borderColor: pal.borderGold, backgroundColor: v === 'color' ? C.bgGold : BW.bgGold }}>
                <Text style={{ fontSize: 7, color: pal.gold }}>{biomarkers.length} {tr('markers_analyzed', l)}</Text>
              </View>
            )}
          </View>
          <View style={s.card}><Text style={s.body}>{aiBiomarker}</Text></View>
        </>
      ) : null}

      <View style={s.footer}><Text>{tr('footer_p2a', l)}</Text></View>
      <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>
  )
}

// ── PAGE 2B — BIOMARKERS ──────────────────────────────────────────────────────

function Page2B({ report, longevityScore, biologicalAge, scores, v, s, logoPath, watermarkPath, l }: any) {
  const pal = p(v)
  const biomarkers = report?.biomarkers ?? []
  if (biomarkers.length === 0) return null

  const panels: Record<string, any[]> = {}
  biomarkers.forEach((m: any) => {
    if (!panels[m.panel]) panels[m.panel] = []
    panels[m.panel].push(m)
  })

  const panelLabels: Record<string, string> = {
    metabolic:    tr('panel_metabolic', l),
    hormonal:     tr('panel_hormonal', l),
    inflammatory: tr('panel_inflammatory', l),
    epigenetic:   tr('panel_epigenetic', l),
    telomere:     tr('panel_telomere', l),
    omics:        tr('panel_omics', l),
    neuro:        tr('panel_neuro', l),
    cardio:       tr('panel_cardio', l),
  }

  const chronoAge = report?.user?.age ?? 40
  const delta     = chronoAge - biologicalAge
  const IF        = (100 - longevityScore) / 100
  const proj12m   = Math.max(18, biologicalAge - Math.round(IF * 3.2))

  return (
    <Page size="A4" style={s.page} wrap>
      {watermarkPath && <Image src={watermarkPath} style={s.watermark} fixed />}
      <View style={[s.pageHeader, { marginBottom: 14 }]}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {logoPath && <Image src={logoPath} style={[s.logo, { width: 38, height: 38 }]} />}
          <View>
            <Text style={s.brand}>{tr('page2a_brand', l)}</Text>
            <Text style={[s.pageTitle, { fontSize: 17 }]}>{tr('page2b_title', l)}</Text>
            <Text style={{ fontSize: 8, color: pal.textMuted }}>{biomarkers.length} {tr('page2b_analyzed', l)}</Text>
          </View>
        </View>
        <Text style={s.pageNumTop}>{tr('page2a_pagenum', l)} — continued</Text>
      </View>

      {Object.entries(panels).map(([panel, markers]) => (
        <View key={panel} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: pal.borderGold }} />
            <Text style={{ fontSize: 7, color: pal.gold, textTransform: 'uppercase', letterSpacing: 1.5 }}>{panelLabels[panel] ?? cap(panel)}</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: pal.borderGold }} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, justifyContent: 'center' }}>
            {markers.map((marker: any, i: number) => {
              const statusColor =
                marker.status === 'optimal'     ? pal.good
                : marker.status === 'borderline' ? pal.moderate
                : marker.status === 'low'        ? pal.blue
                : marker.status === 'elevated'   ? pal.moderate
                : marker.status === 'critical'   ? pal.critical
                : pal.gold
              const statusBg  = marker.status === 'optimal' ? pal.bgGood : marker.status === 'critical' ? pal.bgCritical : marker.status === 'elevated' || marker.status === 'borderline' ? pal.bgWarning : pal.bgCard
              const statusBrd = marker.status === 'optimal' ? pal.borderGood : marker.status === 'critical' ? pal.borderCrit : marker.status === 'elevated' || marker.status === 'borderline' ? pal.borderWarn : pal.borderNormal

              const hasRange = marker.optimalMin != null && marker.optimalMax != null
              const rangeSpan = hasRange ? (marker.optimalMax - marker.optimalMin) : 100
              const barMin = hasRange ? marker.optimalMin - rangeSpan * 0.5 : 0
              const barMax = hasRange ? marker.optimalMax + rangeSpan * 0.5 : 100
              const pct = hasRange && marker.value != null ? Math.max(2, Math.min(96, ((marker.value - barMin) / (barMax - barMin)) * 100)) : null
              const optStart = hasRange ? ((marker.optimalMin - barMin) / (barMax - barMin)) * 100 : null
              const optEnd   = hasRange ? ((marker.optimalMax - barMin) / (barMax - barMin)) * 100 : null

              return (
                <View key={i} style={{ width: '31%', borderRadius: 7, padding: 8, borderWidth: 1, borderStyle: 'solid', borderColor: statusBrd, backgroundColor: statusBg }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <View style={{ flex: 1, paddingRight: 4 }}>
                      <Text style={{ fontSize: 8, color: pal.text, lineHeight: 1.3 }}>{marker.label}</Text>
                      <Text style={{ fontSize: 6, color: pal.gold, marginTop: 1, textTransform: 'uppercase', letterSpacing: 0.5 }}>{marker.impact} impact</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 13, fontWeight: 700, color: statusColor, lineHeight: 1 }}>{marker.value ?? '—'}</Text>
                      <Text style={{ fontSize: 6.5, color: pal.textLight }}>{marker.unit}</Text>
                      <Text style={{ fontSize: 6, color: statusColor, textTransform: 'uppercase', marginTop: 1 }}>{marker.status}</Text>
                    </View>
                  </View>
                  {pct !== null && optStart !== null && optEnd !== null && (
                    <View style={{ height: 4, borderRadius: 999, backgroundColor: v === 'color' ? '#0D1829' : '#E0E0E0', position: 'relative', marginTop: 3 }}>
                      <View style={{ position: 'absolute', top: 0, height: 4, borderRadius: 999, left: `${optStart}%`, width: `${optEnd - optStart}%`, backgroundColor: pal.bgGood }} />
                      <View style={{ position: 'absolute', top: -1, width: 6, height: 6, borderRadius: 999, backgroundColor: statusColor, left: `${Math.max(0, pct - 3)}%` }} />
                    </View>
                  )}
                  {marker.flagMessage && (
                    <Text style={{ fontSize: 7, color: statusColor, marginTop: 4, lineHeight: 1.3 }}>
                      ⚠ {marker.flagMessage.startsWith('biomarker_flag_') || marker.flagMessage.startsWith('flag_')
                        ? marker.flagMessage.replace('biomarker_flag_', '').replace('flag_', '').replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
                        : marker.flagMessage}
                    </Text>
                  )}
                </View>
              )
            })}
          </View>
        </View>
      ))}

      {/* OPTIMIZATION HORIZON */}
      <View style={s.divider} />
      <Text style={s.label}>{tr('longevity_traj', l)}</Text>
      <Text style={{ fontSize: 14, fontWeight: 700, color: pal.text, marginBottom: 10 }}>{tr('optim_horizon', l)}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {[
          { label: tr('current_score', l), value: longevityScore, color: scoreColor(longevityScore, v), sub: longevityScore >= 80 ? tr('optimal_label', l) : longevityScore >= 65 ? tr('good_label', l) : longevityScore >= 50 ? tr('moderate_label', l) : tr('critical_label', l), brd: scoreBorder(longevityScore, v), bg: scoreBg(longevityScore, v) },
          { label: tr('bio_age_gain', l), value: `-${biologicalAge - proj12m}y`, color: pal.blue, sub: tr('achievable', l), brd: pal.borderBlue, bg: pal.bgBlue },
          { label: tr('delta', l), value: `${delta >= 0 ? '-' : '+'}${Math.abs(delta).toFixed(1)}y`, color: scoreColor(delta >= 0 ? 80 : 35, v), sub: delta >= 0 ? tr('younger_chrono', l) : tr('older_chrono', l), brd: scoreBorder(delta >= 0 ? 80 : 35, v), bg: scoreBg(delta >= 0 ? 80 : 35, v) },
        ].map((m, i) => (
          <View key={i} style={{ flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: m.brd, backgroundColor: m.bg }}>
            <Text style={{ fontSize: 7, color: pal.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>{m.label}</Text>
            <Text style={{ fontSize: 16, fontWeight: 700, color: m.color }}>{m.value}</Text>
            <Text style={{ fontSize: 8, color: pal.textMuted, marginTop: 4 }}>{m.sub}</Text>
          </View>
        ))}
      </View>

      <View style={s.footer}><Text>{tr('footer_p2b', l)}</Text></View>
      <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>
  )
}

// ── PAGE 3A — DAILY PROTOCOL ──────────────────────────────────────────────────

function Page3A({ report, scores, v, s, logoPath, watermarkPath, l }: any) {
  const pal = p(v)
  const dominantPillar  = report?.dominantPillar ?? 'balance'
  const aiProtocolIntro = report?.aiProtocolIntro ?? report?.patternNarrative ?? ''
  const archetypeName   = resolveArchetypeName(report?.profileVector?.archetype?.name ?? '', l)

  const protocols = [
    {
      period: tr('period_morning', l), icon: '○',
      title: tr('morning_title', l),
      objective: tr('morning_obj', l),
      focus: tr('morning_focus', l),
      systems: [
        { title: tr('morning_s1_title', l), desc: tr('morning_s1_desc', l), items: tra('morning_items_s1', l) },
        { title: tr('morning_s2_title', l), desc: tr('morning_s2_desc', l), items: tra('morning_items_s2', l) },
        { title: tr('morning_s3_title', l), desc: tr('morning_s3_desc', l), items: tra('morning_items_s3', l) },
      ],
      borderColor: pal.borderGold, bgColor: v === 'color' ? C.bgGold : BW.bgGold,
    },
    {
      period: tr('period_midday', l), icon: '◐',
      title: tr('midday_title', l),
      objective: tr('midday_obj', l),
      focus: tr('midday_focus', l),
      systems: [
        { title: tr('midday_s1_title', l), desc: tr('midday_s1_desc', l), items: tra('midday_items_s1', l) },
        { title: tr('midday_s2_title', l), desc: tr('midday_s2_desc', l), items: tra('midday_items_s2', l) },
        { title: tr('midday_s3_title', l), desc: tr('midday_s3_desc', l), items: tra('midday_items_s3', l) },
      ],
      borderColor: pal.borderBlue, bgColor: pal.bgBlue,
    },
    {
      period: tr('period_evening', l), icon: '●',
      title: tr('evening_title', l),
      objective: tr('evening_obj', l),
      focus: tr('evening_focus', l),
      systems: [
        { title: tr('evening_s1_title', l), desc: tr('evening_s1_desc', l), items: tra('evening_items_s1', l) },
        { title: tr('evening_s2_title', l), desc: tr('evening_s2_desc', l), items: tra('evening_items_s2', l) },
        { title: tr('evening_s3_title', l), desc: tr('evening_s3_desc', l), items: tra('evening_items_s3', l) },
      ],
      borderColor: v === 'color' ? '#1A5C2E' : BW.borderGood, bgColor: v === 'color' ? C.bgGood : BW.bgGood,
    },
  ]

  return (
    <Page size="A4" style={s.page} wrap>
      {watermarkPath && <Image src={watermarkPath} style={s.watermark} fixed />}
      <View style={[s.pageHeader, { marginBottom: 14 }]}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {logoPath && <Image src={logoPath} style={[s.logo, { width: 38, height: 38 }]} />}
          <View>
            <Text style={s.brand}>{tr('page3a_brand', l)}</Text>
            <Text style={[s.pageTitle, { fontSize: 17 }]}>{tr('page3a_title', l)}</Text>
            <Text style={[s.pageSub, { fontSize: 7.5 }]}>{tr('page3a_sub', l)}</Text>
          </View>
        </View>
        <Text style={s.pageNumTop}>{tr('page3a_pagenum', l)}</Text>
      </View>

      {/* 3 COLUMNS */}
      <View style={{ flexDirection: 'row', gap: 7 }}>
        {protocols.map((proto) => (
          <View key={proto.period} style={{ flex: 1, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: proto.borderColor, backgroundColor: proto.bgColor, padding: 10 }}>
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              
              <Text style={{ fontSize: 6.5, color: pal.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{proto.period}</Text>
              <Text style={{ fontSize: 10, fontWeight: 700, color: pal.text, textAlign: 'center', lineHeight: 1.3 }}>{proto.title}</Text>
            </View>
            <Text style={[s.bodySmall, { textAlign: 'center', marginBottom: 8, fontSize: 7.5 }]}>{proto.objective}</Text>
            {/* Strategic Focus */}
            <View style={{ borderRadius: 6, padding: 7, marginBottom: 7, borderWidth: 1, borderStyle: 'solid', borderColor: pal.borderGold, backgroundColor: v === 'color' ? '#120E03' : '#FFFDF0' }}>
              <Text style={{ fontSize: 6, color: pal.gold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{tr('strategic_focus', l)}</Text>
              <Text style={[s.bodySmall, { fontSize: 7 }]}>{proto.focus}</Text>
            </View>
            {/* Systems */}
            {proto.systems.map((sys, i) => (
              <View key={i} style={{ borderRadius: 6, padding: 7, marginBottom: 5, borderWidth: 1, borderStyle: 'solid', borderColor: pal.borderNormal, backgroundColor: pal.bgCard }}>
                <Text style={{ fontSize: 6.5, color: pal.gold, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{sys.title}</Text>
                <Text style={[s.bodySmall, { marginBottom: 5, fontSize: 7 }]}>{sys.desc}</Text>
                <View style={s.tagsRow}>
                  {sys.items.map((item, j) => (
                    <Text key={j} style={[s.tag, { fontSize: 6.5 }]}>{item}</Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
{/* INTELLIGENCE MATRIX */}
      <View style={[s.cardGold, { marginTop: 12 }]} break>
        <Text style={s.label}>{tr('matrix_label', l)}</Text>
        <Text style={{ fontSize: 13, fontWeight: 700, color: pal.text, marginBottom: 5 }}>
          {archetypeName ? `${archetypeName} — ${tr('optim_protocol', l)}` : `${cap(dominantPillar)} ${tr('optim_phase', l)}`}
        </Text>
        {aiProtocolIntro ? <Text style={s.body}>{aiProtocolIntro}</Text> : null}
      </View>
      <View style={s.footer}><Text>{tr('footer_p3a', l)}</Text></View>
      <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>
  )
}

// ── PAGE 3B — ROADMAP ─────────────────────────────────────────────────────────

function Page3B({ report, scores, v, s, logoPath, watermarkPath, l }: any) {
  const pal = p(v)
  const weaknesses     = report?.weaknesses ?? []
  const dominantPillar = report?.dominantPillar ?? 'balance'
  const pillarScores   = report?.pillarScores ?? {}

  const w = (i: number, fb: string) => weaknesses[i] ?? fb
  const sc = (cat: string) => scores[cat] != null ? ` (${scores[cat]}/100)` : ''

  const roadmap = [
    {
      time: tr('r30_time', l), title: tr('r30_title', l),
      color: pal.gold, border: pal.borderGold, bg: v === 'color' ? C.bgGold : BW.bgGold,
      desc: `${cap(dominantPillar)} ${pillarScores[dominantPillar] ?? 0}/100 — ${tr('stabilization', l)}. ${cap(w(0, 'stress'))} & ${cap(w(1, 'sleep'))} ${tr('restoration', l)}.`,
      systems: [`${cap(dominantPillar)} ${tr('stabilization', l)}`, `${cap(w(0, 'stress'))} ${tr('recovery_l', l)}`, `${cap(w(1, 'sleep'))} ${tr('restoration', l)}`],
      metrics: [`${cap(w(0, 'stress'))}${sc(w(0, 'stress'))} ↗`, `${cap(w(1, 'sleep'))}${sc(w(1, 'sleep'))} ↗`, `${cap(dominantPillar)} ↗`],
      interventions: tra('r30_inter', l),
      next: `${tr('unlocks', l)} ${cap(w(2, 'energy'))} & ${cap(w(3, 'recovery'))} ${tr('restoration', l)}`,
    },
    {
      time: tr('r90_time', l), title: tr('r90_title', l),
      color: pal.blue, border: pal.borderBlue, bg: pal.bgBlue,
      desc: `${cap(w(0, 'stress'))} & ${cap(w(1, 'sleep'))} ${tr('stabilization', l)} → ${cap(w(2, 'energy'))}${sc(w(2, 'energy'))} & ${cap(w(3, 'recovery'))}${sc(w(3, 'recovery'))} ${tr('optimization_l', l)}.`,
      systems: [`${cap(w(2, 'energy'))} ${tr('optimization_l', l)}`, `${cap(w(3, 'recovery'))} ${tr('enhancement', l)}`, tr('hormonal_bal', l)],
      metrics: [`${cap(w(2, 'energy'))}${sc(w(2, 'energy'))} ↗`, `${cap(w(3, 'recovery'))}${sc(w(3, 'recovery'))} ↗`, `${tr('bio_age_abbr', l)} ↘`],
      interventions: tra('r90_inter', l),
      next: `${tr('unlocks', l)} ${cap(w(4, 'inflammation'))} ${tr('regulation', l)}`,
    },
    {
      time: tr('r6m_time', l), title: tr('r6m_title', l),
      color: pal.blue, border: pal.borderBlue, bg: pal.bgBlue,
      desc: `${cap(w(4, 'inflammation'))}${sc(w(4, 'inflammation'))} ${tr('regulation', l)} — ${tr('autonomic_flex', l)} — ${tr('recovery_sync', l)}.`,
      systems: [`${cap(w(4, 'inflammation'))} ${tr('regulation', l)}`, tr('autonomic_flex', l), tr('recovery_sync', l)],
      metrics: [`${cap(w(4, 'inflammation'))}${sc(w(4, 'inflammation'))} ↘`, `${tr('resilience_l', l)} ↗`, `${tr('performance_l', l)} ↗`],
      interventions: tra('r6m_inter', l),
      next: `${tr('unlocks', l)} ${cap(w(5, 'longevity'))} & ${tr('vitality', l)}`,
    },
    {
      time: tr('r12m_time', l), title: tr('r12m_title', l),
      color: pal.good, border: pal.borderGood, bg: pal.bgGood,
      desc: `${cap(w(5, 'longevity'))}${sc(w(5, 'longevity'))} ${tr('mastery', l)} — ${tr('cellular_res', l)} — ${tr('senolytic', l)}.`,
      systems: [tr('cellular_res', l), tr('senolytic', l), `${cap(w(5, 'longevity'))} ${tr('mastery', l)}`],
      metrics: [`${cap(w(5, 'longevity'))}${sc(w(5, 'longevity'))} ↗`, `${tr('vitality', l)} ↗`, `${tr('bio_age_abbr', l)} ↘`],
      interventions: tra('r12m_inter', l),
      next: tr('foundation_complete', l),
    },
  ]

  return (
    <Page size="A4" style={s.page} wrap>
      {watermarkPath && <Image src={watermarkPath} style={s.watermark} fixed />}
      <View style={[s.pageHeader, { marginBottom: 14 }]}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {logoPath && <Image src={logoPath} style={[s.logo, { width: 38, height: 38 }]} />}
          <View>
            <Text style={s.brand}>{tr('page3b_brand', l)}</Text>
            <Text style={[s.pageTitle, { fontSize: 17 }]}>{tr('page3b_title', l)}</Text>
          </View>
        </View>
        <Text style={s.pageNumTop}>{tr('page3a_pagenum', l)} — continued</Text>
      </View>

      <Text style={[s.body, { marginBottom: 12 }]}>{tr('roadmap_intro', l)} {dominantPillar} {tr('roadmap_intro2', l)}</Text>

      {roadmap.map((item, i) => (
        <View key={i} break={i === 3} style={{ marginBottom: 10, padding: 12, borderRadius: 8, borderWidth: 1, borderStyle: 'solid', borderColor: item.border, backgroundColor: item.bg }}>
          <Text style={{ fontSize: 7.5, color: item.color, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 3 }}>{item.time}</Text>
          <Text style={{ fontSize: 13, fontWeight: 700, color: pal.text, marginBottom: 5, lineHeight: 1.2 }}>{item.title}</Text>
          <Text style={[s.bodySmall, { marginBottom: 8 }]}>{item.desc}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: '28%' }}>
              <Text style={{ fontSize: 6.5, color: item.color, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{tr('r30_systems_label', l)}</Text>
              {item.systems.map((sys, j) => <Text key={j} style={{ fontSize: 7.5, color: pal.textMuted, marginBottom: 2 }}>· {sys}</Text>)}
            </View>
            <View style={{ width: '28%' }}>
              <Text style={{ fontSize: 6.5, color: item.color, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{tr('r30_metrics_label', l)}</Text>
              <View style={s.tagsRow}>
                {item.metrics.map((m2, j) => {
                  const isUp = m2.includes('↗')
                  const clean = m2.replace('↗', '').replace('↘', '').trim()
                  return <Text key={j} style={[s.tag, { borderColor: item.border, color: item.color, backgroundColor: item.bg, fontSize: 6.5 }]}>{clean} {isUp ? '↗' : '↘'}</Text>
                })}
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 6.5, color: item.color, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{tr('r30_interventions', l)}</Text>
              <View style={s.tagsRow}>
                {item.interventions.map((iv, j) => <Text key={j} style={[s.tag, { fontSize: 6.5 }]}>{iv}</Text>)}
              </View>
            </View>
          </View>
          <Text style={{ fontSize: 7, color: item.color, marginTop: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>→ {item.next}</Text>
        </View>
      ))}

      <View style={s.footer}><Text>{tr('footer_p3b', l)}</Text></View>
      <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>
  )
}

// ── PAGE 3C — STACK + SYNTHESIS + LEGAL ───────────────────────────────────────

function Page3C({ report, scores, v, s, logoPath, watermarkPath, l }: any) {
  const pal = p(v)
  const aiSynthesis      = report?.aiSynthesis ?? ''
  const ingredientOverlaps = report?.ingredientOverlaps ?? []
  const protocolProducts   = report?.protocolProducts ?? []

  const productGroups = ['activate', 'balance', 'protect', 'restore'].map((phase) => ({
    phase,
    products: protocolProducts.filter((pr: any) => pr.protocol_phase === phase),
  })).filter((g: any) => g.products.length > 0)

  return (
    <Page size="A4" style={s.page} wrap>
      {watermarkPath && <Image src={watermarkPath} style={s.watermark} fixed />}
      <View style={[s.pageHeader, { marginBottom: 14 }]}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          {logoPath && <Image src={logoPath} style={[s.logo, { width: 38, height: 38 }]} />}
          <View>
            <Text style={s.brand}>{tr('page3c_brand', l)}</Text>
            <Text style={[s.pageTitle, { fontSize: 17 }]}>{tr('page3c_title', l)}</Text>
          </View>
        </View>
        <Text style={s.pageNumTop}>{tr('page3a_pagenum', l)} — continued</Text>
      </View>

      {/* PRODUCTS */}
      <View style={[s.cardGold, { marginBottom: 12 }]}>
        <Text style={s.label}>{tr('core_stack', l)}</Text>
        <Text style={{ fontSize: 8, color: pal.gold, marginBottom: 8, fontStyle: 'italic' }}>{tr('coming_soon', l)}</Text>
        {productGroups.length > 0 ? productGroups.map((group: any) => (
          <View key={group.phase} style={{ marginBottom: 8 }}>
            <Text style={[s.label, { marginBottom: 5, color: pillarCol(group.phase, v).text }]}>{tr(`pillar_${group.phase}`, l)}</Text>
            {group.products.map((product: any, i: number) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 7, borderRadius: 6, marginBottom: 4, borderWidth: 1, borderStyle: 'solid', borderColor: pal.borderNormal, backgroundColor: pal.bgCard }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 9, color: pal.text, fontWeight: 700 }}>{product.name}</Text>
                  <Text style={{ fontSize: 7.5, color: pal.gold, marginTop: 2 }}>{product.category}</Text>
                  <Text style={{ fontSize: 7.5, color: pal.textMuted, marginTop: 2 }}>{product.usage}</Text>
                </View>
              </View>
            ))}
          </View>
        )) : <Text style={s.bodySmall}>{tr('no_products', l)}</Text>}
      </View>

      {/* INGREDIENT OVERLAP TABLE */}
      {ingredientOverlaps.length > 0 && (
        <>
          <Text style={s.label}>{tr('cumulative', l)}</Text>
          <Text style={{ fontSize: 13, fontWeight: 700, color: pal.text, marginBottom: 4 }}>{tr('daily_overlap', l)}</Text>
          <Text style={{ fontSize: 7.5, color: pal.textMuted, marginBottom: 8 }}>{tr('overlap_note', l)}</Text>
          <View style={s.tableHeader}>
            {[tr('ingredient', l), tr('intake', l), tr('col_optimal', l), tr('col_status', l)].map((col, i) => (
              <Text key={i} style={{ flex: i === 0 ? 2 : 1, fontSize: 7, color: pal.textLight, textTransform: 'uppercase', letterSpacing: 1, textAlign: i === 0 ? 'left' : 'center' }}>{col}</Text>
            ))}
          </View>
          {ingredientOverlaps.map((item: any, i: number) => {
            const statusColor = item.exceedsUpper ? pal.critical : item.color === '#D97C7C' ? pal.moderate : item.color === '#D6C27A' ? pal.moderate : pal.good
            const statusBg    = item.exceedsUpper ? pal.bgCritical : item.color === '#D97C7C' ? pal.bgWarning : item.color === '#D6C27A' ? pal.bgWarning : pal.bgGood
            const statusBrd   = item.exceedsUpper ? pal.borderCrit : item.color === '#D97C7C' ? pal.borderWarn : item.color === '#D6C27A' ? pal.borderWarn : pal.borderGood
            const statusLabel = item.exceedsUpper ? tr('status_limit', l) : item.color === '#D97C7C' ? tr('status_high', l) : item.color === '#D6C27A' ? tr('status_elevated', l) : tr('status_optimal', l)
            return (
              <View key={i} style={s.tableRow}>
                <Text style={{ flex: 2, fontSize: 8.5, color: pal.text }}>{item.name}</Text>
                <Text style={{ flex: 1, fontSize: 8.5, color: pal.text, textAlign: 'center' }}>{item.total}{item.unit}</Text>
                <Text style={{ flex: 1, fontSize: 8, color: pal.textMuted, textAlign: 'center' }}>{item.optimal}{item.unit}</Text>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 6.5, borderRadius: 3, paddingVertical: 2, paddingHorizontal: 5, color: statusColor, borderWidth: 1, borderStyle: 'solid', borderColor: statusBrd, backgroundColor: statusBg }}>{statusLabel}</Text>
                </View>
              </View>
            )
          })}
          <View style={s.divider} />
        </>
      )}

      {/* EXECUTIVE SYNTHESIS */}
      {aiSynthesis ? (
        <>
          <View break />
          <Text style={s.label}>{tr('exec_synthesis', l)}</Text>
          <View style={s.card}><Text style={[s.body, { fontSize: 9.5, lineHeight: 1.9 }]}>{aiSynthesis}</Text></View>
          <View style={s.divider} />
        </>
      ) : null}

      {/* LEGAL */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={[s.label, { marginBottom: 5 }]}>{tr('confidentiality', l)}</Text>
          <Text style={[s.bodySmall, { marginBottom: 4 }]}>{tr('conf_p1', l)}</Text>
          <Text style={[s.bodySmall, { marginBottom: 4 }]}>{tr('conf_p2', l)}</Text>
          <Text style={s.bodySmall}>{tr('conf_p3', l)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[s.label, { marginBottom: 5 }]}>{tr('disclaimer', l)}</Text>
          <Text style={[s.bodySmall, { marginBottom: 4 }]}>{tr('disc_p1', l)}</Text>
          <Text style={[s.bodySmall, { marginBottom: 4 }]}>{tr('disc_p2', l)}</Text>
          <Text style={s.bodySmall}>{tr('disc_p3', l)}</Text>
        </View>
      </View>

      {/* FOOTER LEGAL */}
      <View style={{ paddingTop: 10, borderTopWidth: 1, borderTopColor: pal.borderGold, borderTopStyle: 'solid' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <View>
            <Text style={{ fontSize: 7.5, color: pal.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>{tr('copyright', l)}</Text>
            <Text style={{ fontSize: 7, color: pal.textLight }}>www.lonaralabs.com — app.lonaralabs.com</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 7, color: pal.gold, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 }}>{tr('proprietary', l)}</Text>
            <Text style={{ fontSize: 7, color: pal.textLight }}>{tr('generated_through', l)}</Text>
          </View>
        </View>
      </View>

      <Text style={s.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} fixed />
    </Page>
  )
}

// ── EXPORT ────────────────────────────────────────────────────────────────────

export default function PDFReport({
  fullName, scores, insights, protocols,
  longevityScore, biologicalAge,
  report, variant = 'bw', tier = 'member',
  showPage1 = true, showPage2, showPage3 = true,
  logoPath, watermarkPath, locale = 'en',
}: PDFReportProps) {
  const v = variant
  const l = locale
  const s = makeStyles(v)
  const fullAccess = showPage2 ?? (tier === 'executive' || tier === 'premium')
  const shared = { report, scores, v, s, logoPath, watermarkPath, l }

  return (
    <Document>
      {showPage1 && <Page1A {...shared} fullName={fullName} longevityScore={longevityScore} biologicalAge={biologicalAge} l={l} />}
      {showPage1 && <Page1B {...shared} l={l} />}
      {fullAccess && <Page2A {...shared} longevityScore={longevityScore} biologicalAge={biologicalAge} l={l} />}
      {fullAccess && <Page2B {...shared} longevityScore={longevityScore} biologicalAge={biologicalAge} l={l} />}
      {showPage3 && <Page3A {...shared} l={l} />}
      {showPage3 && <Page3B {...shared} l={l} />}
      {showPage3 && <Page3C {...shared} l={l} />}
    </Document>
  )
}