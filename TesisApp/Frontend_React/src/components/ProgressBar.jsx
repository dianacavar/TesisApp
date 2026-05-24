function ProgressBar({ steps, currentStep }) {
  const progress = steps.length > 1 ? currentStep / (steps.length - 1) : 0;

  return (
    <div className="progress">
      <div className="progress-track" style={{ '--progress': progress }}>
        {steps.map((step, idx) => {
          const isActive = idx === currentStep;
          const isCompleted = idx < currentStep;
          const className = [
            'progress-step',
            isActive && 'active',
            isCompleted && 'completed',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div key={step.id} className={className}>
              <div className="progress-circle">
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div className="progress-label">{step.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressBar;
