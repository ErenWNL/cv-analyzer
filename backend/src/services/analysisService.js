const Analysis = require('../models/Analysis');
const CV = require('../models/CV');
const CVParserService = require('./cvParserService');
const logger = require('../utils/logger');

class AnalysisService {
  constructor() {
    this.cvParser = new CVParserService();
  }

  /**
   * Process CV analysis
   */
  async processAnalysis(analysisId) {
    try {
      logger.info(`Starting analysis processing for ID: ${analysisId}`);

      // Get analysis record
      const analysis = await Analysis.findById(analysisId);
      if (!analysis) {
        throw new Error('Analysis not found');
      }

      // Mark as processing
      await analysis.startProcessing();

      // Get CV file
      const cv = await CV.findById(analysis.cvId);
      if (!cv) {
        throw new Error('CV not found');
      }

      // Parse CV content
      const parsedData = await this.parseCVContent(cv);

      // Perform analysis based on type
      const results = await this.performAnalysis(parsedData, analysis.analysisType, analysis.parameters);

      // Mark as completed
      await analysis.complete(results);

      logger.info(`Analysis processing completed for ID: ${analysisId}`);

      return results;
    } catch (error) {
      logger.error(`Error processing analysis ${analysisId}:`, error);
      
      // Mark as failed
      if (analysis) {
        await analysis.fail(error.message);
      }
      
      throw error;
    }
  }

  /**
   * Parse CV content
   */
  async parseCVContent(cv) {
    try {
      logger.info(`Parsing CV content for CV ID: ${cv._id}`);

      // Get file path
      const filePath = cv.filePath;
      const fileType = cv.fileType;

      // Parse CV using parser service
      const parsedData = await this.cvParser.parseCV(filePath, fileType);

      return parsedData;
    } catch (error) {
      logger.error(`Error parsing CV content for CV ID ${cv._id}:`, error);
      throw new Error(`CV parsing failed: ${error.message}`);
    }
  }

