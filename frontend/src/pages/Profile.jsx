import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  GraduationCap,
  Award,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Camera,
  Github,
  Linkedin,
  Globe,
  Download,
  Eye,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { setPageTitle } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    headline: '',
    summary: '',
    website: '',
    linkedin: '',
    github: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: []
  });

  useEffect(() => {
    setPageTitle('Profile');
  }, [setPageTitle]);

  // Mock data for development
  useEffect(() => {
    setProfileData(prev => ({
      ...prev,
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      headline: 'Full Stack Developer | React & Node.js Specialist',
      summary: 'Passionate full-stack developer with 3+ years of experience building scalable web applications. Expertise in React, Node.js, and modern JavaScript frameworks. Love solving complex problems and learning new technologies.',
      website: 'https://johndoe.dev',
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      experience: [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          company: 'TechCorp Inc.',
          location: 'San Francisco, CA',
          startDate: '2022-03',
          endDate: null,
          current: true,
          description: 'Lead frontend development for multiple React applications serving 100k+ users. Implemented modern UI/UX patterns and improved application performance by 40%.'
        },
        {
          id: 2,
          title: 'Full Stack Developer',
          company: 'StartupXYZ',
          location: 'Remote',
          startDate: '2020-08',
          endDate: '2022-02',
          current: false,
          description: 'Built and maintained full-stack applications using React, Node.js, and PostgreSQL. Collaborated with design and product teams to deliver high-quality features.'
        }
      ],
      education: [
        {
          id: 1,
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of California, Berkeley',
          location: 'Berkeley, CA',
          startDate: '2016-09',
          endDate: '2020-05',
          gpa: '3.8'
        }
      ],
      skills: [
        { name: 'JavaScript', level: 'Expert', years: 4 },
        { name: 'React', level: 'Expert', years: 3 },
        { name: 'Node.js', level: 'Advanced', years: 3 },
        { name: 'TypeScript', level: 'Advanced', years: 2 },
        { name: 'Python', level: 'Intermediate', years: 2 },
        { name: 'AWS', level: 'Intermediate', years: 1 }
      ],
      certifications: [
        {
          id: 1,
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          date: '2023-06',
          credentialId: 'AWS-CDA-12345'
        },
        {
          id: 2,
          name: 'React Developer Certification',
          issuer: 'Meta',
          date: '2022-12',
          credentialId: 'META-RDC-67890'
        }
      ],
      languages: [
        { name: 'English', level: 'Native' },
        { name: 'Spanish', level: 'Conversational' },
        { name: 'French', level: 'Basic' }
      ]
    }));
  }, []);

  const handleSave = async () => {
    try {
      // Update user profile
      const updatedUser = { ...user, name: profileData.name, email: profileData.email };
      updateUser(updatedUser);
      
      setIsEditing(false);
      setEditingSection(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingSection(null);
    // Reset form data
    setProfileData(prev => ({
      ...prev,
      name: user?.name || '',
      email: user?.email || ''
    }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: null,
      current: true,
      description: ''
    };
    setProfileData(prev => ({
      ...prev,
      experience: [newExperience, ...prev.experience]
    }));
    setEditingSection('experience');
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setProfileData(prev => ({
      ...prev,
      education: [newEducation, ...prev.education]
    }));
    setEditingSection('education');
  };

  const removeItem = (section, id) => {
    setProfileData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
    toast.success('Item removed successfully');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'Expert': return 'bg-green-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Intermediate': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card-elevated p-6">
        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-white" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileData.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {profileData.headline}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Mail className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button
                  onClick={() => toast.info('Profile sharing coming soon!')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Public
                </button>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4 mt-4">
              {profileData.website && (
                <a
                  href={profileData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </a>
              )}
              {profileData.linkedin && (
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {profileData.github && (
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        {profileData.summary && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {profileData.summary}
            </p>
          </div>
        )}

        {/* Save/Cancel buttons when editing */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="card-elevated">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Stats */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="card-elevated p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {profileData.experience.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Work Experience
                      </div>
                    </div>
                    <div className="card-elevated p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {profileData.skills.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Skills
                      </div>
                    </div>
                    <div className="card-elevated p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {profileData.certifications.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Certifications
                      </div>
                    </div>
                    <div className="card-elevated p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {profileData.languages.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Languages
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">{profileData.email}</span>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">{profileData.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Completed JavaScript Assessment
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Scored 87% • 2 days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <Briefcase className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Updated Work Experience
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Added Senior Frontend Developer role • 1 week ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Earned AWS Certification
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        AWS Certified Developer - Associate • 2 weeks ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Work Experience
                </h3>
                <button
                  onClick={addExperience}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </button>
              </div>

              <div className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={exp.id} className="card-elevated p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                          <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {exp.title}
                          </h4>
                          <p className="text-blue-600 dark:text-blue-400 font-medium">
                            {exp.company}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exp.location}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                          </p>
                          {exp.description && (
                            <p className="text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingSection(editingSection === `exp-${exp.id}` ? null : `exp-${exp.id}`)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem('experience', exp.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Education
                </h3>
                <button
                  onClick={addEducation}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </button>
              </div>

              <div className="space-y-6">
                {profileData.education.map((edu) => (
                  <div key={edu.id} className="card-elevated p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {edu.degree}
                          </h4>
                          <p className="text-purple-600 dark:text-purple-400 font-medium">
                            {edu.school}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {edu.location}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </p>
                          {edu.gpa && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              GPA: {edu.gpa}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingSection(editingSection === `edu-${edu.id}` ? null : `edu-${edu.id}`)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeItem('education', edu.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Technical Skills
                  </h3>
                  <button
                    onClick={() => toast.info('Add skill functionality coming soon!')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.skills.map((skill, index) => (
                    <div key={index} className="card-elevated p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          skill.level === 'Expert' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' :
                          skill.level === 'Advanced' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' :
                          skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200'
                        }`}>
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full ${getSkillLevelColor(skill.level)}`}
                          style={{ 
                            width: skill.level === 'Expert' ? '100%' : 
                                   skill.level === 'Advanced' ? '80%' : 
                                   skill.level === 'Intermediate' ? '60%' : '40%' 
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {skill.years} years experience
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Certifications
                  </h3>
                  <button
                    onClick={() => toast.info('Add certification functionality coming soon!')}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Certification
                  </button>
                </div>
                <div className="space-y-4">
                  {profileData.certifications.map((cert) => (
                    <div key={cert.id} className="card-elevated p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {cert.name}
                            </h4>
                            <p className="text-green-600 dark:text-green-400 text-sm">
                              {cert.issuer}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Issued: {formatDate(cert.date)} • ID: {cert.credentialId}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toast.info('Opening certificate verification...')}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Languages
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profileData.languages.map((lang, index) => (
                    <div key={index} className="card-elevated p-4 text-center">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {lang.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {lang.level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Settings
              </h3>
              
              {/* Privacy Settings */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  Privacy Settings
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Public Profile
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow others to view your profile
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Show Contact Information
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Display email and phone in public profile
                      </p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Activity Status
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Show when you're active on the platform
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
              </div>

              {/* Data Export */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                  Data & Export
                </h4>
                <div className="space-y-4">
                  <button
                    onClick={() => toast.info('Generating profile PDF...')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Profile as PDF
                  </button>
                  <button
                    onClick={() => toast.info('Exporting data...')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Export All Data
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card-elevated p-6 border border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-4">
                  Danger Zone
                </h4>
                <div className="space-y-4">
                  <button
                    onClick={() => toast.error('This action is not available in demo mode')}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="mr-2 h-5 w-5" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;