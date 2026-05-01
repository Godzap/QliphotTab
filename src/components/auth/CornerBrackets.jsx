export default function CornerBrackets({ color = '#3A332C', size = 14, inset = 8 }) {
  const corners = [
    { top: inset, left: inset, borderWidth: '1px 0 0 1px' },
    { top: inset, right: inset, borderWidth: '1px 1px 0 0' },
    { bottom: inset, left: inset, borderWidth: '0 0 1px 1px' },
    { bottom: inset, right: inset, borderWidth: '0 1px 1px 0' },
  ]

  return (
    <>
      {corners.map((style, index) => (
        <span
          key={index}
          className="dpl-corner"
          style={{
            width: size,
            height: size,
            borderColor: color,
            ...style,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}
