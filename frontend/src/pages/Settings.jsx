import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Globe,
  Save,
  X,
  Key,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Mail,
  Lock,
  Database,
  Palette
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { setPageTitle } = useApp();
  const { theme, toggleTheme, setThemePreference, themeOptions } = useTheme();
  
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    theme: theme,
    
    // Notification Settings
    emailNotifications: {
      jobMatches: true,
      assessmentResults: true,
      careerGuidance: false,
      systemUpdates: true,
      marketing: false
    },
    pushNotifications: {
      enabled: true,
      jobMatches: true,
      messages: true,
      assessments: false
    },
    
    // Privacy Settings
    profileVisibility: 'public',
    showActivity: true,
    showContactInfo: false,
    allowSearchEngines: true,
    dataProcessing: true,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    
    // Account Settings
    accountType: user?.roles?.[0] || 'candidate',
    autoSave: true,
    beta: false
  });

  useEffect(() => {
    setPageTitle('Settings');
  }, [setPageTitle]);

  useEffect(() => {
    setSettings(prev => ({ ...prev, theme: theme }));
  }, [theme]);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [setting]: value }
        : value
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Apply theme changes
      if (settings.theme !== theme) {
        setThemePreference(settings.theme);
      }
      
      setHasChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings(prev => ({ ...prev, theme: theme }));
    setHasChanges(false);
    toast.info('Settings reset to default');
  };

  const handleExportData = () => {
    toast.info('Preparing data export...');
    // Simulate data export
    setTimeout(() => {
      toast.success('Data export ready for download');
    }, 2000);
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion is not available in demo mode');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'Account', icon: User }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and privacy settings
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              <X className="mr-2 h-4 w-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
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
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                General Preferences
              </h3>

              {/* Appearance */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  Appearance
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {themeOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleSettingChange('theme', null, option.value)}
                          className={`p-3 border rounded-lg text-center transition-all ${
                            settings.theme === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="text-2xl mb-1">{option.icon}</div>
                          <div className="text-sm font-medium">{option.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Localization */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Localization
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', null, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Format
                    </label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', null, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h3>

              {/* Email Notifications */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Email Notifications
                </h4>
                <div className="space-y-4">
                  {Object.entries(settings.emailNotifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {key === 'jobMatches' && 'Get notified when new jobs match your profile'}
                          {key === 'assessmentResults' && 'Receive your skill assessment results via email'}
                          {key === 'careerGuidance' && 'Weekly career tips and guidance recommendations'}
                          {key === 'systemUpdates' && 'Important updates about platform features'}
                          {key === 'marketing' && 'Product announcements and promotional content'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleSettingChange('emailNotifications', key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Push Notifications */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Push Notifications
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Enable Push Notifications
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow the app to send push notifications to your device
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications.enabled}
                      onChange={(e) => handleSettingChange('pushNotifications', 'enabled', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  
                  {settings.pushNotifications.enabled && (
                    <div className="ml-6 space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      {Object.entries(settings.pushNotifications).filter(([key]) => key !== 'enabled').map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleSettingChange('pushNotifications', key, e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Privacy & Visibility
              </h3>

              {/* Profile Visibility */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Profile Visibility
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Who can see your profile
                    </label>
                    <select
                      value={settings.profileVisibility}
                      onChange={(e) => handleSettingChange('profileVisibility', null, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="public">Public - Anyone can view</option>
                      <option value="registered">Registered users only</option>
                      <option value="connections">Connections only</option>
                      <option value="private">Private - Only you</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Show Activity Status
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Let others see when you're active on the platform
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showActivity}
                        onChange={(e) => handleSettingChange('showActivity', null, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Show Contact Information
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Display your email and phone number in your public profile
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.showContactInfo}
                        onChange={(e) => handleSettingChange('showContactInfo', null, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Search Engine Indexing
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Allow search engines to index your public profile
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.allowSearchEngines}
                        onChange={(e) => handleSettingChange('allowSearchEngines', null, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Processing */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  Data Processing
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Analytics & Improvement
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow us to analyze your usage patterns to improve our services
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.dataProcessing}
                      onChange={(e) => handleSettingChange('dataProcessing', null, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Settings
              </h3>

              {/* Authentication */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Authentication
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Two-Factor Authentication
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {settings.twoFactorAuth ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Enabled
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500 text-sm">
                          <AlertTriangle className="mr-1 h-4 w-4" />
                          Disabled
                        </span>
                      )}
                      <button
                        onClick={() => handleSettingChange('twoFactorAuth', null, !settings.twoFactorAuth)}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        {settings.twoFactorAuth ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Login Alerts
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.loginAlerts}
                      onChange={(e) => handleSettingChange('loginAlerts', null, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', null, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={240}>4 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Key className="mr-2 h-5 w-5" />
                  Password
                </h4>
                <div className="space-y-4">
                  <button
                    onClick={() => toast.info('Password change functionality coming soon!')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Key className="mr-2 h-5 w-5" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Management
              </h3>

              {/* Account Type */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account Information
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Account Type
                    </label>
                    <select
                      value={settings.accountType}
                      onChange={(e) => handleSettingChange('accountType', null, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="candidate">Job Seeker</option>
                      <option value="hr">HR Professional</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Auto-save
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Automatically save your progress and changes
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.autoSave}
                      onChange={(e) => handleSettingChange('autoSave', null, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Beta Features
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Get early access to new features and improvements
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.beta}
                      onChange={(e) => handleSettingChange('beta', null, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Data Export */}
              <div className="card-elevated p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Data Export
                </h4>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Download all your data including profile information, assessments, and activity history.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Export My Data
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="card-elevated p-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                <h4 className="font-medium text-red-900 dark:text-red-100 mb-4 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Danger Zone
                </h4>
                <div className="space-y-4">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
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
      {/* Footer */}
      <footer className="mt-12 mb-4 text-center text-xs text-gray-400 dark:text-gray-500">
        <span>
          &copy; {new Date().getFullYear()} CareerSync. All rights reserved.
        </span>
      </footer>
    </div>
  );
};

export default Settings;