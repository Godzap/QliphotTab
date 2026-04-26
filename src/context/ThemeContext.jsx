import { createContext, useContext, useEffect, useState } from 'react'

export const TEAMS = [
  {
    id:      'default',
    label:   'Corporação',
    sublabel: 'Paleta Base',
    color:   '#cc2222',
    textColor: '#e8d850',
    bg:      '#000000',
  },
  {
    id:      'info',
    label:   'Informação',
    sublabel: 'Time I',
    color:   '#c084f5',
    textColor: '#dab8ff',
    bg:      '#0a0818',
  },
  {
    id:      'welfare',
    label:   'Bem-Estar',
    sublabel: 'Time II',
    color:   '#40b8e0',
    textColor: '#80c8e8',
    bg:      '#030810',
  },
  {
    id:      'safety',
    label:   'Segurança',
    sublabel: 'Time III',
    color:   '#cc2222',
    textColor: '#f0c0c0',
    bg:      '#0a0000',
  },
  {
    id:      'control',
    label:   'Controle',
    sublabel: 'Time IV',
    color:   '#f5d020',
    textColor: '#f5e060',
    bg:      '#100e00',
  },
  {
    id:      'training',
    label:   'Treinamento',
    sublabel: 'Time V',
    color:   '#f0a030',
    textColor: '#f0c880',
    bg:      '#0f0804',
  },
]

const STORAGE_KEY = 'qliphot-team'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [team, setTeamState] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? 'default'
  )

  const setTeam = (id) => {
    localStorage.setItem(STORAGE_KEY, id)
    setTeamState(id)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-team', team)
  }, [team])

  return (
    <ThemeContext.Provider value={{ team, setTeam }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
