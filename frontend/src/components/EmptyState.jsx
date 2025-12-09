import "./EmptyState.css"

/**
 * EmptyState Component
 * 
 * Displays a friendly empty state with optional action button
 * Used when no data is available (analytics, recommendations, resources)
 * 
 * @param {string} icon - Emoji icon to display (default: 📭)
 * @param {string} title - Main heading text
 * @param {string} message - Descriptive message for the empty state
 * @param {string} actionText - Optional button text
 * @param {function} onAction - Optional button click handler
 */
function EmptyState({
  icon = "📭",
  title,
  message,
  actionText,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
      {actionText && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState
