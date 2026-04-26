const BRACKET_STYLES = {
  Death: 'bracket-tag bracket-tag-death',
  Possession: 'bracket-tag bracket-tag-possession',
}

const TEXT_REPLACEMENTS = [
  [/Guideline/g, 'Diretriz'],
  [/Unlock Conditions/g, 'Condicoes de Acesso'],
  [/Effect/g, 'Funcao'],
  [/When the work result was good/g, 'Quando o resultado do trabalho foi bom'],
  [/When the work result was bad/g, 'Quando o resultado do trabalho foi ruim'],
  [/When the work result was neutral/g, 'Quando o resultado do trabalho foi neutro'],
  [/When work was performed/g, 'Quando o trabalho foi realizado'],
  [/When an employee/g, 'Quando um funcionario'],
  [/When the employee/g, 'Quando o funcionario'],
  [/employees/g, 'funcionarios'],
  [/employee/g, 'funcionario'],
  [/containment cell/g, 'cela de contencao'],
  [/containment chamber/g, 'camara de contencao'],
  [/containment/g, 'contencao'],
  [/department/g, 'departamento'],
  [/facility/g, 'instalacao'],
  [/abnormalities/g, 'anomalias'],
  [/abnormality/g, 'anomalia'],
  [/Tool/g, 'Sistema'],
  [/tool/g, 'sistema'],
  [/works with/g, 'interage com'],
  [/worked with/g, 'interagiu com'],
  [/work with/g, 'interagir com'],
  [/work type/g, 'tipo de trabalho'],
  [/Health/g, 'Vida'],
  [/Sanity/g, 'Sanidade'],
  [/Damage/g, 'Dano'],
  [/Death/g, 'Morte'],
  [/Possession/g, 'Possessao'],
  [/suppressed/g, 'suprimida'],
  [/suppression/g, 'supressao'],
  [/escaped/g, 'escapou'],
  [/escape/g, 'escapar'],
  [/good/g, 'bom'],
  [/bad/g, 'ruim'],
  [/neutral/g, 'neutro'],
]

export function translateTextContent(text) {
  if (!text) return text
  return TEXT_REPLACEMENTS.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), text)
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
    const inner = translateTextContent(match[1])
    const baseTag = match[1].split(' ')[0]
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
  const translated = translateTextContent(text)
  const parts = parseBrackets(translated)
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
