const BRACKET_STYLES = {
  Death:       'bracket-tag bracket-tag-death',
  Possession:  'bracket-tag bracket-tag-possession',
}

function parseBrackets(text) {
  const parts = []
  const regex = /\[([^\]]+)\]/g
  let last = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ type: 'text', content: text.slice(last, match.index) })
    }
    const inner = match[1]
    const baseTag = inner.split(' ')[0]
    const style = BRACKET_STYLES[baseTag] ?? 'bracket-tag'
    parts.push({ type: 'tag', content: inner, style })
    last = match.index + match[0].length
  }

  if (last < text.length) {
    parts.push({ type: 'text', content: text.slice(last) })
  }
  return parts
}

export default function RichText({ text, className = '' }) {
  if (!text) return null
  const parts = parseBrackets(text)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.type === 'text' ? (
          <span key={i}>{part.content}</span>
        ) : (
          <span key={i} className={`${part.style} mx-0.5`}>[{part.content}]</span>
        )
      )}
    </span>
  )
}
