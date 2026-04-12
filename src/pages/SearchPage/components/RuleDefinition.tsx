import React from 'react';

import FlashcardType from './FlashcardType';
import { Details } from './styled';
import styles from '../../../styles/shared.module.css';

interface RuleDefinitionProps {
  description: string;
  title: string;
  options: string[];
  value: string[];
  onSelected: (value: string) => void;
}

export default function RuleDefinition(props: RuleDefinitionProps) {
  const { title, options, value, onSelected, description } = props;
  return (
    <Details>
      <summary>{title}</summary>
      <p>{description}</p>
      <div className={styles.flexWrap}>
        {options.map((fco) => (
          <FlashcardType
            key={fco}
            active={value.includes(fco)}
            name={fco}
            onSwitch={(name) => onSelected(name)}
          />
        ))}
      </div>
    </Details>
  );
}
