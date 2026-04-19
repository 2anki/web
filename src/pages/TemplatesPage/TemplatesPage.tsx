import TemplateEditor from './components/TemplateEditor/TemplateEditor';
import styles from './TemplatesPage.module.css';
import './monaco-setup';

export default function TemplatesPage() {
  return (
    <div className={styles.templatesRoot}>
      <TemplateEditor />
    </div>
  );
}
