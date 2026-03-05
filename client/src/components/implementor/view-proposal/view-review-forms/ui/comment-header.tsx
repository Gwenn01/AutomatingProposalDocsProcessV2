export const CommentHeader: React.FC<{ sectionName: string , children?: React.ReactNode}> = ({ sectionName, children }) => (
  <div className="flex flex-col gap-4 rounded-lg my-3 bg-green-50 border border-green-100 p-5">
    <h4 className="text-base font-semibold text-gray-800">{sectionName} Section Comment's</h4>
    {children}
  </div>
);