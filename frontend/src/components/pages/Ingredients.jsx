// src/components/pages/Ingredients.jsx
const Ingredients = () => {
  return (
    <div className="ml-64 p-8 min-h-screen bg-background">
      <div className="max-w-6xl">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Ingredients Management
        </h1>
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
          <p className="text-muted-foreground">
            This is the Ingredients page. Here you will see all ingredients and can manage them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ingredients;
