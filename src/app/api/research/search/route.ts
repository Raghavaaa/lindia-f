import { NextRequest, NextResponse } from 'next/server';

// Query-specific research templates
function generateResearchResponse(query: string, clientId: string, adminPrompt?: string) {
  const lowerQuery = query.toLowerCase();
  
  // Determine topic-specific content
  let topic = 'general legal matter';
  let specificProvisions = [];
  let keyCases = [];
  let specificAnalysis = '';
  let recommendations = [];
  
  // Property-related queries
  if (lowerQuery.includes('property') || lowerQuery.includes('title') || lowerQuery.includes('deed') || 
      lowerQuery.includes('land') || lowerQuery.includes('adverse possession')) {
    topic = 'property law';
    specificProvisions = [
      'Transfer of Property Act, 1882 - Sections 5, 54, 58',
      'Registration Act, 1908 - Sections 17, 49',
      'Indian Easements Act, 1882',
      'Limitation Act, 1963 - Article 65 (for adverse possession)'
    ];
    keyCases = [
      'Karnataka Board of Wakf vs. Govt. of India (2004) - Adverse possession principles',
      'Ravinder Kaur Grewal vs. Manjit Kaur (2019) - Title disputes',
      'T. Anjanappa vs. Somalingappa (2006) - Property transfer'
    ];
    specificAnalysis = `### Property Law Framework

**Title Verification Requirements:**
- Chain of title for at least 30 years
- Encumbrance certificate from Sub-Registrar
- Municipal tax receipts and clearances
- NOC from relevant authorities (if applicable)

**Transfer Procedures:**
1. Due diligence and title search
2. Sale deed drafting and verification
3. Payment of stamp duty (varies by state: typically 5-7% of property value)
4. Registration within 4 months of execution
5. Mutation of property records

**Common Issues:**
- Disputed ownership or partition
- Unregistered/defective documents
- Encumbrances and liens
- Adverse possession claims
- Violations of building regulations`;
    
    recommendations = [
      'Conduct thorough title search for minimum 30 years',
      'Verify all property documents with Sub-Registrar office',
      'Obtain encumbrance certificate and tax receipts',
      'Check for any pending litigation regarding the property',
      'Ensure compliance with local municipal regulations'
    ];
  }
  
  // Contract-related queries
  else if (lowerQuery.includes('contract') || lowerQuery.includes('agreement') || lowerQuery.includes('breach')) {
    topic = 'contract law';
    specificProvisions = [
      'Indian Contract Act, 1872 - Sections 10, 23, 73 (damages for breach)',
      'Specific Relief Act, 1963 - Sections 10, 14, 20 (specific performance)',
      'Sale of Goods Act, 1930'
    ];
    keyCases = [
      'Satyabrata Ghose vs. Mugneeram Bangur & Co. (1954) - Doctrine of frustration',
      'Bhagwandas Goverdhandas Kedia vs. Girdharilal Parshottamdas (1966) - Breach of contract',
      'Smt. Ganga Bai vs. Vijay Kumar (1974) - Specific performance'
    ];
    specificAnalysis = `### Contract Law Principles

**Essential Elements of Valid Contract:**
1. Offer and Acceptance
2. Lawful Consideration
3. Capacity to Contract
4. Free Consent
5. Lawful Object
6. Agreement not expressly declared void

**Remedies for Breach:**
- **Damages**: Compensation for actual loss (Section 73)
- **Specific Performance**: Court-ordered execution of contract
- **Injunction**: Preventing breach of negative covenant
- **Quantum Meruit**: Payment for work done

**Contract Interpretation:**
- Plain meaning rule
- Contra proferentem (against the drafter)
- Business efficacy test
- Intention of parties paramount`;
    
    recommendations = [
      'Review contract terms for ambiguity or unfair clauses',
      'Document all communications and breaches in detail',
      'Calculate actual damages and consequential losses',
      'Consider alternative dispute resolution (arbitration/mediation)',
      'Preserve all evidence of contract execution and breach'
    ];
  }
  
  // Criminal law queries
  else if (lowerQuery.includes('criminal') || lowerQuery.includes('ipc') || lowerQuery.includes('bail') || 
           lowerQuery.includes('fir') || lowerQuery.includes('charge') || lowerQuery.includes('murder') ||
           lowerQuery.includes('attempt') || lowerQuery.includes('homicide') || lowerQuery.includes('assault') ||
           lowerQuery.includes('rape') || lowerQuery.includes('theft') || lowerQuery.includes('robbery') ||
           lowerQuery.includes('kidnapping') || lowerQuery.includes('cheating') || lowerQuery.includes('forgery') ||
           lowerQuery.includes('defamation') || lowerQuery.includes('dowry') || lowerQuery.includes('riot') ||
           lowerQuery.includes('accused') || lowerQuery.includes('victim') || lowerQuery.includes('police') ||
           lowerQuery.includes('investigation') || lowerQuery.includes('arrest') || lowerQuery.includes('detention')) {
    topic = 'criminal law';
    
    // Check if query is specifically about murder/attempt to murder
    const isMurderQuery = lowerQuery.includes('murder') || lowerQuery.includes('homicide') || 
                          lowerQuery.includes('killing') || lowerQuery.includes('death');
    
    specificProvisions = [
      'Indian Penal Code, 1860 (IPC)',
      'Code of Criminal Procedure, 1973 (CrPC) - Sections 41, 154 (FIR), 167, 437-439 (Bail)',
      'Indian Evidence Act, 1872'
    ];
    
    if (isMurderQuery) {
      specificProvisions = [
        'Section 300 IPC - Murder (punishment under Section 302)',
        'Section 307 IPC - Attempt to Murder',
        'Section 304 IPC - Culpable Homicide not amounting to Murder',
        'Section 299 IPC - Culpable Homicide',
        'Section 34 IPC - Acts done by several persons in furtherance of common intention',
        'Code of Criminal Procedure, 1973 (CrPC) - Sections 154 (FIR), 437-439 (Bail)',
        'Indian Evidence Act, 1872 - Sections 27, 32 (Dying Declaration)'
      ];
    }
    
    keyCases = isMurderQuery ? [
      'K.M. Nanavati vs. State of Maharashtra (1962) - Murder vs. Culpable Homicide distinction',
      'State of Maharashtra vs. Mohan Shamaji Gawali (2008) - Attempt to Murder ingredients',
      'Virsa Singh vs. State of Punjab (1958) - Intention vs. Knowledge in murder',
      'Reg vs. Govinda (1876) - Reasonable doubt principle',
      'Sharad Birdhichand Sarda vs. State of Maharashtra (1984) - Circumstantial evidence'
    ] : [
      'State of Rajasthan vs. Balchand (1977) - Bail principles',
      'Sanjay Chandra vs. CBI (2012) - Bail in economic offenses',
      'Arnesh Kumar vs. State of Bihar (2014) - Arrest procedures'
    ];
    if (isMurderQuery) {
      specificAnalysis = `### Criminal Law Framework - Murder / Attempt to Murder

**Section 307 IPC - Attempt to Murder:**
- **Essential Ingredients:**
  1. Act done with intent to cause death or with knowledge that act is likely to cause death
  2. Under such circumstances that if death was caused, offender would be guilty of murder
  3. Some hurt must have been caused to the victim

- **Punishment**: Imprisonment up to 10 years + fine; if hurt caused, life imprisonment + fine

**Section 300 IPC - Murder:**
- **Definition**: Culpable homicide is murder if:
  1. Act done with **intention** of causing death
  2. With intention of causing such bodily injury as offender knows is likely to cause death
  3. With intention of causing bodily injury sufficient in ordinary course to cause death
  4. Person committing act knows it is so imminently dangerous that in all probability it must cause death

- **Punishment (Section 302)**: Death penalty or life imprisonment + fine

**Section 304 IPC - Culpable Homicide Not Amounting to Murder:**
- When act causing death done:
  - With intention to cause death but without premeditation (grave & sudden provocation)
  - With knowledge that it is likely to cause death but without intention to cause death
- **Punishment**: 
  - Part I: Life imprisonment or up to 10 years + fine
  - Part II: Up to 10 years or fine or both

**Distinction: Murder vs. Culpable Homicide:**
| Factor | Murder | Culpable Homicide |
|--------|--------|-------------------|
| Intention | Clear intention to kill | Intention without premeditation |
| Knowledge | Knows death will result | Knows death may result |
| Gravity | Most heinous | Less grave |

**Key Legal Tests:**
1. **Intention Test**: Did accused intend to cause death? (Section 300 IPC)
2. **Knowledge Test**: Did accused know the act would likely cause death? (Section 307 IPC)
3. **Bodily Injury Test**: Was injury sufficient in ordinary course to cause death? (Section 300)
4. **Provocation Test**: Was there grave and sudden provocation? (Exception to Section 300)

**FIR and Investigation:**
- FIR mandatory for murder/attempt (cognizable, non-bailable offense)
- Section 174 CrPC: Police to inquire into all unnatural deaths
- Post-mortem examination mandatory
- Scene of crime investigation & forensic evidence collection
- Witness statements under Section 161 CrPC
- Charge sheet within 60-90 days

**Bail Provisions:**
- **Murder (Section 302)**: Bail extremely difficult; Sessions Court/High Court only
- **Attempt to Murder (Section 307)**: Bail possible but requires strong grounds
- **Factors for Bail**:
  - Severity of offense (murder/attempt is grave)
  - Evidence strength (eyewitness, forensic, dying declaration)
  - Risk of tampering/influencing witnesses
  - Previous criminal record
  - Flight risk

**Trial Process:**
1. **Sessions Trial** (murder triable by Sessions Court only)
2. **Charge framing** under Section 228-232 CrPC
3. **Prosecution Evidence**: Eyewitnesses, forensic reports, dying declaration
4. **Statement of Accused** (Section 313 CrPC)
5. **Defense Evidence**: Alibi, self-defense plea
6. **Arguments** on facts, law, and precedents
7. **Judgment**: Acquittal or conviction with sentencing

**Defenses Available:**
1. **Right of Private Defense** (Section 100 IPC): Defense of self/property
2. **Accident** (Section 80 IPC): Death caused by accident without criminal intent
3. **Insanity** (Section 84 IPC): Unsoundness of mind at time of offense
4. **Grave & Sudden Provocation**: Reduces murder to culpable homicide
5. **Alibi**: Accused was elsewhere when offense occurred

**Evidence Requirements:**
- **Direct Evidence**: Eyewitness testimony
- **Circumstantial Evidence**: Chain must be complete (no missing links)
- **Forensic Evidence**: DNA, fingerprints, ballistics, autopsy report
- **Dying Declaration** (Section 32): Statement of victim before death (if reliable)
- **Recovery of Weapon**: Under Section 27, Evidence Act
- **Motive**: Strengthens case but not essential`;

      recommendations = [
        'Engage experienced criminal defense counsel immediately',
        'Gather all alibi evidence, witnesses, and supporting documents',
        'Do NOT make any statement to police without lawyer present',
        'Apply for bail with strong grounds (if applicable)',
        'Challenge weak forensic/circumstantial evidence through expert testimony',
        'Explore defenses: self-defense, accident, provocation, or lack of intention',
        'Ensure all procedural safeguards (Section 313, 311 CrPC) are followed',
        'Consider settlement/compromise (if attempt and victim willing)'
      ];
    } else {
      specificAnalysis = `### Criminal Law Framework

**FIR and Investigation:**
- FIR mandatory for cognizable offenses (Section 154 CrPC)
- Police investigation and charge sheet within 60/90 days
- Magisterial inquiry for non-cognizable offenses

**Bail Provisions:**
- **Regular Bail**: Section 437 CrPC (Magistrate), 439 (High Court/Sessions)
- **Anticipatory Bail**: Section 438 CrPC (before arrest)
- **Default Bail**: Section 167(2) - if charge sheet not filed in time

**Bail Considerations:**
- Nature and gravity of offense
- Character of accused
- Severity of punishment
- Risk of tampering with evidence
- Likelihood of fleeing from justice

**Trial Process:**
1. Charge framing (Section 228-239)
2. Evidence by prosecution
3. Statement of accused (Section 313)
4. Defense evidence
5. Arguments and judgment`;
      
      recommendations = [
        'Ensure FIR contains all necessary details and is properly recorded',
        'Apply for bail at earliest opportunity with proper grounds',
        'Maintain detailed records of all procedural compliance',
        'Preserve all alibi evidence and witness statements',
        'Consider anticipatory bail if apprehension of arrest exists'
      ];
    }
  }
  
  // Family law queries
  else if (lowerQuery.includes('divorce') || lowerQuery.includes('marriage') || lowerQuery.includes('custody') || 
           lowerQuery.includes('maintenance') || lowerQuery.includes('alimony')) {
    topic = 'family law';
    specificProvisions = [
      'Hindu Marriage Act, 1955 - Sections 9 (restitution), 13 (divorce), 24-25 (maintenance)',
      'Special Marriage Act, 1954',
      'Muslim Personal Law (Shariat) Application Act, 1937',
      'Hindu Adoption and Maintenance Act, 1956',
      'Protection of Women from Domestic Violence Act, 2005'
    ];
    keyCases = [
      'Vishaka vs. State of Rajasthan (1997) - Women\'s rights',
      'Prakash vs. Phulavati (2016) - Grounds for divorce',
      'Rajnesh vs. Neha (2021) - Maintenance and custody'
    ];
    specificAnalysis = `### Family Law Principles

**Grounds for Divorce (Section 13, Hindu Marriage Act):**
- Adultery
- Cruelty (mental or physical)
- Desertion for 2 years
- Conversion to another religion
- Mental disorder or leprosy
- Presumption of death (7 years absence)

**Child Custody:**
- **Welfare of child** is paramount consideration
- Natural guardian (mother till 5 years for child, 18 for girl)
- Joint custody increasingly preferred
- Visitation rights for non-custodial parent

**Maintenance:**
- **Section 125 CrPC**: Universal maintenance provision
- **Section 24 HMA**: Interim maintenance during proceedings
- **Section 25 HMA**: Permanent alimony
- Amount based on: income, needs, standard of living, fault`;
    
    recommendations = [
      'Document all instances of cruelty or grounds for divorce',
      'Maintain evidence of income and expenses for maintenance claims',
      'Consider child\'s best interests in custody arrangements',
      'Explore mediation for amicable settlement',
      'Preserve financial documents and marriage records'
    ];
  }
  
  // Employment/labor law queries
  else if (lowerQuery.includes('employment') || lowerQuery.includes('termination') || lowerQuery.includes('labor') || 
           lowerQuery.includes('workplace') || lowerQuery.includes('wrongful')) {
    topic = 'employment and labor law';
    specificProvisions = [
      'Industrial Disputes Act, 1947',
      'Employees\' Provident Funds Act, 1952',
      'Payment of Gratuity Act, 1972',
      'Shops and Establishments Act (State-specific)',
      'Sexual Harassment of Women at Workplace Act, 2013'
    ];
    keyCases = [
      'Delhi Transport Corporation vs. DTC Mazdoor Congress (1991) - Unfair labor practices',
      'Workmen of Firestone Tyre vs. Management (1973) - Retrenchment',
      'Vishaka vs. State of Rajasthan (1997) - Workplace harassment'
    ];
    specificAnalysis = `### Employment Law Framework

**Wrongful Termination:**
- Notice period requirements (typically 30-90 days)
- Just cause requirement for dismissal
- Principles of natural justice (show cause notice, hearing)
- Retrenchment compensation (Section 25F, Industrial Disputes Act)

**Employee Rights:**
- Provident Fund (EPF) contributions
- Gratuity after 5 years of service
- Leave entitlements (earned, casual, sick)
- Equal pay and non-discrimination

**Employer Obligations:**
- Maintain service records
- Issue experience/relieving certificates
- Final settlement within specified time
- Compliance with labor laws
- Internal Complaints Committee (ICC) for harassment`;
    
    recommendations = [
      'Review employment contract and company policies thoroughly',
      'Document all communications regarding termination',
      'Calculate dues: salary, PF, gratuity, leave encashment, notice pay',
      'File complaint with labor commissioner if settlement not reached',
      'Consider conciliation before approaching labor court'
    ];
  }
  
  // IP/Copyright queries
  else if (lowerQuery.includes('copyright') || lowerQuery.includes('trademark') || lowerQuery.includes('patent') || 
           lowerQuery.includes('intellectual property') || lowerQuery.includes('ip')) {
    topic = 'intellectual property law';
    specificProvisions = [
      'Copyright Act, 1957',
      'Trade Marks Act, 1999',
      'Patents Act, 1970',
      'Designs Act, 2000',
      'Information Technology Act, 2000 (for digital IP)'
    ];
    keyCases = [
      'R.G. Anand vs. M/s Delux Films (1978) - Copyright infringement test',
      'Bajaj Auto vs. TVS Motor Company (2009) - Trade dress',
      'Novartis vs. Union of India (2013) - Patent standards'
    ];
    specificAnalysis = `### Intellectual Property Framework

**Copyright Protection:**
- Automatic upon creation (registration not mandatory but advisable)
- Term: Author's life + 60 years
- Covers: literary, artistic, musical, dramatic works
- Fair use exceptions: research, criticism, news reporting

**Trademark Protection:**
- Registration for 10 years (renewable)
- Protection of brand identity
- Infringement test: likelihood of confusion
- Well-known mark gets wider protection

**Patent Protection:**
- Term: 20 years from filing date
- Requires: novelty, inventive step, industrial application
- Disclosure in specification mandatory
- Compulsory licensing provisions`;
    
    recommendations = [
      'Register IP rights promptly for stronger protection',
      'Maintain detailed records of creation and first use',
      'Monitor market for potential infringements',
      'Use cease and desist notices for early-stage infringement',
      'Consider international registration (Madrid Protocol for TM, PCT for patents)'
    ];
  }
  
  // Tax law queries
  else if (lowerQuery.includes('tax') || lowerQuery.includes('gst') || lowerQuery.includes('income tax') || 
           lowerQuery.includes('assessment')) {
    topic = 'taxation law';
    specificProvisions = [
      'Income Tax Act, 1961',
      'Goods and Services Tax Act, 2017 (GST)',
      'Central Excise Act, 1944',
      'Customs Act, 1962'
    ];
    keyCases = [
      'Vodafone International Holdings vs. Union of India (2012) - Tax jurisdiction',
      'Commissioner of Wealth Tax vs. Smt. Madhuri Marda (2009) - Tax planning vs. evasion',
      'Union of India vs. Azadi Bachao Andolan (2003) - Treaty interpretation'
    ];
    specificAnalysis = `### Taxation Law Framework

**Income Tax:**
- Assessment Years and Filing Deadlines
- Different heads of income (Salary, Capital Gains, Business, Other Sources)
- Deductions under Chapter VI-A (80C, 80D, etc.)
- TDS compliance and credit mechanism

**GST:**
- Registration threshold: Rs. 40 lakhs (20 lakhs for special states)
- Regular returns: GSTR-1, GSTR-3B monthly
- Input Tax Credit (ITC) rules
- Reverse charge mechanism
- Anti-profiteering provisions

**Assessment and Appeals:**
- Scrutiny assessment
- Best judgment assessment
- Appeals: Commissioner (Appeals) → Tribunal → High Court → Supreme Court
- Limitation periods for assessment and reassessment`;
    
    recommendations = [
      'Maintain proper books of accounts and supporting documents',
      'File returns within due dates to avoid penalties',
      'Claim all eligible deductions and tax credits',
      'Respond promptly to tax notices with proper documentation',
      'Consider advance tax ruling for complex transactions'
    ];
  }
  
  // Default general response for other queries
  else {
    specificProvisions = [
      'Indian Penal Code, 1860 (IPC)',
      'Code of Civil Procedure, 1908 (CPC)',
      'Code of Criminal Procedure, 1973 (CrPC)',
      'Indian Evidence Act, 1872'
    ];
    keyCases = [
      'Kesavananda Bharati vs. State of Kerala (1973) - Basic structure doctrine',
      'Maneka Gandhi vs. Union of India (1978) - Article 21 interpretation',
      'Vishaka vs. State of Rajasthan (1997) - Judicial activism'
    ];
    specificAnalysis = `### Legal Analysis

This matter pertains to **${query}** which requires careful examination of applicable laws, precedents, and procedural requirements.

**General Legal Principles:**
- Rule of law and due process
- Natural justice (audi alteram partem, nemo judex in causa sua)
- Burden of proof
- Standard of proof (preponderance of probabilities for civil, beyond reasonable doubt for criminal)

**Procedural Considerations:**
- Jurisdiction of appropriate court/forum
- Limitation periods under Limitation Act, 1963
- Court fees and procedural compliance
- Alternative Dispute Resolution (mediation, arbitration)`;
    
    recommendations = [
      'Gather all relevant documents and evidence',
      'Identify applicable statutes and recent judicial precedents',
      'Verify jurisdiction and limitation periods',
      'Consider cost-benefit analysis of litigation vs. settlement',
      'Consult specialized legal counsel for detailed strategy'
    ];
  }
  
  // Build the complete response
  return `# Legal Research: "${query}"

## Research Summary

This is a comprehensive legal research analysis for your query regarding: **${query}** (${topic})

### Key Findings:

1. **Statutory Provisions**: Relevant sections under Indian law include:
${specificProvisions.map(p => `   - ${p}`).join('\n')}

2. **Case Law Analysis**: Key precedents include:
${keyCases.map(c => `   - ${c}`).join('\n')}

3. **Legal Framework**:
   - Constitutional provisions applicable
   - Procedural requirements and timelines
   - Burden of proof and evidence standards
   - Available remedies and enforcement mechanisms

4. **Practical Application**:
   - Filing procedures and documentation
   - Court fees and associated costs
   - Expected timelines
   - Alternative resolution options

### Detailed Analysis:

${specificAnalysis}

### Procedural Requirements:

1. **Initial Steps:**
   - Legal notice (if applicable)
   - Demand/reply framework
   - Pre-litigation settlement attempts

2. **Documentation:**
   - All relevant agreements, contracts, or title documents
   - Correspondence and communications
   - Financial records and receipts
   - Witness statements and affidavits

3. **Court Process:**
   - Filing of plaint/petition with proper court fees
   - Service of summons on opposite party
   - Written statement/reply filing
   - Evidence and cross-examination
   - Arguments and final judgment

### Recommendations:

Based on this research, it is advisable to:
${recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

### Risk Assessment:

- **Strengths**: ${topic === 'general legal matter' ? 'Detailed analysis required based on specific facts' : 'Clear statutory framework and established precedents'}
- **Challenges**: Procedural compliance, evidence availability, time and costs
- **Success Factors**: Strong documentation, expert counsel, timely action

### Cost & Timeline Estimates:

- **Court Fees**: Varies by claim value (typically 2-7% for civil suits)
- **Professional Fees**: Rs. 25,000 - Rs. 2,50,000+ depending on complexity
- **Expected Duration**: 
  - Trial Court: 1-3 years
  - Appeals: Additional 2-5 years
  - Alternative Dispute Resolution: 3-12 months

### Conclusion:

This research provides a foundational understanding of the legal aspects related to **${query}**. The matter involves ${topic} and requires consideration of the statutory provisions, case law precedents, and procedural requirements outlined above.

**Next Steps:**
1. Detailed case-specific fact analysis
2. Evidence gathering and documentation
3. Legal strategy formulation
4. Jurisdictional and limitation period verification
5. Engagement of specialized counsel

---

**⚠️ Important Disclaimer**: This is AI-generated research for preliminary understanding only. It does NOT constitute legal advice. Always verify with current law and consult qualified legal professionals for case-specific advice and strategy.

**Research Generated**: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}  
**Client ID**: ${clientId}  
**Admin Context**: ${adminPrompt || 'Standard legal research'}  
**Status**: ✅ Complete`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, clientId, context, adminPrompt } = body;

    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate query-specific response
    const researchContent = generateResearchResponse(query, clientId || 'unknown', adminPrompt || context);

    const mockResponse = {
      success: true,
      data: {
        results: [{
          summary: researchContent,
          metadata: {
            query,
            clientId: clientId || 'unknown',
            adminPrompt,
            timestamp: new Date().toISOString(),
            sources: [
              'Indian Penal Code (IPC)',
              'Code of Civil Procedure (CPC)',
              'Code of Criminal Procedure (CrPC)',
              'Indian Evidence Act, 1872',
              'Constitution of India',
              'Supreme Court Judgments Database',
              'High Court Orders and Precedents'
            ],
            searchTime: 1.5,
            totalResults: 1
          }
        }]
      }
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process research request' },
      { status: 500 }
    );
  }
}
