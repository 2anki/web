import React from "react";
import {
  NoteBaseType,
  NOTE_BASE_TYPE_LABELS,
  NOTE_BASE_TYPE_DESCRIPTIONS,
} from "../../types/NoteBaseType";
import styles from "./NewTemplateDialog.module.css";

interface NewTemplateDialogProps {
  onSelect: (baseType: NoteBaseType) => void;
  onCancel: () => void;
}

const NewTemplateDialog: React.FC<NewTemplateDialogProps> = ({
  onSelect,
  onCancel,
}) => {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Choose a note type</h2>
        <p className={styles.subtitle}>
          Your custom template will inherit the fields and card structure from
          the selected type.
        </p>
        <ul className={styles.typeList}>
          {Object.values(NoteBaseType).map((baseType) => (
            <li key={baseType}>
              <button
                className={styles.typeButton}
                onClick={() => onSelect(baseType)}
              >
                <span className={styles.typeName}>
                  {NOTE_BASE_TYPE_LABELS[baseType]}
                </span>
                <span className={styles.typeDescription}>
                  {NOTE_BASE_TYPE_DESCRIPTIONS[baseType]}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button className={styles.cancelButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NewTemplateDialog;