  /**
   * Perform analysis based on type
   */
  async performAnalysis(parsedData, analysisType, parameters = {}) {
    try {
      logger.info(`Performing ${analysisType} analysis`);

      let results = {};

      switch (analysisType) {
        case 'skills':
          results = await this.analyzeSkills(parsedData, parameters);
          break;
        case 'experience':
          results = await this.analyzeExperience(parsedData, parameters);
          break;
        case 'education':
          results = await this.analyzeEducation(parsedData, parameters);
          break;
        case 'overall':
          results = await this.analyzeOverall(parsedData, parameters);
          break;
        default:
          throw new Error(`Unknown analysis type: ${analysisType}`);
      }

      return results;
    } catch (error) {
      logger.error(`Error performing ${analysisType} analysis:`, error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze skills
   */
  async analyzeSkills(parsedData, parameters) {
    try {
      const { skills } = parsedData;
      
      if (!skills || !skills.technical) {
        return {
          score: 0,
          message: 'No skills found in CV',
          skills: [],
          recommendations: ['Add technical skills to your CV']
        };
      }

      // Calculate skills score
      const technicalSkills = skills.technical || [];
      const softSkills = skills.soft || [];
      const tools = skills.tools || [];
      const frameworks = skills.frameworks || [];
      const databases = skills.databases || [];
      const languages = skills.languages || [];

      // Score calculation logic
      let score = 0;
      let maxScore = 100;

      // Technical skills (40% of total score)
      const technicalScore = Math.min(technicalSkills.length * 2, 40);
      score += technicalScore;

      // Tools and frameworks (25% of total score)
      const toolsScore = Math.min((tools.length + frameworks.length) * 1.5, 25);
      score += toolsScore;

      // Databases (15% of total score)
      const dbScore = Math.min(databases.length * 3, 15);
      score += dbScore;

      // Programming languages (20% of total score)
      const langScore = Math.min(languages.length * 2, 20);
      score += langScore;

      // Generate recommendations
      const recommendations = this.generateSkillRecommendations(parsedData, score);

      return {
        score: Math.round(score),
        maxScore,
        skills: {
          technical: technicalSkills,
          soft: softSkills,
          tools,
          frameworks,
          databases,
          languages
        },
        breakdown: {
          technical: technicalScore,
          tools: toolsScore,
          databases: dbScore,
          languages: langScore
        },
        recommendations,
        analysis: {
          totalSkills: technicalSkills.length + softSkills.length + tools.length + frameworks.length + databases.length + languages.length,
          technicalCount: technicalSkills.length,
          softCount: softSkills.length,
          toolsCount: tools.length,
          frameworksCount: frameworks.length,
          databasesCount: databases.length,
          languagesCount: languages.length
        }
      };
    } catch (error) {
      logger.error('Error analyzing skills:', error);
      throw new Error(`Skills analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze experience
   */
  async analyzeExperience(parsedData, parameters) {
    try {
      const { experience } = parsedData;
      
      if (!experience || experience.length === 0) {
        return {
          score: 0,
          message: 'No work experience found in CV',
          experience: [],
          recommendations: ['Add work experience to your CV']
        };
      }

      // Calculate experience score
      let score = 0;
      let maxScore = 100;
      let totalYears = 0;
      let seniorPositions = 0;

      experience.forEach(exp => {
        // Calculate years of experience
        if (exp.duration) {
          const years = this.calculateYearsFromDuration(exp.duration);
          totalYears += years;
        }

        // Check for senior positions
        if (exp.title && exp.title.toLowerCase().includes('senior')) {
          seniorPositions++;
        }
      });

      // Score calculation logic
      // Years of experience (50% of total score)
      const yearsScore = Math.min(totalYears * 5, 50);
      score += yearsScore;

      // Position level (30% of total score)
      const positionScore = Math.min(seniorPositions * 15, 30);
      score += positionScore;

      // Experience variety (20% of total score)
      const varietyScore = Math.min(experience.length * 4, 20);
      score += varietyScore;

      // Generate recommendations
      const recommendations = this.generateExperienceRecommendations(parsedData, score);

      return {
        score: Math.round(score),
        maxScore,
        experience,
        breakdown: {
          years: yearsScore,
          position: positionScore,
          variety: varietyScore
        },
        analysis: {
          totalExperience: experience.length,
          totalYears,
          seniorPositions,
          averageYearsPerPosition: totalYears / experience.length
        },
        recommendations
      };
    } catch (error) {
      logger.error('Error analyzing experience:', error);
      throw new Error(`Experience analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze education
   */
  async analyzeEducation(parsedData, parameters) {
    try {
      const { education } = parsedData;
      
      if (!education || education.length === 0) {
        return {
          score: 0,
          message: 'No education found in CV',
          education: [],
          recommendations: ['Add education information to your CV']
        };
      }

      // Calculate education score
      let score = 0;
      let maxScore = 100;
      let highestDegree = '';
      let degreeScores = {
        'PhD': 100,
        'Master': 80,
        'Bachelor': 60,
        'Associate': 40,
        'High School': 20
      };

      education.forEach(edu => {
        if (edu.degree) {
          const degree = edu.degree.toLowerCase();
          let degreeScore = 0;

          if (degree.includes('phd') || degree.includes('doctorate')) {
            degreeScore = degreeScores['PhD'];
            highestDegree = 'PhD';
          } else if (degree.includes('master')) {
            degreeScore = degreeScores['Master'];
            highestDegree = 'Master';
          } else if (degree.includes('bachelor')) {
            degreeScore = degreeScores['Bachelor'];
            highestDegree = 'Bachelor';
          } else if (degree.includes('associate')) {
            degreeScore = degreeScores['Associate'];
            highestDegree = 'Associate';
          } else {
            degreeScore = degreeScores['High School'];
            highestDegree = 'High School';
          }

          score = Math.max(score, degreeScore);
        }
      });

      // Generate recommendations
      const recommendations = this.generateEducationRecommendations(parsedData, score);

      return {
        score: Math.round(score),
        maxScore,
        education,
        breakdown: {
          degree: score
        },
        analysis: {
          totalEducation: education.length,
          highestDegree,
          degreeLevel: this.getDegreeLevel(score)
        },
        recommendations
      };
    } catch (error) {
      logger.error('Error analyzing education:', error);
      throw new Error(`Education analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyze overall CV
   */
  async analyzeOverall(parsedData, parameters) {
    try {
      logger.info('Performing overall CV analysis');

      // Perform all individual analyses
      const skillsAnalysis = await this.analyzeSkills(parsedData, parameters);
      const experienceAnalysis = await this.analyzeExperience(parsedData, parameters);
      const educationAnalysis = await this.analyzeEducation(parsedData, parameters);

      // Calculate overall score (weighted average)
      const weights = {
        skills: 0.35,
        experience: 0.40,
        education: 0.25
      };

      const overallScore = Math.round(
        (skillsAnalysis.score * weights.skills) +
        (experienceAnalysis.score * weights.experience) +
        (educationAnalysis.score * weights.education)
      );

      // Generate overall recommendations
      const recommendations = this.generateOverallRecommendations(
        skillsAnalysis,
        experienceAnalysis,
        educationAnalysis
      );

      return {
        score: overallScore,
        maxScore: 100,
        breakdown: {
          skills: skillsAnalysis.score,
          experience: experienceAnalysis.score,
          education: educationAnalysis.score
        },
        weights,
        detailedAnalysis: {
          skills: skillsAnalysis,
          experience: experienceAnalysis,
          education: educationAnalysis
        },
        recommendations,
        summary: this.generateOverallSummary(overallScore, recommendations)
      };
    } catch (error) {
      logger.error('Error performing overall analysis:', error);
      throw new Error(`Overall analysis failed: ${error.message}`);
    }
  }

  /**
   * Generate skill recommendations
   */
  generateSkillRecommendations(parsedData, score) {
    const recommendations = [];

    if (score < 30) {
      recommendations.push('Add more technical skills to your CV');
      recommendations.push('Include programming languages you know');
      recommendations.push('Add tools and frameworks you have experience with');
    } else if (score < 60) {
      recommendations.push('Consider adding more advanced technical skills');
      recommendations.push('Include database technologies you know');
      recommendations.push('Add cloud platform experience if applicable');
    } else if (score < 80) {
      recommendations.push('Your skills section is good, consider adding specialized tools');
      recommendations.push('Include any certifications you have');
    }

    return recommendations;
  }

  /**
   * Generate experience recommendations
   */
  generateExperienceRecommendations(parsedData, score) {
    const recommendations = [];

    if (score < 30) {
      recommendations.push('Add more work experience to your CV');
      recommendations.push('Include internships or volunteer work if applicable');
      recommendations.push('Describe your responsibilities and achievements');
    } else if (score < 60) {
      recommendations.push('Add more details about your work experience');
      recommendations.push('Include quantifiable achievements');
      recommendations.push('Consider adding project-based experience');
    } else if (score < 80) {
      recommendations.push('Your experience section is comprehensive');
      recommendations.push('Consider highlighting leadership roles');
    }

    return recommendations;
  }

  /**
   * Generate education recommendations
   */
  generateEducationRecommendations(parsedData, score) {
    const recommendations = [];

    if (score < 30) {
      recommendations.push('Add your educational background to your CV');
      recommendations.push('Include any certifications or training programs');
    } else if (score < 60) {
      recommendations.push('Consider pursuing higher education if applicable');
      recommendations.push('Add any relevant certifications');
    } else if (score < 80) {
      recommendations.push('Your education background is strong');
      recommendations.push('Consider adding any specialized training');
    }

    return recommendations;
  }

  /**
   * Generate overall recommendations
   */
  generateOverallRecommendations(skillsAnalysis, experienceAnalysis, educationAnalysis) {
    const recommendations = [];

    // Combine recommendations from all analyses
    recommendations.push(...skillsAnalysis.recommendations);
    recommendations.push(...experienceAnalysis.recommendations);
    recommendations.push(...educationAnalysis.recommendations);

    // Remove duplicates
    return [...new Set(recommendations)];
  }

  /**
   * Generate overall summary
   */
  generateOverallSummary(score, recommendations) {
    if (score >= 80) {
      return 'Excellent CV with strong qualifications across all areas.';
    } else if (score >= 60) {
      return 'Good CV with room for improvement in some areas.';
    } else if (score >= 40) {
      return 'Fair CV that would benefit from additional content and details.';
    } else {
      return 'Basic CV that needs significant improvement to be competitive.';
    }
  }

  /**
   * Calculate years from duration string
   */
  calculateYearsFromDuration(duration) {
    // This is a simplified calculation - in practice, you'd want more sophisticated parsing
    if (typeof duration === 'string') {
      const years = duration.match(/(\d+)\s*year/);
      if (years) {
        return parseInt(years[1]);
      }
    }
    return 0;
  }

  /**
   * Get degree level description
   */
  getDegreeLevel(score) {
    if (score >= 80) return 'Advanced';
    if (score >= 60) return 'Bachelor';
    if (score >= 40) return 'Associate';
    return 'High School';
  }

  /**
   * Get analysis statistics
   */
  async getAnalysisStats(userId) {
    try {
      return await Analysis.getStats(userId);
    } catch (error) {
      logger.error('Error getting analysis stats:', error);
      throw error;
    }
  }

  /**
   * Get recent analyses
   */
  async getRecentAnalyses(userId, limit = 10) {
    try {
      return await Analysis.getRecent(userId, limit);
    } catch (error) {
      logger.error('Error getting recent analyses:', error);
      throw error;
    }
  }
}

module.exports = AnalysisService;
