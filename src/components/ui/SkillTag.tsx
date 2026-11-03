import React from 'react';
import type { Skill } from '../../types';
import { X } from 'lucide-react';

interface SkillTagProps {
  skill: Skill;
  type?: 'offer' | 'need' | 'neutral';
  onRemove?: () => void;
  className?: string;
}

export function SkillTag({ skill, type = 'neutral', onRemove, className = '' }: SkillTagProps) {
  return (
    <span className={`skill-tag skill-tag-${type} ${className}`}>
      {skill.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          style={{
            marginLeft: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 14,
            height: 14,
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            padding: 0,
            color: 'inherit',
            opacity: 0.7,
          }}
          aria-label={`Remove ${skill.name}`}
        >
          <X size={10} aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
