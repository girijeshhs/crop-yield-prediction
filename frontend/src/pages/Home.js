import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="mx-auto max-w-5xl space-y-8 text-center">
      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
        Crop Yield Prediction & Disease Detection
      </h1>
      <p className="mx-auto max-w-3xl text-base text-slate-600 sm:text-lg">
        Empower your farming decisions with AI-driven insights. Predict crop yield based on key
        environmental metrics and detect plant diseases early using image recognition.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          to="/predict"
          className="rounded-lg bg-primary px-6 py-3 text-white shadow hover:bg-primary/90"
        >
          Predict Crop Yield
        </Link>
        <Link
          to="/disease"
          className="rounded-lg border border-primary px-6 py-3 text-primary shadow hover:bg-primary/10"
        >
          Detect Plant Disease
        </Link>
      </div>
      <div className="grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Real-time Predictions</h2>
          <p className="mt-2 text-sm text-slate-600">
            Leverage a trained CatBoost model to estimate expected yield for your crops using local
            climate and soil data.
          </p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Early Disease Detection</h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload leaf images to identify potential diseases with a CNN classifier and receive
            actionable treatment recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;
