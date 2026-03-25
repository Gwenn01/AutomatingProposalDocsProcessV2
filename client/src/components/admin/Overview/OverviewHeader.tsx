const OverviewHeader = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 mb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Overview Dashboard
        </h1>
        <p className="text-gray-500 text-sm font-normal">
          Monitoring proposal metrics and workflow status.
        </p>
      </div>
    </div>
  );
};

export default OverviewHeader;
