const MainContent = ({ active }) => {
  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {active.charAt(0).toUpperCase() + active.slice(1)}
        </h1>
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <p className="text-muted-foreground">
            Content for {active} will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
