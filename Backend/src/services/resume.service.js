const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');


pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfMake.vfs;



const generateResumePDF = async (jobDescription, selfDescription, userName = 'Candidate') => {
    const candidateName = String(userName || 'Candidate');
    const docDefinition = {
        content: [
            {
                text: 'TAILORED RESUME',
                style: 'header',
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            {
                text: candidateName.toUpperCase(),
                style: 'name',
                alignment: 'center',
                margin: [0, 0, 0, 5]
            },
            {
                text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                alignment: 'center',
                margin: [0, 0, 0, 15],
                color: '#ff467d'
            },

            // Professional Summary Section
            {
                text: 'PROFESSIONAL SUMMARY',
                style: 'sectionTitle',
                margin: [0, 0, 0, 10]
            },
            {
                text: generateProfessionalSummary(selfDescription, jobDescription),
                style: 'body',
                alignment: 'justify',
                margin: [0, 0, 0, 15]
            },

            // Key Qualifications Section
            {
                text: 'KEY QUALIFICATIONS',
                style: 'sectionTitle',
                margin: [0, 0, 0, 10]
            },
            {
                ul: extractKeySkills(selfDescription, jobDescription),
                style: 'body',
                margin: [0, 0, 0, 15]
            },

            // Target Role Alignment
            {
                text: 'TARGET ROLE: ' + extractJobTitle(jobDescription),
                style: 'sectionTitle',
                margin: [0, 0, 0, 10]
            },
            {
                text: generateRoleAlignment(selfDescription, jobDescription),
                style: 'body',
                alignment: 'justify',
                margin: [0, 0, 0, 15]
            },

            // Experience Highlights
            {
                text: 'EXPERIENCE HIGHLIGHTS',
                style: 'sectionTitle',
                margin: [0, 0, 0, 10]
            },
            {
                ul: generateExperienceHighlights(selfDescription),
                style: 'body',
                margin: [0, 0, 0, 15]
            },

            // Technical Skills
            {
                text: 'TECHNICAL SKILLS',
                style: 'sectionTitle',
                margin: [0, 0, 0, 10]
            },
            {
                text: extractTechnicalSkills(jobDescription),
                style: 'body',
                margin: [0, 0, 0, 15]
            },

            // Soft Skills
            {
                text: 'PROFESSIONAL SKILLS',
                style: 'sectionTitle',
                margin: [0, 0, 0, 10]
            },
            {
                ul: ['Leadership & Team Collaboration', 'Problem Solving & Critical Thinking', 'Communication & Presentation', 'Project Management', 'Adaptability & Continuous Learning'],
                style: 'body',
                margin: [0, 0, 0, 20]
            },

            {
                text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                alignment: 'center',
                color: '#ff467d',
                margin: [0, 10, 0, 10]
            },
            {
                text: 'This resume was tailored based on your profile and the target job description using AI analysis.',
                style: 'footer',
                alignment: 'center',
                fontSize: 9,
                color: '#666666'
            }
        ],

        styles: {
            header: {
                fontSize: 24,
                bold: true,
                color: '#ff467d',
                letterSpacing: 2
            },
            name: {
                fontSize: 16,
                bold: true,
                color: '#1a1a1a'
            },
            sectionTitle: {
                fontSize: 12,
                bold: true,
                color: '#1a1a1a',
                textDecoration: 'underline',
                textDecorationColor: '#ff467d'
            },
            body: {
                fontSize: 10,
                color: '#333333',
                lineHeight: 1.4
            },
            footer: {
                color: '#999999'
            }
        },

        // The browser build ships with Roboto in vfs_fonts. Helvetica is not
        // available there and causes pdfmake to throw asynchronously.
        defaultStyle: {
            font: 'Roboto'
        },

        pageMargins: [40, 40, 40, 40]
    };

    const pdfDoc = pdfMake.createPdf(docDefinition);
    const pdfBuffer = await pdfDoc.getBuffer();
    return Buffer.from(pdfBuffer);
};

// Helper Functions
const generateProfessionalSummary = (selfDescription, jobDescription) => {
    const selfSnippet = selfDescription.substring(0, 150);
    const jobMatch = extractJobTitle(jobDescription);
    return `Results-driven professional with expertise aligned to ${jobMatch} role. ${selfSnippet}... Proven track record of delivering high-impact solutions with strong technical expertise and interpersonal skills.`;
};

const extractKeySkills = (selfDescription, jobDescription) => {
    const skills = [];
    
    // Extract from job description
    const jobKeywords = jobDescription.toLowerCase().match(/\b(react|node|python|typescript|javascript|sql|aws|docker|kubernetes|git|agile|scrum)\b/gi) || [];
    const uniqueJobSkills = [...new Set(jobKeywords)].map(s => s.charAt(0).toUpperCase() + s.slice(1)).slice(0, 5);
    
    skills.push(...uniqueJobSkills);

    // Add generic relevant skills
    const genericSkills = ['Full-Stack Development', 'System Design', 'API Development', 'Database Management', 'Performance Optimization'];
    skills.push(...genericSkills.slice(0, 3));

    return skills.filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
};

const extractJobTitle = (jobDescription) => {
    const match = jobDescription.match(/(?:position|role|title)[:\s]*([^.\n]+)/i);
    return match ? match[1].trim() : 'Senior Engineer';
};

const generateRoleAlignment = (selfDescription, jobDescription) => {
    return `Your profile demonstrates strong alignment with the target role requirements. Your experience and skills directly match the key competencies outlined in the job description. This tailored resume highlights the most relevant aspects of your background to maximize your chances in this specific opportunity.`;
};

const generateExperienceHighlights = (selfDescription) => {
    const experiences = [];
    const sentences = selfDescription.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    experiences.push(sentences[0] || 'Strong technical background with progressive responsibility');
    experiences.push(sentences[1] || 'Demonstrated ability to deliver complex projects on time');
    experiences.push(sentences[2] || 'Proven success in cross-functional team environments');
    
    return experiences.map(e => e.trim());
};

const extractTechnicalSkills = (jobDescription) => {
    const skillCategories = {
        frontend: ['React', 'Vue.js', 'Angular', 'HTML/CSS', 'JavaScript/TypeScript'],
        backend: ['Node.js', 'Python', 'Java', 'C#', '.NET'],
        database: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'DynamoDB'],
        devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD']
    };

    const foundSkills = [];
    const jobDescLower = jobDescription.toLowerCase();

    for (const category in skillCategories) {
        for (const skill of skillCategories[category]) {
            if (jobDescLower.includes(skill.toLowerCase())) {
                foundSkills.push(skill);
            }
        }
    }

    return foundSkills.length > 0 
        ? foundSkills.slice(0, 12).join(' • ')
        : 'JavaScript • Python • React • Node.js • SQL • Git • AWS • Docker';
};

module.exports = {
    generateResumePDF
};
