/**
 *
 * @param content HTML from server
 * @returns JSX component
 */

export const renderContent = (content: string) => (
  <div className="content">
    {/* eslint-disable-next-line react/no-danger */}
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);
