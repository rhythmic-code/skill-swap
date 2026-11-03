import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Save, Plus, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { SkillTag } from '../components/ui/SkillTag';
import { Avatar } from '../components/ui/Avatar';
import { SKILL_CATEGORIES, DEMO_SKILLS } from '../data/demo';
import type {
  AvailabilityType,
  CollaborationType,
  Skill,
  SkillCategory,
  ProfileSkill,
} from '../types';

export function Settings() {
  const { profile, user, updateProfile } = useAuth();
  const { success } = useToast();

  const [form, setForm] = useState({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    college: profile?.college || '',
    course: profile?.course || '',
    city: profile?.city || '',
    graduation_year: profile?.graduation_year?.toString() || '',
    portfolio_url: profile?.portfolio_url || '',
    linkedin_url: profile?.linkedin_url || '',
    availability: profile?.availability || 'flexible' as AvailabilityType,
    collaboration_types: profile?.collaboration_types || [] as CollaborationType[],
  });

  const [offeredSkills, setOfferedSkills] = useState<Skill[]>(
    profile?.skills.filter(s => s.type === 'offer').map(s => s.skill) || []
  );
  const [neededSkills, setNeededSkills] = useState<Skill[]>(
    profile?.skills.filter(s => s.type === 'need').map(s => s.skill) || []
  );
  const [customSkill, setCustomSkill] = useState('');
  const [customCategory, setCustomCategory] = useState<SkillCategory | ''>('');

  if (!user || !profile) {
    return (
      <div className="page-container py-16 text-center">
        <p className="text-stone-500 mb-4">Sign in to manage your settings.</p>
        <Link to="/auth/login" className="btn-primary">Sign in</Link>
      </div>
    );
  }

  const toggleCollabType = (ct: CollaborationType) => {
    setForm(f => ({
      ...f,
      collaboration_types: f.collaboration_types.includes(ct)
        ? f.collaboration_types.filter(x => x !== ct)
        : [...f.collaboration_types, ct],
    }));
  };

  const addSkill = (target: 'offer' | 'need', skill: Skill) => {
    if (target === 'offer') {
      if (!offeredSkills.find(s => s.id === skill.id)) setOfferedSkills(prev => [...prev, skill]);
    } else {
      if (!neededSkills.find(s => s.id === skill.id)) setNeededSkills(prev => [...prev, skill]);
    }
  };

  const addCustom = (target: 'offer' | 'need') => {
    if (!customSkill.trim() || !customCategory) return;
    const skill: Skill = {
      id: `custom-${Date.now()}`,
      name: customSkill.trim(),
      category: customCategory as SkillCategory,
    };
    addSkill(target, skill);
    setCustomSkill('');
  };

  const handleSave = () => {
    const skills: ProfileSkill[] = [
      ...offeredSkills.map(s => ({ skill: s, type: 'offer' as const })),
      ...neededSkills.map(s => ({ skill: s, type: 'need' as const })),
    ];

    updateProfile({
      ...form,
      graduation_year: form.graduation_year ? Number(form.graduation_year) : undefined,
      skills,
    });

    success('Profile saved!');
  };

  const collabOptions: { value: CollaborationType; label: string }[] = [
    { value: 'skill-barter', label: 'Skill Barter' },
    { value: 'project-collaboration', label: 'Project Collaboration' },
    { value: 'startup-team', label: 'Startup Team' },
    { value: 'portfolio-building', label: 'Portfolio Building' },
    { value: 'open-to-discuss', label: 'Open to Discuss' },
  ];

  return (
    <div className="page-container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="section-title">Settings</h1>
            <p className="section-subtitle">Update your profile and preferences.</p>
          </div>
          <Link to={`/users/${profile.username}`} className="btn-ghost text-sm">
            <ExternalLink size={15} />
            View profile
          </Link>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-4 mb-2">
              <Avatar src={profile.avatar_url} name={profile.display_name} size="xl" />
              <div>
                <p className="font-semibold text-stone-900">{profile.display_name}</p>
                <p className="text-sm text-stone-400">@{profile.username}</p>
              </div>
            </div>
            <h2 className="font-semibold text-stone-900">Profile information</h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Display name</label>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/\s+/g, '_') }))}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="label">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="input min-h-[100px]"
                placeholder="Tell others about yourself, your goals, and what you are building…"
                maxLength={400}
              />
              <p className="text-xs text-stone-400 mt-1">{form.bio.length}/400</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">College / University</label>
                <input
                  type="text"
                  value={form.college}
                  onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Field of study</label>
                <input
                  type="text"
                  value={form.course}
                  onChange={e => setForm(f => ({ ...f, course: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Graduation year</label>
                <input
                  type="number"
                  value={form.graduation_year}
                  onChange={e => setForm(f => ({ ...f, graduation_year: e.target.value }))}
                  className="input"
                  min={2024}
                  max={2032}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Portfolio URL</label>
                <input
                  type="url"
                  value={form.portfolio_url}
                  onChange={e => setForm(f => ({ ...f, portfolio_url: e.target.value }))}
                  className="input"
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="label">LinkedIn URL</label>
                <input
                  type="url"
                  value={form.linkedin_url}
                  onChange={e => setForm(f => ({ ...f, linkedin_url: e.target.value }))}
                  className="input"
                  placeholder="https://linkedin.com/in/…"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-stone-900">Availability & collaboration</h2>
            <div>
              <label className="label">Availability</label>
              <select
                value={form.availability}
                onChange={e => setForm(f => ({ ...f, availability: e.target.value as AvailabilityType }))}
                className="input"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="evenings">Evenings</option>
                <option value="weekends">Weekends</option>
                <option value="flexible">Flexible</option>
                <option value="limited">Limited</option>
              </select>
            </div>
            <div>
              <label className="label">Collaboration types</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {collabOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleCollabType(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      form.collaboration_types.includes(opt.value)
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-stone-600 border-stone-300 hover:border-indigo-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills offered */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-stone-900">Skills you offer</h2>
            <div className="flex flex-wrap gap-2">
              {offeredSkills.map(s => (
                <SkillTag
                  key={s.id}
                  skill={s}
                  type="offer"
                  onRemove={() => setOfferedSkills(prev => prev.filter(x => x.id !== s.id))}
                />
              ))}
            </div>
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {DEMO_SKILLS.slice(0, 15).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addSkill('offer', s)}
                    disabled={!!offeredSkills.find(x => x.id === s.id)}
                    className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-40 transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value as SkillCategory)}
                  className="input flex-1 text-sm"
                >
                  <option value="">Category</option>
                  {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  value={customSkill}
                  onChange={e => setCustomSkill(e.target.value)}
                  className="input flex-1 text-sm"
                  placeholder="Custom skill"
                />
                <button type="button" onClick={() => addCustom('offer')} className="btn-secondary px-3">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Skills needed */}
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-stone-900">Skills you need</h2>
            <div className="flex flex-wrap gap-2">
              {neededSkills.map(s => (
                <SkillTag
                  key={s.id}
                  skill={s}
                  type="need"
                  onRemove={() => setNeededSkills(prev => prev.filter(x => x.id !== s.id))}
                />
              ))}
            </div>
            <div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {DEMO_SKILLS.slice(0, 15).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addSkill('need', s)}
                    disabled={!!neededSkills.find(x => x.id === s.id)}
                    className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value as SkillCategory)}
                  className="input flex-1 text-sm"
                >
                  <option value="">Category</option>
                  {SKILL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="text"
                  value={customSkill}
                  onChange={e => setCustomSkill(e.target.value)}
                  className="input flex-1 text-sm"
                  placeholder="Custom skill"
                />
                <button type="button" onClick={() => addCustom('need')} className="btn-secondary px-3">
                  <Plus size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button onClick={handleSave} className="btn-primary px-8">
              <Save size={16} />
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
