import React, { useState } from "react";
import { TemplateProject } from "../../types/AnkiNoteType";
import { NoteBaseType, NOTE_BASE_TYPE_LABELS } from "../../types/NoteBaseType";
import styles from "./Sidebar.module.css";

// Simple SVG icons as React components
const Icons = {
  Document: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>
  ),

  Users: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16,4C18.2,4 20,5.8 20,8C20,10.2 18.2,12 16,12C13.8,12 12,10.2 12,8C12,5.8 13.8,4 16,4M16,14C20.4,14 24,15.8 24,18V20H8V18C8,15.8 11.6,14 16,14M8.5,11.5C9.9,11.5 11,10.4 11,9C11,7.6 9.9,6.5 8.5,6.5C7.1,6.5 6,7.6 6,9C6,10.4 7.1,11.5 8.5,11.5M8.5,13C5.8,13 0.5,14.4 0.5,17V19H7V17C7,15.9 7.2,14.7 8.5,13Z" />
    </svg>
  ),

  Store: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12,18H6V14H12M21,14V12L20,7H4L3,12V14H4V20H14V14H18V20H20V14M20,4H4V6H20V4Z" />
    </svg>
  ),

  Settings: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
    </svg>
  ),

  Trash: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
    </svg>
  ),

  Plus: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
    </svg>
  ),

  File: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>
  ),

  Share: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z" />
    </svg>
  ),

  EmptyFolder: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
    </svg>
  ),

  ChevronLeft: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
    </svg>
  ),

  ChevronRight: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
    </svg>
  ),
};

interface SidebarProps {
  userTemplates: TemplateProject[];
  sharedTemplates: TemplateProject[];
  selectedTemplateId: string | null;
  onSelectTemplate: (template: TemplateProject) => void;
  onCreateNew: () => void;
  onDeleteTemplate: (templateId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  userTemplates,
  sharedTemplates,
  selectedTemplateId,
  onSelectTemplate,
  onCreateNew,
  onDeleteTemplate,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredUserTemplates = userTemplates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const templatesByType = filteredUserTemplates.reduce<
    Record<string, TemplateProject[]>
  >((groups, template) => {
    const key = template.baseType ?? "other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(template);
    return groups;
  }, {});

  const typeOrder = [
    NoteBaseType.Basic,
    NoteBaseType.BasicReversed,
    NoteBaseType.BasicOptionalReversed,
    NoteBaseType.BasicTypeAnswer,
    NoteBaseType.Cloze,
    NoteBaseType.ImageOcclusion,
    "other",
  ] as string[];

  const sortedTypeKeys = Object.keys(templatesByType).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  return (
    <div
      className={`${styles.sidebar} ${
        isCollapsed ? styles.sidebarCollapsed : ""
      }`}
    >
      <div className={styles.sidebarHeader}>
        {!isCollapsed && (
          <h1 className={styles.sidebarTitle}>2anki Templates</h1>
        )}
        <button
          className={styles.collapseButton}
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Icons.ChevronRight className={styles.collapseIcon} />
          ) : (
            <Icons.ChevronLeft className={styles.collapseIcon} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className={styles.sidebarContent}>
            {/* Search */}
            <div className={styles.searchContainer}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Private Templates Section */}
            <div className={styles.sidebarSection}>
              <div className={styles.sectionHeader}>
                <Icons.Document className={styles.sectionIcon} />
                Private
              </div>

              {userTemplates.length === 0 ? (
                <div className={styles.emptyState}>
                  <Icons.EmptyFolder className={styles.emptyIcon} />
                  <div className={styles.emptyTitle}>No templates yet</div>
                  <div className={styles.emptyDescription}>
                    Create your first template to get started
                  </div>
                </div>
              ) : filteredUserTemplates.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyTitle}>No results</div>
                </div>
              ) : (
                sortedTypeKeys.map((typeKey) => (
                  <div key={typeKey} className={styles.typeGroup}>
                    <div className={styles.typeGroupLabel}>
                      {typeKey === "other"
                        ? "Other"
                        : NOTE_BASE_TYPE_LABELS[typeKey as NoteBaseType]}
                    </div>
                    <ul className={styles.sidebarList}>
                      {templatesByType[typeKey].map((template) => (
                        <li key={template.id} className={styles.sidebarItem}>
                          <button
                            className={`${styles.sidebarLink} ${
                              selectedTemplateId === template.id
                                ? styles.active
                                : ""
                            }`}
                            onClick={() => onSelectTemplate(template)}
                          >
                            <Icons.File className={styles.itemIcon} />
                            <span className={styles.itemText}>
                              {template.name}
                            </span>
                            <span
                              className={styles.deleteButton}
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (
                                  window.confirm(`Delete "${template.name}"?`)
                                ) {
                                  onDeleteTemplate(template.id);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.stopPropagation();
                                  if (
                                    window.confirm(`Delete "${template.name}"?`)
                                  ) {
                                    onDeleteTemplate(template.id);
                                  }
                                }
                              }}
                            >
                              <Icons.Trash className={styles.deleteIcon} />
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}

              <button className={styles.addButton} onClick={onCreateNew}>
                <Icons.Plus className={styles.addIcon} />
                Add new template
              </button>
            </div>

            {/* Shared Templates Section */}
            <div className={styles.sidebarSection}>
              <div className={styles.sectionHeader}>
                <Icons.Users className={styles.sectionIcon} />
                Shared
              </div>

              {sharedTemplates.length === 0 ? (
                <div className={styles.emptyState}>
                  <Icons.Share className={styles.emptyIcon} />
                  <div className={styles.emptyTitle}>No shared templates</div>
                  <div className={styles.emptyDescription}>
                    Share a template with a colleague to see it here
                  </div>
                </div>
              ) : (
                <ul className={styles.sidebarList}>
                  {sharedTemplates.map((template) => (
                    <li key={template.id} className={styles.sidebarItem}>
                      <button
                        className={`${styles.sidebarLink} ${
                          selectedTemplateId === template.id
                            ? styles.active
                            : ""
                        }`}
                        onClick={() => onSelectTemplate(template)}
                      >
                        <Icons.File className={styles.itemIcon} />
                        <span className={styles.itemText}>{template.name}</span>
                        <span className={styles.itemMeta}>
                          {template.ownerName}
                        </span>
                        <span
                          className={styles.deleteButton}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Delete "${template.name}"?`)) {
                              onDeleteTemplate(template.id);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                              if (
                                window.confirm(`Delete "${template.name}"?`)
                              ) {
                                onDeleteTemplate(template.id);
                              }
                            }
                          }}
                        >
                          <Icons.Trash className={styles.deleteIcon} />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
