import "./ErrorState.css"

/**
 * ErrorState Component
 * 
 * Displays error messages with optional retry action
 * Provides user-friendly error feedback with actionable next steps
 * 
 * @param {string} title - Error title (default: "Something went wrong")
 * @param {string} message - Detailed error message
 * @param {string} icon - Emoji icon (default: ⚠️)
 * @param {function} onRetry - Optional retry callback
 * @param {string} retryText - Retry button text (default: "Try Again")
 */
function ErrorState({
  title = "Something went wrong",
  message,
  icon = "⚠️",
  onRetry,
  retryText = "Try Again",
}) {
  return (
    <div className="error-state">
      <div className="error-state-icon">{icon}</div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button className="error-state-retry" onClick={onRetry}>
          🔄 {retryText}
        </button>
      )}
    </div>
  )
}

export default ErrorState
